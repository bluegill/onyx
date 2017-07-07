'use strict'

export default class {
  constructor (manager) {
    this.parent = manager
    this.world = manager.world
    this.server = manager.server
  }
}
