import libxmljs     from 'libxmljs';
import chokidar     from 'chokidar';

import crypto       from './Crypto';
import utils        from './Utils';
import logger       from './Logger';
import world        from './World';

export default class {
  constructor(server){
    this.server   = server;
    this.database = server.database;
    this.handlers = {
      'verChk': 'handleVersionCheck',
      'rndK'  : 'handleRandomKey',
      'login' : 'handleLogin'
    }

    // packet: timeout in seconds
    this.throttle = {
      'u#sf': 2,
      'u#sa': 3,
      'u#sb': 2,
      'u#se': 2,
      'u#ss': 3,
      'u#sj': 3,
      'u#sg': 5,
      'zo'  : 30
    }

    if(server.type == 'world'){
      this.world        = new world(server);
      this.server.world = this.world;

      this.watch();
    }
  }

  // not working on linux? chokidar dependency issue
  watch(directory){
    logger.debug(`Hotloading enabled, watching for code changes...`);

    let modules = {};

    chokidar.watch('./lib', {alwaysStat: true}).on('all', (event, path, stats) => {
      if(event == 'add') modules[path] = {size: stats.size};
      if(event == 'change'){
        if(modules[path].size !== stats.size){
          logger.info(`Reloaded code for ${path}...`);
          modules[path].size = stats.size;

          delete require.cache[path];
        }
      }
    });
  }

  handleVersionCheck(data, client){
    client.send('<msg t="sys"><body action="apiOK" r="0"></body></msg>');
  }

  handleRandomKey(data, client){
    client.randomKey = crypto.generateKey();
    client.send('<msg t="sys"><body action="rndK" r="-1"><k>' + client.randomKey + '</k></body></msg>');
  }

  handleLogin(data, client){
    const xml = libxmljs.parseXml(data);

    let nick  = (xml.get('//nick')).text();
    let pass  = (xml.get('//pword')).text();

    this.database.getPlayerByName(nick).then((player) => {
      if(this.server.type == 'login'){
        const hash = crypto.encryptPassword(player.password.toUpperCase(), client.randomKey);

        if(hash == pass){
          const loginKey   = crypto.md5(crypto.generateKey());
          const serverList = this.server.getList();

          this.database.updateColumn(player.id, 'loginKey', loginKey);

          client.sendXt('sd', -1, serverList);
          client.sendXt('l', -1, player.id, loginKey, '', '100,5');
        } else {
          client.sendError(101, true);
        }
      } else {
        const hash = pass.substr(pass.length - 32);

        if(hash.length == 32){

          // remove client if already signed in
          const playerObj = this.server.getClientById(player.id);
          if(playerObj) playerObj.disconnect();

          if(hash == player.loginKey){
            client.sendXt('l', -1);
            client.setClient(player);
          } else {
            client.sendError(101, true);
          }
          
          this.database.updateColumn(player.id, 'loginKey', '');
        }
      }
    }).catch((error) => {
      client.sendError(100, true);
    });
  }

  handleData(data, client){
    logger.debug('incoming: ' + data);

    const isGame = ((data.charAt(0) == '<') ? false : true);

    if(!isGame){
      if(data === '<policy-file-request/>'){
        client.send('<cross-domain-policy><allow-access-from domain="*" to-ports="*" /></cross-domain-policy>');
      } else {
        const xml    = libxmljs.parseXml(data);
        const action = (xml.get('//body')).attr('action').value();
        const method = this.handlers[action];
        
        if(typeof this[method] == 'function')
          this[method](data, client);
      }
    } else {
      data = data.split('%');
      data.splice(0, 2);

      let allowed  = ['g#ur', 'g#af', 'g#gf', 'g#gr', 'g#gm', 'm#sm'];

      const world  = this.world;
      const split  = data[1].split('#');
      
      const [type, action] = split;

      if((data.join('').includes('|') && !allowed.includes(data[1])) || (!client.id || !client.username))
        client.sendError(800, true);

      if(this.throttle[data[1]]){
        const packet  = data[1];
        const timeout = this.throttle[packet];

        if(!client.throttled)
          client.throttled = {};

        if(client.throttled[packet] && (utils.getTime() < client.throttled[packet]))
          return;

        client.throttled[packet] = utils.getTime() + timeout;
      }
      
      if(world.gameManager.handlers[data[0]]){
        const gameHandler = world.gameManager.handlers[data[0]][data[1]];

        if(world.gameManager[gameHandler])
          return world.gameManager[gameHandler](data, client);
      }

      let handler = world.handlers[type] ?
                    world.handlers[type][action] :
                    world.handlers[action];

      if(handler && data !== undefined){
        // data.splice(0, 3); // utilize es6 array destructuring

        if(world[handler]) world[handler](data, client);
      } else {
        logger.warn(`Missing handler for ${data[1]}`);
      }
    }
  }
}