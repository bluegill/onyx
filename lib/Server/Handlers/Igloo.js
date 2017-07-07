'use strict';

module.exports = {

  handleGetIgloo: function handleGetIgloo(data, client) {
    var id = parseInt(data[3]);

    undefined.database.getPlayerById(id).then(function (player) {
      if (player.roomFurniture == null) player.roomFurniture = '';

      var iglooStr = id + '%' + player.igloo + '%' + player.music + '%' + player.floor + '%' + player.roomFurniture;

      client.sendXt('gm', -1, iglooStr);
    });
  },

  handleGetIglooList: function handleGetIglooList(data, client) {
    var iglooStr = '';

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = Object.keys(undefined.roomManager.rooms)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var id = _step.value;

        var room = undefined.roomManager.rooms[id];

        if (id > 1000 && room.open) {
          var player = undefined.getClientById(id - 1000);

          if (player) {
            iglooStr += '%' + (player.id + '|' + player.nickname);
          }
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    if (iglooStr.length > 1) {
      return client.sendXt('gr', -1, iglooStr.substr(1));
    }

    client.sendXt('gr', -1);
  },

  handleGetOwnedIgloos: function handleGetOwnedIgloos(data, client) {
    client.sendXt('go', -1, client.getIgloos());
  },

  handleOpenIgloo: function handleOpenIgloo(data, client) {
    var igloo = parseInt(data[3]);

    if (igloo === client.id) {
      undefined.roomManager.rooms[igloo + 1000].open = true;
    }
  },

  handleCloseIgloo: function handleCloseIgloo(data, client) {
    var igloo = parseInt(data[3]);

    if (igloo === client.id) {
      undefined.roomManager.rooms[igloo + 1000].open = false;
    }
  },

  handleSaveFurniture: function handleSaveFurniture(data, client) {
    var furnitureStr = '';

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = Object.keys(data)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var index = _step2.value;

        var item = data[index];

        if (index > 2 && item !== '') furnitureStr += item + ',';
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    client.updateColumn('roomFurniture', furnitureStr.slice(0, -1));
  },

  handleUpdateMusic: function handleUpdateMusic(data, client) {
    var music = parseInt(data[3]);

    if (!isNaN(music)) client.updateMusic(music);
  },

  handleUpdateFloor: function handleUpdateFloor(data, client) {
    var floor = parseInt(data[3]);

    if (!isNaN(floor) && undefined.floorCrumbs[floor]) client.updateFloor(floor);
  },

  handleAddIgloo: function handleAddIgloo(data, client) {
    var type = parseInt(data[3]);

    if (!isNaN(type) && undefined.iglooCrumbs[type]) client.addIgloo(type);
  },

  handleUpdateIgloo: function handleUpdateIgloo(data, client) {
    var igloo = parseInt(data[3]);

    if (!isNaN(igloo)) client.updateIgloo(igloo);
  },

  handleAddFurniture: function handleAddFurniture(data, client) {
    var furniture = parseInt(data[3]);

    if (undefined.furnitureCrumbs[furniture]) {
      var itemCost = undefined.furnitureCrumbs[furniture].cost;

      if (client.coins < itemCost) return client.sendError(401);

      // client.removeCoins(itemCost);
      return client.addFurniture(furniture);
    }

    client.sendError(410);
  },

  handleGetFurniture: function handleGetFurniture(data, client) {
    client.sendXt('gf', -1, client.getFurniture());
  }

};