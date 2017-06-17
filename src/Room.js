'use strict'

module.exports = class {
  constructor (id, manager) {
    this.clients = []
    this.id = id
    this.parent = manager
    this.server = manager.server
  }

  addClient (client, coords) {
    let x = coords[0]
    let y = coords[1]

    if (!x) x = 0
    if (!y) y = 0

    client.room = this
    client.frame = 1

    client.x = x
    client.y = y

    this.clients.push(client)

    this.sendXt('ap', -1, client.buildString())

    if (this.id > 1000) {
      client.sendXt('jp', -1, this.id)
    }

    if (this.clients.length > 0) {
      client.sendXt('jr', -1, this.id, this.buildString())
    } else {
      client.sendXt('jr', -1, this.id)
    }
  }

  removeClient (client) {
    const index = this.clients.indexOf(client)

    if (index > -1) {
      this.clients.splice(index, 1)
      this.sendXt('rp', -1, client.id)
    }
  }

  sendXt () {
    const args = Array.prototype.join.call(arguments, '%')

    this.sendData(`%xt%${args}%`)
  }

  sendData (data) {
    for (const client of this.clients) {
      client.send(data)
    }
  }

  buildString () {
    let roomStr = ''

    for (const client of this.clients) {
      roomStr += '%' + client.buildString()
    }

    return roomStr.substr(1)
  }
}
