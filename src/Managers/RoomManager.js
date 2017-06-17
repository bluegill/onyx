'use strict'

const Room = require('../Room')

const logger = require('../Logger')
const crumbs = require('../../data/crumbs/rooms')

module.exports = class {
  constructor (world) {
    this.rooms = []
    this.world = world
    this.server = world.server

    for (let id of Object.keys(crumbs)) {
      if (id < 900) {
        this.rooms[id] = new Room(id, this)
      }
    }

    logger.info(`Room manager initialized, loaded ${this.rooms.length} rooms`)
  }

  createRoom (id) {
    if (!this.rooms[id]) {
      this.rooms[id] = new Room(id, this)
    }
  }

  getRoom (id) {
    if (this.rooms[id]) return this.rooms[id]
  }

  checkIgloo (id) {
    if (this.rooms[id]) {
      if (this.rooms[id].open === true) return true
    }
  }

  closeIgloo (id) {
    if (this.rooms[id]) {
      return (this.rooms[id].open = false)
    }
  }
}
