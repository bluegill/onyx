'use strict'

const logger = require('./Logger')
const utils = require('./Utils')

const config = require('../config')

module.exports = class {
  constructor () {
    this.knex = require('knex')({
      client: 'mariadb',
      connection: {
        'host': config.SERVER_DATABASE_HOST,
        'db': config.SERVER_DATABASE_NAME,
        'user': config.SERVER_DATABASE_USER,
        'password': config.SERVER_DATABASE_PASS
      }
    })
  }

  updateColumn (user, column, value) {
    return this.knex('users').update(column, value).where('id', user).then(() => {
      // execute
    }).catch((error) => {
      logger.error(error)
    })
  }

  getItems () {
    return this.knex('items').select('*')
  }

  getPlayerByName (username) {
    return this.knex('users').first('*').where('username', username)
  }

  getPlayerById (id) {
    return this.knex('users').first('*').where('id', id)
  }

  addBan (moderator, user, duration, reason) {
    return this.knex('bans').insert({
      'player': user,
      'moderator': moderator,
      'reason': reason,
      'duration': duration,
      'timestamp': utils.getTime()
    }).then(() => {
      // execute
    }).catch((error) => {
      logger.error(error)
    })
  }

  addLog (from, to, message) {
    // todo: add public messaging logging, maybe keep max of like 20 logs per user?
    return this.knex('messengerLog').insert({
      'from': from,
      'to': to,
      'message': message,
      'timestamp': utils.getTime()
    }).then(() => {
      // execute
    }).catch((error) => {
      logger.error(error)
    })
  }
}
