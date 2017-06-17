'use strict'

module.exports = {

  handleAddToy: (data, client) => {
    client.room.sendXt('at', -1, client.id)
  },

  handleRemoveToy: (data, client) => {
    client.room.sendXt('rt', -1, client.id)
  }

}
