'use strict';

module.exports = {

  handleHeartbeat: function handleHeartbeat(data, client) {
    client.sendXt('h', -1);
  },

  handleSendMove: function handleSendMove(data, client) {
    var x = parseInt(data[3]);
    var y = parseInt(data[4]);

    if (!isNaN(x) && !isNaN(y)) {
      client.x = x;
      client.y = y;

      client.room.sendXt('sp', -1, client.id, x, y);
    }
  },

  handleSendFrame: function handleSendFrame(data, client) {
    var frame = parseInt(data[3]);

    if (frame === 5012) return;

    client.frame = frame;
    client.room.sendXt('sf', -1, client.id, frame);
  },

  handleSendAction: function handleSendAction(data, client) {
    var action = parseInt(data[3]);
    var blocked = [5051, 10194, 328, 194, 3002, 5035];

    if (blocked.includes(client.hand)) return;

    client.frame = 1;
    client.room.sendXt('sa', -1, client.id, action);
  },

  handleSendSnowball: function handleSendSnowball(data, client) {
    client.room.sendXt('sb', -1, client.id, data[3], data[4]);
  },

  handleSendEmote: function handleSendEmote(data, client) {
    var emote = parseInt(data[3]);

    if (emote === 19) return;

    client.room.sendXt('se', -1, client.id, data[3]);
  },

  handleSendJoke: function handleSendJoke(data, client) {
    client.room.sendXt('sj', -1, client.id, data[3]);
  },

  handleSendSafeMessage: function handleSendSafeMessage(data, client) {
    client.room.sendXt('ss', -1, client.id, data[3]);
  },

  handleSendTourGuide: function handleSendTourGuide(data, client) {
    // todo
  },

  handleGetPlayer: function handleGetPlayer(data, client) {
    var id = parseInt(data[3]);

    undefined.database.getPlayerById(id).then(function (player) {
      var info = [player.id, player.username, 1, player.color, player.head, player.face, player.neck, player.body, player.hand, player.feet, player.pin, player.photo];

      client.sendXt('gp', -1, info.join('|') + '|');
    });
  }

};