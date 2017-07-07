'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Extension2 = require('../Extension');

var _Extension3 = _interopRequireDefault(_Extension2);

var _Utilities = require('../Utilities');

var _Utilities2 = _interopRequireDefault(_Utilities);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// todo: rewrite commands extension

var _class = function (_Extension) {
  _inherits(_class, _Extension);

  function _class(manager) {
    _classCallCheck(this, _class);

    var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, manager));

    _this.commands = {
      'id': _this.handleGetId,
      'ai': _this.handleAddItem,
      'ac': _this.handleAddCoins,
      'gc': _this.handleGiftCoins,
      'jr': _this.handleJoinRoom,
      'ping': _this.handlePing,
      'online': _this.handleOnline,
      'global': _this.handleGlobal,
      'nick': _this.handleNick,
      'mute': _this.handleMute,
      'kick': _this.handleKick,
      'ban': _this.handleBan,
      'find': _this.handleFindPlayer,
      'goto': _this.handleGotoPlayer,
      'summon': _this.handleSummonPlayer,
      'reload': _this.handleReload
    };

    _Utilities2.default.extend(_this, [_this.world.handleSendMessage, _this.handleSendMessage]);
    return _this;
  }

  _createClass(_class, [{
    key: 'parseCommand',
    value: function parseCommand(message) {
      message = message.substr(1);

      var data = message.split(' ');

      var command = {
        name: data.shift(),
        args: data
      };

      return command;
    }
  }, {
    key: 'handleSendMessage',
    value: function handleSendMessage(data, client) {
      var message = data[4];

      var prefix = message[0];

      if (this.prefix.includes(prefix)) {
        var command = this.parseCommand(message);

        if (this.commands[command.name]) {
          this.commands[command.name](command.args, client);

          return true;
        }

        console.log('Command [' + command.name + '] does not exist!');
      }
    }
  }, {
    key: 'handleUpdatePlayer',
    value: function handleUpdatePlayer(data, client) {
      var type = data[0];
      var id = parseInt(data[1]);

      var types = {
        'c': 'color',
        'h': 'head',
        'f': 'face',
        'n': 'neck',
        'b': 'body',
        'a': 'hand',
        'e': 'feet',
        'l': 'pin',
        'p': 'photo'
      };

      if (!type || !id) return;

      if (!isNaN(id)) {
        if (!types[type]) return;

        var item = this.world.itemCrumbs[id];

        if (!item) return;

        if (!client.inventory.includes(id)) {
          if (item.patched === 1 && client.rank < 1) return client.sendError(402);
          if (item.patched === 2 && client.rank < 2) return client.sendError(402);
          if (item.patched === 3 && client.rank < 4) return client.sendError(402);

          if (client.rank > 1) item.cost = 0;

          if (client.coins < item.cost) return client.sendError(401);

          client.removeCoins(item.cost);
          client.addItem(id);
        }

        client.room.sendXt('up' + type, -1, client.id, id);
        client.updateOutfit(types[type], id);
      }
    }
  }, {
    key: 'handleFindPlayer',
    value: function handleFindPlayer(data, client) {
      if (!client.isModerator) return;

      var playerObj = isNaN(data[0]) ? this.world.getClientByName(data[0]) : this.world.getClientById(data[0]);

      if (playerObj) client.sendXt('bf', -1, playerObj.room.id, playerObj.nickname);
    }
  }, {
    key: 'handleGotoPlayer',
    value: function handleGotoPlayer(data, client) {
      if (!client.isModerator) return;

      var playerObj = isNaN(data[0]) ? this.world.getClientByName(data[0]) : this.world.getClientById(data[0]);

      if (playerObj) {
        if (playerObj.room.id === client.room.id) return;

        this.world.handleJoinRoom({ 3: playerObj.room.id }, client);
      }
    }
  }, {
    key: 'handleSummonPlayer',
    value: function handleSummonPlayer(data, client) {
      if (!client.isModerator) return;

      var playerObj = isNaN(data[0]) ? this.world.getClientByName(data[0]) : this.world.getClientById(data[0]);

      if (playerObj) {
        if (playerObj.room.id === client.room.id) return;

        this.world.handleJoinRoom({ 3: client.room.id }, playerObj);
      }
    }
  }, {
    key: 'handleUpdateColor',
    value: function handleUpdateColor(data, client) {
      var color = data[0];

      if (color.substr(0, 2) !== '0x') color = '0x' + color;

      if (/^0x[0-9A-F]{6}$/i.test(color) !== false || !isNaN(color) && color < 50) {
        client.updateOutfit('color', color);
        client.room.sendXt('upc', -1, client.id, color);
      }
    }
  }, {
    key: 'handleReload',
    value: function handleReload(data, client) {
      var _this2 = this;

      if (!client.isModerator) return;
      if (client.rank < 4) return;

      this.world.reloadModules().then(function () {
        var bot = _this2.parent.getPlugin('bot');

        if (bot) bot.sendMessage('Handler modules have been reloaded and are now up-to-date!', client);
      });
    }
  }, {
    key: 'handleOnline',
    value: function handleOnline(data, client) {
      var bot = this.parent.getPlugin('bot');

      if (bot) bot.sendMessage('There are ' + this.world.getUserCount() + ' users online!', client);
    }
  }, {
    key: 'handleGetId',
    value: function handleGetId(data, client) {
      var bot = this.parent.getPlugin('bot');

      if (!bot) return;

      var name = data.join(' ');

      if (name.length > 2 && client.isModerator) {
        var player = this.world.getClientByName(name);

        if (player) bot.sendMessage(player.nickname + '\'s ID is ' + player.id + '!', client);
      } else {
        bot.sendMessage('Your ID is ' + client.id + '!', client);
      }
    }
  }, {
    key: 'handlePing',
    value: function handlePing(data, client) {
      var bot = this.parent.getPlugin('bot');

      if (bot) bot.sendMessage('Pong!', client);
    }
  }, {
    key: 'handleKick',
    value: function handleKick(data, client) {
      if (!client.isModerator) return;

      var playerObj = isNaN(data[0]) ? this.world.getClientByName(data[0]) : this.world.getClientById(data[0]);

      if (playerObj) playerObj.sendError(5, true);
    }
  }, {
    key: 'handleMute',
    value: function handleMute(data, client) {
      if (!client.isModerator) return;

      var playerObj = isNaN(data[0]) ? this.world.getClientByName(data[0]) : this.world.getClientById(data[0]);

      if (playerObj) {
        playerObj.isMuted = !playerObj.isMuted;
      }
    }
  }, {
    key: 'handleBan',
    value: function handleBan(data, client) {
      if (!client.isModerator) return;

      var playerObj = isNaN(data[0]) ? this.world.getClientByName(data[0]) : this.world.getClientById(data[0]);

      var duration = parseInt(data[1]);

      if (!duration) duration = 24;

      if (duration < 0) duration = 0;
      if (duration > 999) duration = 999;

      if (playerObj) {
        this.world.database.addBan(client.id, playerObj.id, duration, 'Banned by ' + client.nickname);

        playerObj.sendXt('b', -1);
        playerObj.disconnect();
      }
    }
  }, {
    key: 'handleNick',
    value: function handleNick(data, client) {
      if (client.isModerator && client.rank >= 4) {
        client.nickname = data.join(' ');

        this.world.handleJoinRoom({ 3: client.room.id }, client);
      }
    }
  }, {
    key: 'handleGlobal',
    value: function handleGlobal(data, client) {
      if (client.isModerator && client.rank >= 3) {
        var bot = this.parent.getPlugin('bot');
        var msg = data.join(' ');

        if (bot && msg.length > 3) bot.sendGlobal(msg);
      }
    }
  }, {
    key: 'handleJoinRoom',
    value: function handleJoinRoom(data, client) {
      var room = parseInt(data[0]);

      this.world.handleJoinRoom({ 3: room }, client);
    }
  }, {
    key: 'handleAddItem',
    value: function handleAddItem(data, client) {
      var item = parseInt(data[0]);

      if (!isNaN(item)) {
        if (this.world.itemCrumbs[item]) {
          return client.addItem(item);
        }
      }

      client.sendError(402);
    }
  }, {
    key: 'handleAddCoins',
    value: function handleAddCoins(data, client) {
      if (!client.isModerator) return;

      var coins = parseInt(data[0]);

      if (!isNaN(coins)) {
        if (coins > 50000) coins = 50000;

        client.addCoins(coins);
        client.sendXt('zo', -1, client.coins);
      }
    }
  }, {
    key: 'handleGiftCoins',
    value: function handleGiftCoins(data, client) {
      if (!client.isModerator || client.rank < 3) return;

      var playerObj = isNaN(data[0]) ? this.world.getClientByName(data[0]) : this.world.getClientById(data[0]);
      var coins = parseInt(data[1]);

      if (playerObj && !isNaN(coins)) {
        if (coins > 50000) coins = 50000;

        playerObj.addCoins(coins);
        playerObj.sendXt('zo', -1, playerObj.coins);
      }
    }
  }]);

  return _class;
}(_Extension3.default);

exports.default = _class;