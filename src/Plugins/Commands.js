import pluginBase from './PluginBase';

/// TODO: REWRITE COMMANDS PLUGIN TO BE MORE EFFICIENT?

export default class extends pluginBase {
  constructor(manager){
    super(manager);

    this.commands = {
      'ping'  : 'handlePing',
      'global': 'handleGlobal',
      'id'    : 'handleGetId',
      'ai'    : 'handleAddItem',
      'ac'    : 'handleAddCoins',
      'gc'    : 'handleGiftCoins',
      'gift'  : 'handleGiftCoins',
      'jr'    : 'handleJoinRoom',
      'users' : 'handleUsers',
      'kick'  : 'handleKick',
      'mute'  : 'handleMute',
      'ban'   : 'handleBan',
      'bname' : 'handleBlockName',
      'ubname': 'handleUnblockName',
      'alert' : 'handleAlert',
      'warn'  : 'handleAlert',
      'find'  : 'handleFindPlayer',
      'goto'  : 'handleGotoPlayer',
      'summon': 'handleSummonPlayer',
      'nick'  : 'handleNick',
      'reload': 'handleReload',
      'color' : 'handleUpdateColor',
      'speed' : 'handleUpdateSpeed',
      'up'    : 'handleUpdatePlayer'
    };

    const handleSendMessage = this.world.handleSendMessage;

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
        handleSendMessage.apply(this.world, [data, client]);
      }
    };
  }

  handleUpdatePlayer(cmd, data, client){
    const type = cmd[0];
    const id   = parseInt(cmd[1]);

    const types = {
      'c': 'color',
      'h': 'head',
      'f': 'face',
      'n': 'neck',
      'b': 'body',
      'a': 'hand',
      'e': 'feet',
      'l': 'pin',
      'p': 'photo'
    };

    if(!type || !id) return;

    if(!isNaN(id)){
      if(!types[type]) return;
      
      const item = this.world.itemCrumbs[id];
      if(!item) return;

      if(!client.inventory.includes(id)){
        if(item.patched == 1 && client.rank < 1) return client.sendError(402);
        if(item.patched == 2 && client.rank < 2) return client.sendError(402);
        if(item.patched == 3 && client.rank < 4) return client.sendError(402);

        if(client.rank > 1) item.cost = 0;

        if(client.coins < item.cost) return client.sendError(401);

        client.removeCoins(item.cost);
        client.addItem(id);
      }

      client.room.sendXt('up' + type, -1, client.id, id);
      client.updateOutfit(types[type], id);
    }
  }

  handleFindPlayer(cmd, data, client){
    if(!client.isModerator) return;

    let playerObj = isNaN(cmd[0]) ? this.world.getClientByName(cmd[0]) : this.world.getClientById(cmd[0]);

    if(playerObj) client.sendXt('bf', -1, playerObj.room.id, playerObj.nickname);
  }

  handleGotoPlayer(cmd, data, client){
    if(!client.isModerator) return;

    let playerObj = isNaN(cmd[0]) ? this.world.getClientByName(cmd[0]) : this.world.getClientById(cmd[0]);

    if(playerObj){
      if(playerObj.room.id == client.room.id) return;
      this.world.handleJoinRoom({3: playerObj.room.id}, client);
    }
  }

  handleSummonPlayer(cmd, data, client){
    if(!client.isModerator) return;

    let playerObj = isNaN(cmd[0]) ? this.world.getClientByName(cmd[0]) : this.world.getClientById(cmd[0]);

    if(playerObj){
      if(playerObj.room.id == client.room.id) return;
      this.world.handleJoinRoom({3: client.room.id}, playerObj);
    }
  }

  handleBlockName(cmd, data, client){
    if(!client.isModerator) return;

    let playerObj = isNaN(cmd[0]) ? this.world.getClientByName(cmd[0]) : this.world.getClientById(cmd[0]);

    if(playerObj){
      const nickname = 'p' + playerObj.id;
      playerObj.nickname = nickname;
      playerObj.updateColumn('nickname', nickname);
      playerObj.sendXt('bn', -1, playerObj.id);
    }
  }

  handleUnblockName(cmd, data, client){
    if(!client.isModerator) return;

    let playerObj = this.world.getClientById(cmd[0]);

    if(playerObj){
      playerObj.nickname = playerObj.username;
      playerObj.updateColumn('nickname', playerObj.username);

      this.world.handleJoinRoom({3: playerObj.room.id}, playerObj);
    }
  }

  handleUpdateColor(cmd, data, client){
    let color = cmd[0];

    if(color.substr(0, 2) !== '0x')
      color = ('0x' + color);

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
    if(!client.isModerator) return;
    if(client.rank < 4)     return;
    
    this.world.reloadModules().then(() => {
      const bot = this.parent.getPlugin('bot');
      if(bot) bot.sendMessage('Handler modules have been reloaded and are now up-to-date!', client);
    });
  }

  handleUsers(cmd, data, client){
    const bot = this.parent.getPlugin('bot');
    if(bot) bot.sendMessage(`There are ${this.world.getUserCount()} users online!`, client);
  }

  handleGetId(cmd, data, client){
    const bot  = this.parent.getPlugin('bot');
    if(!bot) return;

    const name = cmd.join(' ');
    if(name.length > 2 && client.isModerator){
      const player = this.world.getClientByName(name);
      if(player) bot.sendMessage(`${player.nickname}'s ID is ${player.id}!`, client);
    } else {
      bot.sendMessage(`Your ID is ${client.id}!`, client);
    }
  }

  handlePing(cmd, data, client){
    const bot = this.parent.getPlugin('bot');
    if(bot) bot.sendMessage('Pong!', client);
  }

  handleKick(cmd, data, client){
    if(!client.isModerator) return;

    let playerObj = isNaN(cmd[0]) ? this.world.getClientByName(cmd[0]) : this.world.getClientById(cmd[0]);

    if(playerObj) playerObj.sendError(5, true);
  }

  handleMute(cmd, data, client){
    if(!client.isModerator) return;

    let playerObj = isNaN(cmd[0]) ? this.world.getClientByName(cmd[0]) : this.world.getClientById(cmd[0]);

    if(playerObj){
      player.isMuted = !player.isMuted;
    }
  }

  handleBan(cmd, data, client){
    if(!client.isModerator) return;

    let playerObj = isNaN(cmd[0]) ? this.world.getClientByName(cmd[0]) : this.world.getClientById(cmd[0]);
    let duration  = parseInt(cmd[1]);

    if(!duration) duration = 24;

    if(duration < 0)    duration = 0;
    if(duration > 999)  duration = 999;

    if(playerObj){
      this.world.database.addBan(client.id, playerObj.id, duration, `Banned by ${client.nickname}`);

      playerObj.sendXt('b', -1);
      playerObj.disconnect();
    }
  }

  handleNick(cmd, data, client){
    if(client.isModerator && client.rank >= 4){
      client.nickname = cmd.join(' ');
      this.world.handleJoinRoom({3: client.room.id}, client);
    }
  }

  handleGlobal(cmd, data, client){
    if(client.isModerator && client.rank >= 3){
      const bot = this.parent.getPlugin('bot');
      const msg = cmd.join(' ');

      if(bot && msg.length > 3)
        bot.sendGlobalMessage(msg)
    }
  }

  handleAlert(cmd, data, client){
    if(!client.isModerator) return;

    const type = cmd.shift();
    const message = cmd.join(' ');

    if(!message.length) return;

    if(type == 'room' && client.rank >= 3)
      return client.room.sendXt('wa', -1, message);

    if((type == 'global' || type == 'all' || type == 'server') && client.rank >= 3){
      const clients = this.world.server.clients;
      for(const client of clients){
        client.sendXt('wa', -1, message);
      }
      return;
    }

    let playerObj = isNaN(type) ? this.world.getClientByName(type) : this.world.getClientById(type);

    if(playerObj) playerObj.sendXt('wa', -1, message);
  }

  handleJoinRoom(cmd, data, client){
    const room = parseInt(cmd[0]);
    this.world.handleJoinRoom({3: room}, client);
  }

  handleAddItem(cmd, data, client){
    const item = parseInt(cmd[0]);

    if(!isNaN(item)){
      if(this.world.itemCrumbs[item])
        return client.addItem(item);
    }

    client.sendError(402);
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

  handleGiftCoins(cmd, data, client){
    if(!client.isModerator || client.rank < 3) return;

    let playerObj = isNaN(cmd[0]) ? this.world.getClientByName(cmd[0]) : this.world.getClientById(cmd[0]);
    let coins     = parseInt(cmd[1]);

    if(playerObj && !isNaN(coins)){
      if(coins > 50000) coins = 50000;

      playerObj.addCoins(coins);
      playerObj.sendXt('zo', -1, playerObj.coins);
    }
  }
}