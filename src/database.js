import logger from './Logger';
import utils  from './Utils';

import {Database} from '../onyxConfig';

export default class {
  constructor(){
    this.knex = require('knex')({
      client: 'mariadb',
      connection: {
        'host': Database.host,
        'db': Database.database,
        'user': Database.user,
        'password': Database.pass      
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

  addLog(from, to, message){
    // todo: add public messaging logging, maybe keep max of like 20 logs per user?
    return this.knex('messengerLog').insert({
      'from': from,
      'to': to,
      'message': message,
      'timestamp': utils.getTimestamp()
    }).then(() => {});
  }
}