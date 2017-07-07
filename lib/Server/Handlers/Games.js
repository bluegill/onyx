'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

module.exports = {

  handleGetTable: function handleGetTable(data, client) {
    data.splice(0, 3);

    var tablePopulation = '';

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var tableId = _step.value;

        if (undefined.tablePopulation[tableId]) {
          var tableObj = undefined.tablePopulation[tableId];
          var seatId = Object.keys(tableObj).length;

          tablePopulation += tableId + '|' + seatId + '%';
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

    client.sendXt('gt', -1, tablePopulation.slice(0, -1));
  },

  handleJoinTable: function handleJoinTable(data, client) {
    var tableId = parseInt(data[3]);
    var tableObj = undefined.tablePopulation[tableId];

    var seatId = Object.keys(tableObj).length;

    if (!undefined.tableGames[tableId]) {
      undefined.tableGames[tableId] = new (require('../Games/FindFour'))(undefined);
    }

    seatId += 1;

    undefined.tablePopulation[tableId][client.nickname] = client;
    undefined.tablePlayers[tableId].push(client);

    client.sendXt('jt', -1, tableId, seatId);

    client.room.sendXt('ut', -1, tableId, seatId);

    client.tableId = tableId;
  },

  handleLeaveTable: function handleLeaveTable(data, client) {
    undefined.leaveTable(client);
  },

  handleGetGame: function handleGetGame(data, client) {
    if (client.room.id === 802) {
      client.room.sendXt('gz', -1, undefined.puck.join('%'));
    } else if (client.tableId) {
      var tableId = client.tableId;
      var players = Object.keys(undefined.tablePopulation[tableId]);
      var board = undefined.tableGames[tableId].toString();

      var _players = _slicedToArray(players, 2),
          playerOne = _players[0],
          playerTwo = _players[1];

      client.sendXt('gz', -1, playerOne, playerTwo, board);
    }
  },

  handleJoinGame: function handleJoinGame(data, client) {
    if (client.tableId) {
      var tableId = client.tableId;
      var tableObj = undefined.tablePopulation[tableId];
      var seatId = Object.keys(tableObj).length - 1;

      client.sendXt('jz', -1, seatId);

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = undefined.tablePlayers[tableId][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var player = _step2.value;

          player.sendXt('uz', -1, seatId, client.nickname);

          if (seatId === 1) player.sendXt('sz', -1, 0);
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
    }
  },

  handleSendMove: function handleSendMove(data, client) {
    if (client.tableId) {
      var tableId = client.tableId;
      var isPlaying = undefined.tablePlayers[tableId].indexOf(client) < 2;
      var isReady = undefined.tablePlayers[tableId].length >= 2;

      if (isPlaying && isReady) {
        var chipColumn = parseInt(data[3]);
        var chipRow = parseInt(data[4]);

        var seatId = undefined.tablePlayers[tableId].indexOf(client);

        if (undefined.tableGames[tableId].currentPlayer === seatId + 1) {
          var result = undefined.tableGames[tableId].placeChip(chipColumn, chipRow);

          var opponentSeat = seatId === 0 ? 1 : 0;
          var opponent = undefined.tablePlayers[tableId][opponentSeat];

          if (result === 1) {
            client.addCoins(20);
            opponent.addCoins(10);
          }

          if (result === 2) {
            client.addCoins(5);
            opponent.addCoins(5);
          }

          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = undefined.tablePlayers[tableId][Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var player = _step3.value;

              player.sendXt('zm', -1, seatId, chipColumn, chipRow);

              if (result === 1 || result === 2) {
                player.sendXt('zo', -1, player.coins);
              }
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        }
      }
    }
  },

  handleMovePuck: function handleMovePuck(data, client) {
    var player = data[3];

    undefined.puck = [data[4], data[5], data[6], data[7]];

    client.room.sendXt('zm', -1, player, undefined.puck.join('%'));
  },

  handleGameOver: function handleGameOver(data, client) {
    var coins = parseInt(data[3]);

    if (!isNaN(coins)) {
      coins = Math.round(coins / 4);

      if (coins > 300) coins = 300;

      client.addCoins(coins);
      client.sendXt('zo', -1, client.coins);
    }
  }

};