'use strict'

import Extension from '../Extension'
import Utils from '../Utilities'

export default class extends Extension {
  constructor (manager) {
    super(manager)

    this.filter = [
      'fuck', 'shit', 'cock', 'bitch', 'nigger', 'slut', 'cunt', 'whore'
    ]

    Utils.extend(this, [this.world.handleSendMessage, this.handleSendMessage])
  }

  handleSendMessage (data, client) {
    let message = data[4].trim()

    message = message.toLowerCase()

    for (let str of this.filter) {
      if (message.includes(str)) return
    }
  }
}
