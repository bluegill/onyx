'use strict'

module.exports = {

  // TODO

  handleGetPuffle: (data, client) => {
    client.sendXt('pg', -1, data[3])
  },

  handleGetPuffleUser: (data, client) => {

  }

}
