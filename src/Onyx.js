'use strict'

const net = require('net')
const fs = require('fs')
const path = require('path')

const Promise = require('bluebird')

Promise.promisifyAll(fs)

const utils = require('./Utils')
const logger = require('./Logger')

const Client = require('./Client')
const Database = require('./Database')
const EventListener = require('./EventListener')

module.exports = class {
  constructor (config) {
    logger.info('Starting server...')

    if (!config.SERVER_ID) {
      logger.error('Missing server ID parameter', config)
      process.exit()
    }

    this.config = config

    this.id = config.SERVER_ID
    this.type = config.SERVER_TYPE

    this.port = config.LOGIN_SERVER.SERVER_PORT

    if (this.type === 'world') {
      this.port = config.WORLD_SERVER.SERVER_PORT
    }

    this.maxClients = (config.SERVER_CONNECTIONS_MAX ? config.SERVER_CONNECTIONS_MAX : 100)
    this.clients = []

    this.database = new Database()
    this.eventListener = new EventListener(this)

    if (this.type === 'world') {
      this.roomManager = this.world.roomManager
      this.gameManager = this.world.gameManager
    }

    this.createServer()

    /// ////////

    if (process.env.NODE_ENV === 'production') {
      process.on('SIGINT', () => this.handleShutdown())
      process.on('SIGTERM', () => this.handleShutdown())
    }
  }

  createServer () {
    net.createServer((socket) => {
      logger.info('A client has connected')

      socket.setEncoding('utf8')

      let clientObj = new Client(socket, this)

      if (this.clients.length >= this.maxClients) clientObj.sendError(103, true) // server full

      this.clients.push(clientObj)

      socket.on('data', (data) => {
        data = data.toString().split('\0')[0]

        this.eventListener.handleData(data, clientObj)
      })

      socket.on('close', () => {
        clientObj.disconnect()

        logger.info('A client has disconnected')
      })

      socket.on('error', (error) => {
        clientObj.disconnect()

        if (error.code === 'ETIMEDOUT' || error.code === 'ECONNRESET') return

        logger.error(error)
      })
    }).listen(this.port, () => {
      const type = utils.firstToUpper(this.type)

      logger.info(`${type} server listening on port ${this.port}`)
    })
  }

  removeClient (client) {
    let index = this.clients.indexOf(client)

    if (index > -1) {
      logger.debug('Removing disconnecting client...')

      if (client.room) client.room.removeClient(client)

      if (client.tableId) this.gameManager.leaveTable(client)

      if (client.buddies) {
        for (const buddy of client.buddies) {
          if (this.isOnline(buddy)) this.getClientById(buddy).sendXt('bof', -1, client.id)
        }
      }

      if (this.roomManager) {
        const igloo = (client.id + 1000)

        if (this.roomManager.checkIgloo(igloo)) this.roomManager.closeIgloo(igloo)
      }

      this.clients.splice(index, 1)

      client.socket.end()
      client.socket.destroy()
    }
  }

  handleShutdown () {
    logger.warn('Server shutting down in 30 seconds...')

    for (const client of this.clients) {
      client.sendError(990)
    }

    setTimeout(() => {
      for (const client of this.clients) {
        client.disconnect()
      }

      process.exit()
    }, 30000)
  }

  reloadModules () {
    return fs.readdirAsync(path.join(__dirname, 'Handlers')).map((file) => {
      if (file.substr(file.length - 3) === '.js') delete require.cache[file]
    }).then(() => {
      this.world.fetchHandlers()
      this.gameManager.fetchHandlers()
    })
  }

  isOnline (id) {
    for (const client of this.clients) {
      if (client.id === id) return true
    }

    return false
  }

  getClientById (id) {
    for (const client of this.clients) {
      if (client.id === id) return client
    }
  }

  getClientByName (name) {
    for (const client of this.clients) {
      if (client.nickname.toLowerCase() === name.toLowerCase()) return client
    }
  }

  getList () {
    let serverList = []

    const world = this.config.WORLD_SERVER

    const server = [
      world.SERVER_ID,
      world.SERVER_NAME,
      world.SERVER_HOST,
      world.SERVER_PORT
    ]

    serverList.push(server)

    return serverList.join('%')
  }
}
