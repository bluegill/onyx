'use strict';

var utils = require('../../Utilities');

module.exports = {

  handleJoinServer: function handleJoinServer(data, client) {
    client.sendXt('js', -1, 0, 1, client.isModerator ? 1 : 0);
    client.sendXt('gps', -1, '');
    client.sendXt('lp', -1, client.buildString(), client.coins, 0, 1440, utils.getTime(), client.age, 1000, 233, '', 7);

    undefined.handleGetBuddies(data, client);
    undefined.handleGetIgnored(data, client);

    undefined.handleJoinRoom({ 2: 'j#jr', 3: client.defaultRoom }, client);
  },

  handleJoinRoom: function handleJoinRoom(data, client) {
    var room = parseInt(data[3]);

    var x = parseInt(data[4]);
    var y = parseInt(data[5]);

    if (!x || isNaN(x)) x = 0;
    if (!y || isNaN(y)) y = 0;

    if (client.room) {
      client.room.removeClient(client);
    }

    if (room > 900) {
      return client.sendXt('jg', -1, room);
    }

    var roomObject = undefined.roomManager.getRoom(room);

    if (roomObject) {
      roomObject.addClient(client, [x, y]);
    } else {
      client.sendError(210);
    }
  },

  handleJoinPlayer: function handleJoinPlayer(data, client) {
    var room = parseInt(data[3]);

    var x = parseInt(data[4]);
    var y = parseInt(data[5]);

    if (!x || isNaN(x)) x = 0;
    if (!y || isNaN(y)) y = 0;

    if (client.room) {
      client.room.removeClient(client);
    }

    if (room < 1000) room += 1000;

    if (!undefined.roomManager.getRoom(room)) {
      undefined.roomManager.createRoom(room);
    }

    var roomObject = undefined.roomManager.getRoom(room);

    if (roomObject) {
      roomObject.addClient(client, [x, y]);
    } else {
      client.sendError(210);
    }
  }

};