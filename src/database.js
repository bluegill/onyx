import logger from './logger';
import utils  from './utils';

import config from '../config/database';

export default class {
  constructor(){
    this.knex = require('knex')({
      client: 'mariadb',
      connection: {
        host    : config.host,
        db      : config.database,
        user    : config.username,
        password: config.password       
      }
    });
  }

  updateColumn(user, column, value){
    return this.knex('users').update(column, value).where('id', user).then(() => {});
  }

  getItems(){
    return this.knex('items').select('*');
  }

  getPlayerByName(username){
    return this.knex('users').first('*').where('username', username);
  }

  getPlayerById(id){
    return this.knex('users').first('*').where('id', id);
  }

  addBan(moderator, user, duration, reason){
    return this.knex('bans').insert({
      'player': user,
      'moderator': moderator,
      'reason': reason,
      'duration': duration,
      'timestamp': utils.getTimestamp()
    }).then(() => {})
  }
}