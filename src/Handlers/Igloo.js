'use strict'

module.exports = {

  handleGetIgloo: (data, client) => {
    const id = parseInt(data[3])

    this.database.getPlayerById(id).then((player) => {
      if (player.roomFurniture == null) player.roomFurniture = ''

      // so fucking ugly
      let iglooStr = `${id}%${player.igloo}%${player.music}%${player.floor}%${player.roomFurniture}`

      client.sendXt('gm', -1, iglooStr)
    })
  },

  handleGetIglooList: (data, client) => {
    let iglooStr = ''

    for (const id of Object.keys(this.roomManager.rooms)) {
      const room = this.roomManager.rooms[id]

      if (id > 1000 && room.open) {
        const player = this.getClientById((id - 1000))

        if (player) {
          iglooStr += '%' + (player.id + '|' + player.nickname)
        }
      }
    }

    if (iglooStr.length > 1) {
      return client.sendXt('gr', -1, iglooStr.substr(1))
    }

    client.sendXt('gr', -1)
  },

  handleGetOwnedIgloos: (data, client) => {
    client.sendXt('go', -1, client.getIgloos())
  },

  handleOpenIgloo: (data, client) => {
    const igloo = parseInt(data[3])

    if (igloo === client.id) {
      this.roomManager.rooms[igloo + 1000].open = true
    }
  },

  handleCloseIgloo: (data, client) => {
    const igloo = parseInt(data[3])

    if (igloo === client.id) {
      this.roomManager.rooms[igloo + 1000].open = false
    }
  },

  handleSaveFurniture: (data, client) => {
    let furnitureStr = ''

    for (const index of Object.keys(data)) {
      const item = data[index]

      if (index > 2 && item !== '') furnitureStr += (item + ',')
    }

    client.updateColumn('roomFurniture', furnitureStr.slice(0, -1))
  },

  handleUpdateMusic: (data, client) => {
    const music = parseInt(data[3])

    if (!isNaN(music)) client.updateMusic(music)
  },

  handleUpdateFloor: (data, client) => {
    const floor = parseInt(data[3])

    if (!isNaN(floor) && this.floorCrumbs[floor]) client.updateFloor(floor)
  },

  handleAddIgloo: (data, client) => {
    const type = parseInt(data[3])

    if (!isNaN(type) && this.iglooCrumbs[type]) client.addIgloo(type)
  },

  handleUpdateIgloo: (data, client) => {
    const igloo = parseInt(data[3])

    if (!isNaN(igloo)) client.updateIgloo(igloo)
  },

  handleAddFurniture: (data, client) => {
    const furniture = parseInt(data[3])

    if (this.furnitureCrumbs[furniture]) {
      const itemCost = this.furnitureCrumbs[furniture].cost

      if (client.coins < itemCost) return client.sendError(401)

      // client.removeCoins(itemCost);
      return client.addFurniture(furniture)
    }

    client.sendError(410)
  },

  handleGetFurniture: (data, client) => {
    client.sendXt('gf', -1, client.getFurniture())
  }

}
