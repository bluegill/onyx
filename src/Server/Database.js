'use strict'

import utils from '../Utilities'
import logger from '../Utilities/Logger'

import * as config from '../Config'

export default class {
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
}
