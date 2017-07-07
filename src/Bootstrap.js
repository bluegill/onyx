'use strict'

// bootstrap server
// npm start [server id]
// or node Bootstrap.js [server id]

import * as Config from './Config'

import Logger from './Utilities/Logger'
import Onyx from './Server'

if (Config.SERVER_ID) {
  const Instance = new Onyx(Config)

  if (!Instance) {
    Logger.error('Unable to create server instance.')
  }
} else {
  Logger.error('Server configuration not found')
}
