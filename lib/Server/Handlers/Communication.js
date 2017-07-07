'use strict';

module.exports = {

  handleSendMessage: function handleSendMessage(data, client) {
    var message = data[4];

    if (!client.isMuted && message.length > 0) {
      client.room.sendXt('sm', -1, client.id, message);
    }
  }

};