'use strict'

import Extension from '../Extension'
import Utils from '../Utilities'

// todo: rewrite commands extension

export default class extends Extension {
  constructor (manager) {
    super(manager)

    this.commands = {
      'id': this.handleGetId,
      'ai': this.handleAddItem,
      'ac': this.handleAddCoins,
      'gc': this.handleGiftCoins,
      'jr': this.handleJoinRoom,
      'ping': this.handlePing,
      'online': this.handleOnline,
      'global': this.handleGlobal,
      'nick': this.handleNick,
      'mute': this.handleMute,
      'kick': this.handleKick,
      'ban': this.handleBan,
      'find': this.handleFindPlayer,
      'goto': this.handleGotoPlayer,
      'summon': this.handleSummonPlayer,
      'reload': this.handleReload
    }

    Utils.extend(this, [this.world.handleSendMessage, this.handleSendMessage])
  }

  parseCommand (message) {
    message = message.substr(1)

    const data = message.split(' ')

    const command = {
      name: data.shift(),
      args: data
    }

    return command
  }

  handleSendMessage (data, client) {
    let message = data[4]

    const prefix = message[0]

    if (this.prefix.includes(prefix)) {
      const command = this.parseCommand(message)

      if (this.commands[command.name]) {
        this.commands[command.name](command.args, client)

        return true
      }

      console.log(`Command [${command.name}] does not exist!`)
    }
  }

  handleUpdatePlayer (data, client) {
    const type = data[0]
    const id = parseInt(data[1])

    const types = {
      'c': 'color',
      'h': 'head',
      'f': 'face',
      'n': 'neck',
      'b': 'body',
      'a': 'hand',
      'e': 'feet',
      'l': 'pin',
      'p': 'photo'
    }

    if (!type || !id) return

    if (!isNaN(id)) {
      if (!types[type]) return

      const item = this.world.itemCrumbs[id]

      if (!item) return

      if (!client.inventory.includes(id)) {
        if (item.patched === 1 && client.rank < 1) return client.sendError(402)
        if (item.patched === 2 && client.rank < 2) return client.sendError(402)
        if (item.patched === 3 && client.rank < 4) return client.sendError(402)

        if (client.rank > 1) item.cost = 0

        if (client.coins < item.cost) return client.sendError(401)

        client.removeCoins(item.cost)
        client.addItem(id)
      }

      client.room.sendXt('up' + type, -1, client.id, id)
      client.updateOutfit(types[type], id)
    }
  }

  handleFindPlayer (data, client) {
    if (!client.isModerator) return

    let playerObj = isNaN(data[0]) ? this.world.getClientByName(data[0]) : this.world.getClientById(data[0])

    if (playerObj) client.sendXt('bf', -1, playerObj.room.id, playerObj.nickname)
  }

  handleGotoPlayer (data, client) {
    if (!client.isModerator) return

    let playerObj = isNaN(data[0]) ? this.world.getClientByName(data[0]) : this.world.getClientById(data[0])

    if (playerObj) {
      if (playerObj.room.id === client.room.id) return

      this.world.handleJoinRoom({3: playerObj.room.id}, client)
    }
  }

  handleSummonPlayer (data, client) {
    if (!client.isModerator) return

    let playerObj = isNaN(data[0]) ? this.world.getClientByName(data[0]) : this.world.getClientById(data[0])

    if (playerObj) {
      if (playerObj.room.id === client.room.id) return

      this.world.handleJoinRoom({3: client.room.id}, playerObj)
    }
  }

  handleUpdateColor (data, client) {
    let color = data[0]

    if (color.substr(0, 2) !== '0x') color = ('0x' + color)

    if (/^0x[0-9A-F]{6}$/i.test(color) !== false || (!isNaN(color) && color < 50)) {
      client.updateOutfit('color', color)
      client.room.sendXt('upc', -1, client.id, color)
    }
  }

  handleReload (data, client) {
    if (!client.isModerator) return
    if (client.rank < 4) return

    this.world.reloadModules().then(() => {
      const bot = this.parent.getPlugin('bot')

      if (bot) bot.sendMessage('Handler modules have been reloaded and are now up-to-date!', client)
    })
  }

  handleOnline (data, client) {
    const bot = this.parent.getPlugin('bot')

    if (bot) bot.sendMessage(`There are ${this.world.getUserCount()} users online!`, client)
  }

  handleGetId (data, client) {
    const bot = this.parent.getPlugin('bot')

    if (!bot) return

    const name = data.join(' ')

    if (name.length > 2 && client.isModerator) {
      const player = this.world.getClientByName(name)

      if (player) bot.sendMessage(`${player.nickname}'s ID is ${player.id}!`, client)
    } else {
      bot.sendMessage(`Your ID is ${client.id}!`, client)
    }
  }

  handlePing (data, client) {
    const bot = this.parent.getPlugin('bot')

    if (bot) bot.sendMessage('Pong!', client)
  }

  handleKick (data, client) {
    if (!client.isModerator) return

    let playerObj = isNaN(data[0]) ? this.world.getClientByName(data[0]) : this.world.getClientById(data[0])

    if (playerObj) playerObj.sendError(5, true)
  }

  handleMute (data, client) {
    if (!client.isModerator) return

    let playerObj = isNaN(data[0]) ? this.world.getClientByName(data[0]) : this.world.getClientById(data[0])

    if (playerObj) {
      playerObj.isMuted = !playerObj.isMuted
    }
  }

  handleBan (data, client) {
    if (!client.isModerator) return

    let playerObj = isNaN(data[0]) ? this.world.getClientByName(data[0]) : this.world.getClientById(data[0])

    let duration = parseInt(data[1])

    if (!duration) duration = 24

    if (duration < 0) duration = 0
    if (duration > 999) duration = 999

    if (playerObj) {
      this.world.database.addBan(client.id, playerObj.id, duration, `Banned by ${client.nickname}`)

      playerObj.sendXt('b', -1)
      playerObj.disconnect()
    }
  }

  handleNick (data, client) {
    if (client.isModerator && client.rank >= 4) {
      client.nickname = data.join(' ')

      this.world.handleJoinRoom({3: client.room.id}, client)
    }
  }

  handleGlobal (data, client) {
    if (client.isModerator && client.rank >= 3) {
      const bot = this.parent.getPlugin('bot')
      const msg = data.join(' ')

      if (bot && msg.length > 3) bot.sendGlobal(msg)
    }
  }

  handleJoinRoom (data, client) {
    const room = parseInt(data[0])

    this.world.handleJoinRoom({3: room}, client)
  }

  handleAddItem (data, client) {
    const item = parseInt(data[0])

    if (!isNaN(item)) {
      if (this.world.itemCrumbs[item]) {
        return client.addItem(item)
      }
    }

    client.sendError(402)
  }

  handleAddCoins (data, client) {
    if (!client.isModerator) return

    let coins = parseInt(data[0])

    if (!isNaN(coins)) {
      if (coins > 50000) coins = 50000

      client.addCoins(coins)
      client.sendXt('zo', -1, client.coins)
    }
  }

  handleGiftCoins (data, client) {
    if (!client.isModerator || client.rank < 3) return

    let playerObj = isNaN(data[0]) ? this.world.getClientByName(data[0]) : this.world.getClientById(data[0])
    let coins = parseInt(data[1])

    if (playerObj && !isNaN(coins)) {
      if (coins > 50000) coins = 50000

      playerObj.addCoins(coins)
      playerObj.sendXt('zo', -1, playerObj.coins)
    }
  }
}
