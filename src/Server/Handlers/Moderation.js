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
  }

}
