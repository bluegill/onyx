'use strict';

module.exports = {

  handleBan: function handleBan(data, client) {
    if (!client.isModerator) return;

    var id = parseInt(data[3]);
    var reason = data[4];
    var duration = 24;

    if (isNaN(id)) return;

    undefined.database.addBan(client.id, id, duration, reason);

    var player = undefined.getClientById(id);

    if (player) {
      player.sendXt('b', -1);
      player.disconnect();
    }
  },

  handleKick: function handleKick(data, client) {
    if (!client.isModerator) return;

    var id = parseInt(data[3]);
    var player = undefined.getClientById(id);

    if (player) {
      if (player.rank >= client.rank) return;

      player.sendError(5, true);
    }
  },

  handleMute: function handleMute(data, client) {
    if (!client.isModerator) return;

    var id = data[3];
    var player = undefined.getClientById(id);

    if (player) player.isMuted = !player.isMuted;
  }

};