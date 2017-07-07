'use strict'

// bootstrap server
// npm start [server id]
// or node Bootstrap.js [server id]

import Logger from './Utilities/Logger'

import Onyx from './Server'
import * as Config from './Config'

if (Config.SERVER_ID) {
  const Instance = new Onyx(Config)

  if (!Instance) {
    Logger.error('Unable to create server instance.')
  }
} else {
  Logger.error('Server configuration not found')
}
