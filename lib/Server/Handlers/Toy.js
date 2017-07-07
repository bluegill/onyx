'use strict';

module.exports = {

  handleAddToy: function handleAddToy(data, client) {
    client.room.sendXt('at', -1, client.id);
  },

  handleRemoveToy: function handleRemoveToy(data, client) {
    client.room.sendXt('rt', -1, client.id);
  }

};