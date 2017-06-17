'use strict'

module.exports = {

  handleGetBuddies: (data, client) => {
    client.getBuddies((buddies) => {
      client.sendXt('gb', -1, buddies)
    })
  },

  handleBuddyAccept: (data, client) => {
    const target = parseInt(data[3])

    if (client.buddies.length >= 500) return client.sendError(901)

    if (client.buddies.includes(target)) return

    if (!client.requests.includes(target)) return

    this.database.getPlayerById(target).then((player) => {
      let buddies = player.buddies

      buddies = JSON.parse(buddies)

      if (!buddies) buddies = []

      if (!buddies.includes(client.id)) {
        client.addBuddy(target)

        buddies.push(client.id)

        this.database.updateColumn(target, 'buddies', JSON.stringify(buddies))

        const targetObj = this.getClientById(target)

        if (targetObj) {
          targetObj.sendXt('ba', -1, client.id, client.nickname)
        }

        client.sendXt('ba', -1, target, player.nickname)
      }
    })

    const index = client.requests.indexOf(target)

    client.requests.splice(index, 1)
  },

  handleBuddyRemove: (data, client) => {
    const target = parseInt(data[3])

    client.removeBuddy(target)

    this.database.getPlayerById(target).then((player) => {
      let buddies = player.buddies

      buddies = JSON.parse(buddies)

      if (!buddies) buddies = []

      if (buddies.includes(client.id)) {
        const index = buddies.indexOf(client.id)

        buddies.splice(index, 1)

        this.database.updateColumn(target, 'buddies', JSON.stringify(buddies))

        const targetObj = this.getClientById(target)

        if (targetObj) {
          targetObj.sendXt('rb', -1, client.id, client.nickname)
          targetObj.buddies = buddies
        }

        client.sendXt('rb', -1, target, player.nickname)
      }
    })
  },

  handleBuddyFind: (data, client) => {
    const target = parseInt(data[3])
    const targetObj = this.getClientById(target)

    if (targetObj) client.sendXt('bf', -1, targetObj.room.id)
  },

  handleBuddyRequest: (data, client) => {
    const target = parseInt(data[3])

    if (target === client.id) return

    if (client.buddies.length >= 500) return client.sendError(901)

    const targetObj = this.getClientById(target)

    if (targetObj) {
      if (targetObj.buddies.length >= 500) return
      if (targetObj.requests.includes(client.id)) return

      targetObj.requests.push(client.id)
      targetObj.sendXt('br', -1, client.id, client.nickname)
    }
  }

}
