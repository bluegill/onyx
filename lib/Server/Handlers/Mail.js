'use strict';

module.exports = {

  // TODO

  handleStartMail: function handleStartMail(data, client) {
    client.sendXt('mst', -1, 0, 0);
  },

  handleGetMail: function handleGetMail(data, client) {
    client.sendXt('mg', -1, '');
  }

};