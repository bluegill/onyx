'use strict'

module.exports = class {
  constructor (manager) {
    this.parent = manager
    this.world = manager.world
    this.server = manager.server
  }
}
