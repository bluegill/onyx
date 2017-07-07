'use strict'

import chokidar from 'chokidar'

import utils from '../Utilities'
import crypto from '../Utilities/Crypto'
import logger from '../Utilities/Logger'

import World from '../Server/World'

import Packet from './Packet'
import Requests from './Requests'

export default class {
  constructor (server) {
    this.server = server
    this.database = server.database

    this.xmlHandlers = {
      'verChk': 'handleVersionCheck',
      'rndK': 'handleRandomKey',
      'login': 'handleLogin'
    }

    this.handlers = {}

    // packet: timeout in seconds
    this.throttle = {
      'sf': 2,
      'sa': 3,
      'sb': 2,
      'se': 2,
      'ss': 3,
      'sj': 3,
      'sg': 5,
      'zo': 30
    }

    if (server.type === 'world') {
      this.world = new World(server)
      this.server.world = this.world

      this.watch()
    }
  }

  // not working on linux? chokidar dependency issue
  watch (directory) {
    logger.debug(`Hotloading enabled, watching for code changes...`)

    let modules = {}

    chokidar.watch('./lib', {alwaysStat: true}).on('all', (event, path, stats) => {
      if (event === 'add') modules[path] = {size: stats.size}
      if (event === 'change') {
        if (modules[path].size !== stats.size) {
          logger.info(`Reloaded code for ${path}...`)
          modules[path].size = stats.size

          delete require.cache[path]
        }
      }
    })
  }

  handleVersionCheck (data, client) {
    client.send('<msg t="sys"><body action="apiOK" r="0"></body></msg>')
  }

  handleRandomKey (data, client) {
    client.randomKey = crypto.generateKey()
    client.send(`<msg t="sys"><body action="rndK" r="-1"><k>${client.randomKey}</k></body></msg>`)
  }

  handleLogin (data, client) {
    let nick = data.split('<nick><![CDATA[')[1].split(']]></nick>')[0]
    let pass = data.split('<pword><![CDATA[')[1].split(']]></pword>')[0]

    this.database.getPlayerByName(nick).then((player) => {
      if (this.server.type === 'login') {
        const hash = crypto.encryptPassword(player.password.toUpperCase(), client.randomKey)

        if (hash === pass) {
          const loginKey = crypto.md5(crypto.generateKey())
          const serverList = this.server.getList()

          this.database.updateColumn(player.id, 'loginKey', loginKey)

          client.sendXt('sd', -1, serverList)
          client.sendXt('l', -1, player.id, loginKey, '', '100,5')
        } else {
          client.sendError(101, true)
        }
      } else {
        const hash = pass.substr(pass.length - 32)

        if (hash.length === 32) {
          const playerObj = this.server.getClientById(player.id)

          // remove client if already signed in
          if (playerObj) playerObj.disconnect()

          if (hash === player.loginKey) {
            client.sendXt('l', -1)
            client.setClient(player)
          } else {
            client.sendError(101, true)
          }

          this.database.updateColumn(player.id, 'loginKey', '')
        }
      }
    }).catch((error) => {
      logger.error(error)

      client.sendError(100, true)
    })
  }

  handleData (data, client) {
    logger.debug('incoming: ' + data)

    const isGame = (data.charAt(0) !== '<')

    if (!isGame) {
      if (data === '<policy-file-request/>') {
        client.send('<cross-domain-policy><allow-access-= require(domain="*" to-ports="*" /></cross-domain-policy>')
      } else {
        let action = data.split('action=\'')[1]
                         .split('\' r=')[0]

        const method = this.xmlHandlers[action]

        if (typeof this[method] === 'function') this[method](data, client)
      }
    } else {
      let packet = new Packet(data)
      let allowed = ['ur', 'af', 'gf', 'gr', 'gm', 'sm']

      const world = this.world

      if ((packet.data.join('').includes('|') && !allowed.includes(packet.action)) || (!client.id || !client.username)) {
        client.sendError(800, true)
      }

      if (this.throttle[packet.action]) {
        const timeout = this.throttle[packet.action]

        if (!client.throttled) client.throttled = {}

        if (client.throttled[packet.action] && (utils.getTime() < client.throttled[packet.action])) return

        client.throttled[packet.action] = (utils.getTime() + timeout)
      }

      if (this.world.gameManager.handlers[packet.zone]) {
        const gameHandler = this.world.gameManager.handlers[packet.zone][packet.action]

        if (this.world.gameManager[gameHandler]) {
          return this.world.gameManager[gameHandler](data, client)
        }
      }

      let handler

      if (Requests.includes(packet.action)) {
        handler = utils.getKeyFromValue(Requests, packet.action)
      }

      if (handler && packet.data !== undefined) {
        // data.splice(0, 3); // utilize es6 array destructuring

        if (this.world[handler]) this.world[handler](packet.data, client)
      } else {
        logger.warn(`Missing handler for ${packet.action}`)
      }
    }
  }
}
