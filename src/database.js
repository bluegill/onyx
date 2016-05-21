import logger from './logger';
import config from '../config/database';

export default class {
  constructor(){
    this.knex = require('knex')({
      client: 'mysql2',
      connection: {
        host     : config.host,
        user     : config.username,
        password : config.password,
        database : config.database
      }
    });
  }

  getItems(callback){
    this.knex('items').select('*').then((items) => {
      return callback(items, false);
    }).catch((error) => {
      return callback(0, error);
    });
  }

  getPlayerByName(username, callback){
    this.knex('users').select('*').where('username', username).then((player) => {
      return callback(player[0], false);
    }).catch((error) => {
      return callback(0, error);
    });
  }

  getPlayerById(id, callback){
    this.knex('users').select('*').where('id', id).then((player) => {
      return callback(player[0], false);
    }).catch((error) => {
      return callback(0, error);
    });
  }

  getPlayerData(id, callback){
    this.knex('users').select('username', 'color', 'head', 'face', 'neck', 'body', 'hand', 'feet', 'pin', 'photo').where('id', id).then((player) => {
      return callback(player[0], false);
    }).catch((error) => {
      return callback(0, error);
    });
  }

  updateColumn(user, column, value){
    this.knex('users').update(column, value).where('id', user).catch((error) => {
      logger.error(error);
    });
  }
}