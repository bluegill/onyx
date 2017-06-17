'use strict'

module.exports = {

  handleBan: (data, client) => {
    if (!client.isModerator) return

    const id = parseInt(data[3])
    const reason = data[4]
    const duration = 24

    if (isNaN(id)) return

    this.database.addBan(client.id, id, duration, reason)

    const player = this.getClientById(id)

    if (player) {
      player.sendXt('b', -1)
      player.disconnect()
    }
  },

  handleKick: (data, client) => {
    if (!client.isModerator) return

    const id = parseInt(data[3])
    const player = this.getClientById(id)

    if (player) {
      if (player.rank >= client.rank) return

      player.sendError(5, true)
    }
  },

  handleMute: (data, client) => {
    if (!client.isModerator) return

    const id = data[3]
    let player = this.getClientById(id)

    if (player) player.isMuted = !player.isMuted
  },

  // CUSTOM HANDLERS

  handleSearch: (data, client) => {
    if (!client.isModerator) return

    const player = this.getClientByName(data[3])

    if (player) {
      const playerObject = {
        'player_id': player.id,
        'nickname': player.username,
        'rank': player.rank,
        'location': player.room.id
      }

      return client.sendXt('sr', -1, JSON.stringify(playerObject))
    }

    client.sendXt('sr', -1)
  },

  handleWarn: (data, client) => {
    if (!client.isModerator) return

    const id = parseInt(data[3])
    const player = this.getClientById(id)

    if (player) player.sendXt('wa', -1, data[4])
  },

  handleMove: (data, client) => {
    if (!client.isModerator) return
    if (client.rank < 3) return

    const id = parseInt(data[3])

    const x = parseInt(data[4])
    const y = parseInt(data[5])

    let player = this.getClientById(id)

    if (player) {
      player.x = x
      player.y = y

      client.room.sendXt('mp', -1, id, x, y)
    }
  },

  handleBlockName: (data, client) => {
    if (!client.isModerator) return

    const id = parseInt(data[3])
    const player = this.getClientById(id)

    if (player) {
      const nickname = `p${player.id}`

      player.nickname = nickname
      player.updateColumn('nickname', nickname)
      player.sendXt('bn', -1, player.id)
    }
  }

}
