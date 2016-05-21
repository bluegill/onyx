import chalk        from 'chalk';
import libxmljs     from 'libxmljs';
import chokidar     from 'chokidar';
import logger       from './logger';
import crypto       from './crypto';
import world        from './world';

export default class {
  constructor(server){
    this.server   = server;
    this.database = server.database;
    this.handlers = {
      'verChk': 'handleVersionCheck',
      'rndK'  : 'handleRandomKey',
      'login' : 'handleLogin'
    }

    if(server.type == 'world'){
      this.world = new world(server);
      this.watch();
    }
  }

  watch(directory){
    logger.debug(`Hotloading enabled, watching for code changes...`);

    let modules = {};

    chokidar.watch('./build', {alwaysStat: true}).on('all', (event, path, stats) => {
      if(event == 'add') modules[path] = {size: stats.size};
      if(event == 'change'){
        if(modules[path].size !== stats.size){
          logger.debug(`Reloaded code for ${path}...`);
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
    require('./handlers/handleLogin.js')(data, client, this.server);
  }

  parseData(data, client){
    //logger.debug(chalk.yellow('incoming') + ': ' + data);
    logger.debug('incoming: ' + data);

    const isGame = ((data.charAt(0) == '<') ? false : true);

    if(!isGame){
      if(data === '<policy-file-request/>'){
        client.send('<cross-domain-policy><allow-access-from domain="*" to-ports="*" /></cross-domain-policy>');
      } else {
        const xml    = libxmljs.parseXml(data);
        const action = (xml.get('//body')).attr('action').value();
        const method = this.handlers[action];
        
        if(typeof this[method] == 'function'){
          this[method](data, client);
        }
      }
    } else {
      data = data.split('%');
      data.splice(0, 2);

      let allowed = ['g#ur', 'm#sm'];

      const world  = this.world;
      const split  = data[1].split('#');
      const type   = split[0],
            action = split[1];

      if((data.join('').includes('|') && !allowed.includes(data[1])) || (!client.id || !client.username)){
        client.sendError(800);
        return this.server.removeClient(client);
      }

      if(data[0] == 'z'){
        return world.gameManager.handle(data, client);
      }

      let handler = world.handlers[type] ?
                    world.handlers[type][action] :
                    world.handlers[action];

      if(handler && data !== undefined){
        world.do(handler, data, client);
      } else {
        logger.warn(`Missing handler for ${data[1]}`);
      }
    }
  }
}