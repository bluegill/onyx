'use strict'

module.exports = {

  handleHeartbeat: (data, client) => {
    client.sendXt('h', -1)
  },

  handleSendMove: (data, client) => {
    const x = parseInt(data[3])
    const y = parseInt(data[4])

    if (!isNaN(x) && !isNaN(y)) {
      client.x = x
      client.y = y

      client.room.sendXt('sp', -1, client.id, x, y)
    }
  },

  handleSendFrame: (data, client) => {
    const frame = parseInt(data[3])

    if (frame === 5012) return

    client.frame = frame
    client.room.sendXt('sf', -1, client.id, frame)
  },

  handleSendAction: (data, client) => {
    const action = parseInt(data[3])
    const blocked = [5051, 10194, 328, 194, 3002, 5035]

    if (blocked.includes(client.hand)) return

    client.frame = 1
    client.room.sendXt('sa', -1, client.id, action)
  },

  handleSendSnowball: (data, client) => {
    client.room.sendXt('sb', -1, client.id, data[3], data[4])
  },

  handleSendEmote: (data, client) => {
    const emote = parseInt(data[3])

    if (emote === 19) return // block annoying toot noise

    client.room.sendXt('se', -1, client.id, data[3])
  },

  handleSendJoke: (data, client) => {
    client.room.sendXt('sj', -1, client.id, data[3])
  },

  handleSendSafeMessage: (data, client) => {
    client.room.sendXt('ss', -1, client.id, data[3])
  },

  handleSendTourGuide: (data, client) => {
    // todo
  },

  handleGetPlayer: (data, client) => {
    const id = parseInt(data[3])

    this.database.getPlayerById(id).then((player) => {
      const info = [
        player.id, player.username,
        1, player.color,
        player.head, player.face,
        player.neck, player.body,
        player.hand, player.feet,
        player.pin, player.photo
      ]

      client.sendXt('gp', -1, info.join('|') + '|')
    })
  },

  // CUSTOM HANDLERS

  handleGetPlayerId: (data, client) => {
    const id = parseInt(data[3])
    const nickname = data[4]

    if (id !== client.id || nickname === undefined) return

    const player = this.getClientByName(nickname)

    if (player) return client.sendXt('id', -1, player.id, player.nickname)

    client.sendXt('id', -1)
  },

  handleGetSettings: (data, client) => {
    if (client.settings) {
      const json = JSON.stringify(client.settings)
      client.sendXt('ge', -1, json)
    }
  },

  handleUpdateSettings: (data, client) => {
    try {
      const json = JSON.parse(data[3])

      if (!isNaN(json.dock) && !isNaN(json.log)) {
        client.updateSettings(json)
      }
    } catch (error) {
      console.error(error)
    }
  }
}
