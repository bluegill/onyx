'use strict';

module.exports = {

  handleGetBuddies: function handleGetBuddies(data, client) {
    client.getBuddies(function (buddies) {
      client.sendXt('gb', -1, buddies);
    });
  },

  handleBuddyAccept: function handleBuddyAccept(data, client) {
    var target = parseInt(data[3]);

    if (client.buddies.length >= 500) return client.sendError(901);

    if (client.buddies.includes(target)) return;

    if (!client.requests.includes(target)) return;

    undefined.database.getPlayerById(target).then(function (player) {
      var buddies = player.buddies;

      buddies = JSON.parse(buddies);

      if (!buddies) buddies = [];

      if (!buddies.includes(client.id)) {
        client.addBuddy(target);

        buddies.push(client.id);

        undefined.database.updateColumn(target, 'buddies', JSON.stringify(buddies));

        var targetObj = undefined.getClientById(target);

        if (targetObj) {
          targetObj.sendXt('ba', -1, client.id, client.nickname);
        }

        client.sendXt('ba', -1, target, player.nickname);
      }
    });

    var index = client.requests.indexOf(target);

    client.requests.splice(index, 1);
  },

  handleBuddyRemove: function handleBuddyRemove(data, client) {
    var target = parseInt(data[3]);

    client.removeBuddy(target);

    undefined.database.getPlayerById(target).then(function (player) {
      var buddies = player.buddies;

      buddies = JSON.parse(buddies);

      if (!buddies) buddies = [];

      if (buddies.includes(client.id)) {
        var index = buddies.indexOf(client.id);

        buddies.splice(index, 1);

        undefined.database.updateColumn(target, 'buddies', JSON.stringify(buddies));

        var targetObj = undefined.getClientById(target);

        if (targetObj) {
          targetObj.sendXt('rb', -1, client.id, client.nickname);
          targetObj.buddies = buddies;
        }

        client.sendXt('rb', -1, target, player.nickname);
      }
    });
  },

  handleBuddyFind: function handleBuddyFind(data, client) {
    var target = parseInt(data[3]);
    var targetObj = undefined.getClientById(target);

    if (targetObj) client.sendXt('bf', -1, targetObj.room.id);
  },

  handleBuddyRequest: function handleBuddyRequest(data, client) {
    var target = parseInt(data[3]);

    if (target === client.id) return;

    if (client.buddies.length >= 500) return client.sendError(901);

    var targetObj = undefined.getClientById(target);

    if (targetObj) {
      if (targetObj.buddies.length >= 500) return;
      if (targetObj.requests.includes(client.id)) return;

      targetObj.requests.push(client.id);
      targetObj.sendXt('br', -1, client.id, client.nickname);
    }
  }

};