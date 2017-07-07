'use strict';

module.exports = {

  // TODO

  handleGetPuffle: function handleGetPuffle(data, client) {
    client.sendXt('pg', -1, data[3]);
  },

  handleGetPuffleUser: function handleGetPuffleUser(data, client) {}

};