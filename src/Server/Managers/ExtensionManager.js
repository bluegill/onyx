'use strict'

import logger from '../../Utilities/Logger'
import * as config from '../../Config'

export default class {
  constructor (world) {
    this.world = world
    this.server = world.server

    this.extensions = []

    for (const extension of config.SERVER_EXTENSIONS) {
      if (extension.enabled) {
        try {
          const name = extension.name.toLowerCase()

          this.extensions[name] = new (require(`../../${extension.path}`))(this)
        } catch (error) {
          logger.error(`Unable to load extension: '${extension.path}'!`, error)
        }
      }
    }

    const count = Object.keys(this.extensions).length

    logger.info(`Extension manager initialized, loaded ${count} extensions.`)
  }

  getExtension (extension) {
    return this.extensions[extension.toLowerCase()]
  }
}
