'use strict'

import fs from 'fs'
import path from 'path'

import logger from '../Utilities/Logger'

import * as Promise from 'bluebird'

import RoomManager from './Managers/RoomManager'
import GameManager from './Managers/GameManager'
import ExtensionManager from './Managers/ExtensionManager'

export default class {
  constructor (server) {
    this.server = server
    this.database = server.database
    this.knex = server.database.knex

    this.fetchCrumbs()

    this.roomManager = new RoomManager(this)
    this.gameManager = new GameManager(this)

    Promise.promisifyAll(fs)

    this.fetchHandlers().then(() => {
      this.extensionManager = new ExtensionManager(this)
    })
  }

  fetchHandlers () {
    return fs.readdirAsync(path.join(__dirname, 'Handlers')).map((file) => {
      if (file.substr(file.length - 3) === '.js') {
        let handlerFile = require(path.join(__dirname, 'Handlers', file))[file.slice(0, -3)]

        for (const handlerName of Object.keys(handlerFile)) {
          this[handlerName] = handlerFile[handlerName]
        }
      }
    })
  }

  fetchCrumbs () {
    this.itemCrumbs = require('../../data/crumbs/items')
    this.furnitureCrumbs = require('../../data/crumbs/furniture')
    this.iglooCrumbs = require('../../data/crumbs/igloos')
    this.floorCrumbs = require('../../data/crumbs/floors')

    this.database.getItems().then((items) => {
      Promise.each(items, (item) => {
        this.itemCrumbs[item.item_id] = {
          name: item.name,
          type: item.type,
          patched: item.patched,
          cost: parseInt(item.cost),
          member: false
        }
      })
    }).catch((error) => {
      logger.error(error)
    })
  }

  //

  isOnline (id) {
    return this.server.isOnline(id)
  }

  getUserCount () {
    return this.server.clients.length
  }

  getClientById (id) {
    return this.server.getClientById(id)
  }

  getClientByName (name) {
    return this.server.getClientByName(name)
  }

  removeClient (client) {
    return this.server.removeClient(client)
  }

  reloadModules () {
    return this.server.reloadModules()
  }
}
