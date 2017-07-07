'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Logger = require('../../Utilities/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
  function _class(world) {
    _classCallCheck(this, _class);

    this.world = world;
    this.server = world.server;

    this.handlers = {
      // GENERAL GAME HANDLERS
      'z': {
        'zo': 'handleGameOver',
        'gz': 'handleGetGame',
        'm': 'handleMovePuck',

        'jz': 'handleJoinGame',
        'lz': 'handleLeaveGame',

        'zm': 'handleSendMove'
      },

      // MULTIPLAYER HANDLERS
      's': {
        'a#gt': 'handleGetTable',
        'a#jt': 'handleJoinTable',
        'a#lt': 'handleLeaveTable'
      }
    };

    this.fetchHandlers();

    this.puck = [];

    this.tableGames = [];
    this.tablePopulation = [];
    this.tablePlayers = [];

    // populate tables
    for (var i = 200; i < 208; i++) {
      this.tableGames[i] = null;
      this.tablePopulation[i] = {};
      this.tablePlayers[i] = [];
    }

    _Logger2.default.info('Game manager initialized');
  }

  _createClass(_class, [{
    key: 'fetchHandlers',
    value: function fetchHandlers() {
      var gameHandler = require('../Handlers/Games');

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(gameHandler)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var handlerName = _step.value;

          this[handlerName] = gameHandler[handlerName];
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
    }
  }, {
    key: 'leaveTable',
    value: function leaveTable(client) {
      var tableId = client.tableId;

      if (tableId) {
        var seatId = this.tablePlayers[tableId].indexOf(client);
        var opponentSeat = seatId === 0 ? 1 : 0;

        client.room.sendXt('ut', -1, tableId, seatId);

        client.tableId = null;

        if (this.tablePlayers[tableId].length === 2) {
          this.tablePlayers[tableId][opponentSeat].sendXt('cz', -1, client.nickname);
        }

        this.tablePlayers[tableId].splice(seatId);

        delete this.tablePopulation[tableId][client.nickname];

        if (this.tablePlayers[tableId].length === 0) {
          this.tablePlayers[tableId] = [];
          this.tablePopulation[tableId] = {};
          this.tableGames[tableId] = null;
        }
      }
    }
  }]);

  return _class;
}();

exports.default = _class;