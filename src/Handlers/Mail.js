'use strict'

module.exports = {

  // TODO

  handleStartMail: (data, client) => {
    client.sendXt('mst', -1, 0, 0)
  },

  handleGetMail: (data, client) => {
    client.sendXt('mg', -1, '')
  }

}
