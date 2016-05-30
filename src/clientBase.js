import chalk  from 'chalk';
import logger from './logger';

export default class {
  constructor(socket, server){
    this.socket   = socket;
    this.server   = server;
    this.database = server.database;
    this.knex     = server.database.knex;
    this.address  = socket.remoteAddress.split(':').pop();
  }

  send(data){
    if(this.socket){
      logger.debug('outgoing: ' + data);
      this.socket.write(data + '\0');
    }
  }
}