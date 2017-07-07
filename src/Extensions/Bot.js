'use strict'

import Extension from '../Extension'
import Utils from '../Utilities'

export default class extends Extension {
  constructor (manager) {
    super(manager)

    this.id = 0
    this.username = 'Uber'

    Utils.extend(this, [this.world.handleJoinRoom, this.handleJoinRoom])
    Utils.extend(this, [this.world.handleJoinPlayer, this.handleJoinPlayer])
  }

  handleJoinRoom (data, client) {
    this.addToRoom(client)
  }

  handleJoinPlayer (data, client) {
    this.addToRoom(client)
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

  sendGlobal (msg, client) {
    for (const client of this.server.clients) {
      client.sendXt('sm', -1, this.id, msg)
    }
  }
}
