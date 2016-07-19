import 'babel-polyfill';

import net           from 'net';
import fs            from 'fs';

import Promise       from 'bluebird';

Promise.promisifyAll(fs);

import utils         from './Utils';
import logger        from './Logger';
import client        from './Client';
import database      from './Database';
import eventListener from './EventListener';

export default class {
  constructor(options){
    logger.info('Starting server...');

    if(!options.id || !options.type || !options.port){
      logger.error('Missing server configuration options', options);
      process.exit();
    }
    
    this.id            = options.id;
    this.type          = options.type;
    this.port          = options.port;
    this.maxClients    = (options.maxClients ? options.maxClients : 100);
    this.clients       = [];

    this.database      = new database();
    this.eventListener = new eventListener(this);

    if(this.type == 'world'){
      this.roomManager = this.world.roomManager;
      this.gameManager = this.world.gameManager;
    }

    this.createServer();

    ///////////

    if(process.env.NODE_ENV === 'production'){
      process.on('SIGINT',  () => this.handleShutdown());
      process.on('SIGTERM', () => this.handleShutdown());
    }
  }

  createServer(){
    net.createServer((socket) => {
      logger.info('A client has connected');

      socket.setEncoding('utf8');

      let clientObj = new client(socket, this);

      if(this.clients.length >= this.maxClients){
        clientObj.sendError(103); // server full
        this.removeClient(clientObj);
      }

      this.clients.push(clientObj);

      socket.on('data', (data) => {
        data = data.toString().split('\0')[0];
        this.eventListener.handleData(data, clientObj);
      });

      socket.on('close', () => {
        logger.info('A client has disconnected');
        this.removeClient(clientObj);
      });

      socket.on('error', (error) => {
        this.removeClient(clientObj);
        if(error.code == 'ETIMEDOUT' || error.code == 'ECONNRESET')
          return;
        logger.error(error);
      });

    }).listen(this.port, () => {
      const type = utils.firstToUpper(this.type);
      logger.info(`${type} server listening on port ${this.port}`);
    });
  }

  removeClient(client){
    let index = this.clients.indexOf(client);

    if(index > -1){
      logger.debug('Removing disconnecting client...');

      if(client.room)
        client.room.removeClient(client);

      if(client.tableId)
        this.gameManager.leaveTable(client);

      if(client.buddies){
        for(const buddy of client.buddies){
          if(this.isOnline(buddy))
            this.getClientById(buddy).sendXt('bof', -1, client.id);
        }
      }

      if(this.roomManager){
        const igloo = (client.id + 1000);

        if(this.roomManager.checkIgloo(igloo))
          this.roomManager.closeIgloo(igloo);
      }

      this.clients.splice(index, 1);

      client.socket.end();
      client.socket.destroy();
    }
  }

  handleShutdown(){
    logger.warn('Server shutting down in 30 seconds...');

    for(const client of this.clients){
      client.sendError(990);
    }

    setTimeout(() => {
      for(const client of this.clients){
        this.removeClient(client);
      }
      process.exit();
    }, 30000);
  }

  reloadModules(){
    return fs.readdirAsync(__dirname + '/Handlers').map((file) => {
      if(file.substr(file.length - 3) == '.js')
          delete require.cache[file];
    }).then(() => {
      this.world.fetchHandlers();
      this.gameManager.fetchHandlers();
    });
  }

  isOnline(id){
    for(const client of this.clients){
      if(client.id == id)
        return true;
    }
    return false;
  }

  getClientById(id){
    for(const client of this.clients){
      if(client.id == id)
        return client;
    }
  }

  getClientByName(name){
    for(const client of this.clients){
      if(client.nickname.toLowerCase() == name.toLowerCase())
        return client;
    }
  }

  getList(){
    const servers   = require('../config/server');
    let   serverArr = [];

    for(const id of Object.keys(servers)){
      if(servers[id].type == 'world'){
        const server = [id, servers[id].name, servers[id].host, servers[id].port];
        serverArr.push(server.join('|'));
      }
    }

    return serverArr.join('%');
  }
}