import 'babel-polyfill';

import net           from 'net';
import utils         from './utils';
import logger        from './logger';
import client        from './client';
import database      from './database';
import eventListener from './eventListener';

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
    this.maxClients    = (options.maxClients ? options.maxClients : 250);
    this.clients       = [];

    this.database      = new database();
    this.eventListener = new eventListener(this);

    if(this.type == 'world'){
      this.roomManager = this.eventListener.world.roomManager;
    }

    this.createServer();

    ///////////

    process.on('SIGINT',  () => this.handleShutdown());
    process.on('SIGTERM', () => this.handleShutdown());
  }

  createServer(){
    net.createServer((socket) => {
      logger.info('A client has connected');

      let clientObj = new client(socket, this);

      if(this.clients.length >= this.maxClients){
        return clientObj.sendError(103); // server full
      }

      this.clients.push(clientObj);

      socket.on('data', (data) => {
        data = data.toString().split('\0')[0];
        this.eventListener.parseData(data, clientObj);
      });

      socket.on('end', () => {
        logger.info('A client has disconnected');
        this.removeClient(clientObj);
      });

      socket.on('error', (error) => {
        this.removeClient(clientObj);
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

      if(client.room){
        client.room.removeClient(client);
      }

      if(client.buddies){
        for(const buddy of client.buddies){
          if(this.isOnline(buddy)){
            this.getClientById(buddy).sendXt('bof', -1, client.id);
          }
        }
      }

      if(this.roomManager){
        const igloo = (client.id + 1000);
        if(this.roomManager.checkIgloo(igloo)){
          this.roomManager.closeIgloo(igloo);
        }
      }

      this.clients.splice(index, 1);
      client.socket.destroy();
    }
  }

  handleShutdown(){
    logger.warn('Server shutting down in 60 seconds...');

    for(const client of this.clients){
      client.sendError(990);
    }

    setTimeout(() => {
      for(const client of this.clients){
        client.sendError(1)
        process.exit();
      }
    }, 60000);
  }

  reloadModules(){
    const path = __dirname + '/handlers/';
    const modules = require('fs').readdirSync(path);

    for(var module of modules){
      delete require.cache[path + module];
    }
  }

  isOnline(id){
    for(const client of this.clients){
      if(client.id == id){
        return true;
      }
    }

    return false;
  }

  getClientById(id){
    for(const client of this.clients){
      if(client.id == id){
        return client;
      }
    }

    return false;
  }

  getClientByName(name){
    for(const client of this.clients){
      if(client.nickname.toLowerCase() == name.toLowerCase()){
        return client;
      }
    }

    return false;
  }

  getList(){
    const servers   = require('../config/server');
    let   serverArr = [];

    for(let id of Object.keys(servers)){
      if(servers[id].type == 'world'){
        const server = [id, servers[id].name, servers[id].host, servers[id].port];
        serverArr.push(server.join('|'));
      }
    }

    return serverArr.join('%');
  }
}