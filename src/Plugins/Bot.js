'use strict'

const base = require('./PluginBase')

module.exports = class extends base {
  constructor (manager) {
    super(manager)

    this.id = 0
    this.username = 'Uber'

    const handleJoinRoom = this.world.handleJoinRoom
    const handleJoinPlayer = this.world.handleJoinPlayer

    this.world.handleJoinRoom = (data, client) => {
      handleJoinRoom.apply(this.world, [data, client])

      this.addToRoom(client)
    }

    this.world.handleJoinPlayer = (data, client) => {
      handleJoinPlayer.apply(this.world, [data, client])

      this.addToRoom(client)
    }
  }

  addToRoom (client) {
    let bot = [
      this.id,
      this.username,
      1,
      1, // color
      90001, // head
      103, // face
      0, // neck
      240, // body
      0, // hand
      0, // feet
      0, // flag
      0, // photo
      0, // x
      0, // y
      1, // frame
      1,
      1
    ]

    client.sendXt('ap', -1, bot.join('|'))
  }

  sendMessage (msg, client) {
    if (client) {
      client.sendXt('sm', -1, this.id, msg)
    }
  }

  sendGlobalMessage (msg, client) {
    for (const client of this.server.clients) {
      client.sendXt('sm', -1, this.id, msg)
    }
  }
}
