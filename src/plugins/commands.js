import pluginBase from './pluginBase';

class commands extends pluginBase {
  constructor(manager){
    super(manager);

    this.commands = {
      'ping'  : 'handlePing',
      'global': 'handleGlobal',
      'id'    : 'handleGetId',
      'ai'    : 'handleAddItem',
      'ac'    : 'handleAddCoins',
      'jr'    : 'handleJoinRoom',
      'users' : 'handleUsers',
      'kick'  : 'handleKick',
      'mute'  : 'handleMute',
      'ban'   : 'handleBan',
      'find'  : 'handleFindPlayer',
      'goto'  : 'handleGotoPlayer',
      'summon': 'handleSummonPlayer',
      'nick'  : 'handleNick',
      'reload': 'handleReload',
      'color' : 'handleUpdateColor',
      'speed' : 'handleUpdateSpeed',
      'up'    : 'handleUpdatePlayer'
    };

    this.world.handleSendMessage = (data, client) => {
      const isCommand = (data[4].substr(0, 1) == '!');

      if(isCommand){
        let cmd    = (data[4].substr(1)).split(' ');
        let method = this.commands[cmd[0].toLowerCase()];

        if(typeof this[method] == 'function'){
          cmd.shift();
          this[method](cmd, data, client);
        }
      } else {
        // send message if not command
        this.world.do('handleSendMessage', data, client, true);
      }
    };
  }

  handleUpdatePlayer(cmd, data, client){
    const type = cmd[0];
    const id   = parseInt(cmd[1]);

    const types = ['c', 'h', 'f', 'n', 'b', 'a', 'e', 'l', 'p'];

    if(!type || !id) return;

    if(!isNaN(id)){
      if(!types.includes(type)) return;
      if(!client.inventory.includes(id)) client.addItem(id);
      
      this.world.do('handleUpdateClothing', {1: ('s#up' + type), 3: id}, client, true);
    }
  }

  handleFindPlayer(cmd, data, client){
    const name = cmd.join(' ');

    if(client.isModerator){
      const player = this.world.getClientByName(name);
      if(player !== undefined){
        client.sendXt('bf', -1, player.room.id, player.nickname);
      }
    }
  }

  handleGotoPlayer(cmd, data, client){
    const name = cmd.join(' ');

    if(client.isModerator){
      const player = this.world.getClientByName(name);
      if(player !== undefined){
        if(player.room.id == client.room.id) return;
        this.world.do('handleJoinRoom', {3: player.room.id}, client, true);
      }
    }
  }

  handleSummonPlayer(cmd, data, client){
    const name = cmd.join(' ');

    if(client.isModerator){
      const player = this.world.getClientByName(name);
      if(player !== undefined){
        if(player.room.id == client.room.id) return;
        this.world.do('handleJoinRoom', {3: client.room.id}, player, true);
      }
    }
  }

  handleUpdateColor(cmd, data, client){
    let color = cmd[0];

    if(color.substr(0, 2) !== '0x'){
      color = ('0x' + color);
    }

    if(/^0x[0-9A-F]{6}$/i.test(color) !== false || (!isNaN(color) && color < 50)){
      client.updateOutfit('color', color);
      client.room.sendXt('upc', -1, client.id, color);
    }
  }

  handleUpdateSpeed(cmd, data, client){
    let speed = parseInt(cmd[0]);

    if(!isNaN(speed) && client.rank >= 1){
      if(speed < 1)    speed = 0;
      if(speed > 120)  speed = 120;

      client.setCrumb('speed', speed);
      client.room.sendXt('ups', -1, client.id, speed);
    }    
  }

  handleReload(cmd, data, client){
    if(client.rank >= 3 && client.isModerator){
      const bot = this.parent.getPlugin('bot');
      if(bot) bot.sendMessage('Handler modules have been reloaded and are now up-to-date!', client);
      this.world.reloadModules();
    }
  }

  handleUsers(cmd, data, client){
    const bot = this.parent.getPlugin('bot');
    if(bot) bot.sendMessage(`There are ${this.world.getUserCount()} users online!`, client);
  }

  handleGetId(cmd, data, client){
    const bot  = this.parent.getPlugin('bot');
    if(!bot) return;

    const name = cmd.join(' ');
    if(name.length > 2){
      const player = this.world.getClientByName(name);
      if(player && client.isModerator) bot.sendMessage(`${player.nickname}'s ID is ${player.id}!`, client);
    } else {
      bot.sendMessage(`Your ID is ${client.id}!`, client);
    }
  }

  handlePing(cmd, data, client){
    const bot = this.parent.getPlugin('bot');
    if(bot) bot.sendMessage('Pong!', client);
  }

  handleKick(cmd, data, client){
    const id = cmd[0];
    if(client.isModerator){
      let player = this.world.getClientById(id);
      if(player){
        player.sendError(5);
        this.world.removeClient(player);
      }
    }
  }

  handleMute(cmd, data, client){
    const id = cmd[0];
    if(client.isModerator){
      const player = this.world.getClientById(id);
      if(player){
        player.isMuted = !player.isMuted;
      }
    }
  }

  handleBan(cmd, data, client){
  }

  handleNick(cmd, data, client){
    if(client.isModerator && client.rank >= 4){
      client.nickname = cmd.join(' ');
      this.world.do('handleJoinRoom', {3: client.room.id}, client);
    }
  }

  handleGlobal(cmd, data, client){
    if(client.isModerator && client.rank >= 3){
      const bot = this.parent.getPlugin('bot');
      const msg = cmd.join(' ');
      if(bot && msg.length > 3){
        bot.sendGlobalMessage(msg)
      }
    }
  }

  handleJoinRoom(cmd, data, client){
    const room = parseInt(cmd[0]);
    this.world.do('handleJoinRoom', {3: room}, client);
  }

  handleAddItem(cmd, data, client){
    const item = parseInt(cmd[0]);
    if(!isNaN(item)){
      if(this.world.itemCrumbs[item]){
        client.addItem(item);
      } else {
        client.sendError(402);
      }
    }
  }

  handleAddCoins(cmd, data, client){
    if(!client.isModerator) return;

    let coins = parseInt(cmd[0]);
    if(!isNaN(coins)){
      if(coins > 50000) coins = 50000;
      client.addCoins(coins);
      client.sendXt('zo', -1, client.coins);
    }
  }
}

module.exports = commands;