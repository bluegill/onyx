'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

var _Utilities = require('../Utilities');

var _Utilities2 = _interopRequireDefault(_Utilities);

var _Crypto = require('../Utilities/Crypto');

var _Crypto2 = _interopRequireDefault(_Crypto);

var _Logger = require('../Utilities/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _World = require('../Server/World');

var _World2 = _interopRequireDefault(_World);

var _Packet = require('./Packet');

var _Packet2 = _interopRequireDefault(_Packet);

var _Requests = require('./Requests');

var _Requests2 = _interopRequireDefault(_Requests);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
  function _class(server) {
    _classCallCheck(this, _class);

    this.server = server;
    this.database = server.database;

    this.xmlHandlers = {
      'verChk': 'handleVersionCheck',
      'rndK': 'handleRandomKey',
      'login': 'handleLogin'
    };

    this.handlers = {};

    // packet: timeout in seconds
    this.throttle = {
      'sf': 2,
      'sa': 3,
      'sb': 2,
      'se': 2,
      'ss': 3,
      'sj': 3,
      'sg': 5,
      'zo': 30
    };

    if (server.type === 'world') {
      this.world = new _World2.default(server);
      this.server.world = this.world;

      this.watch();
    }
  }

  // not working on linux? chokidar dependency issue


  _createClass(_class, [{
    key: 'watch',
    value: function watch(directory) {
      _Logger2.default.debug('Hotloading enabled, watching for code changes...');

      var modules = {};

      _chokidar2.default.watch('./lib', { alwaysStat: true }).on('all', function (event, path, stats) {
        if (event === 'add') modules[path] = { size: stats.size };
        if (event === 'change') {
          if (modules[path].size !== stats.size) {
            _Logger2.default.info('Reloaded code for ' + path + '...');
            modules[path].size = stats.size;

            delete require.cache[path];
          }
        }
      });
    }
  }, {
    key: 'handleVersionCheck',
    value: function handleVersionCheck(data, client) {
      client.send('<msg t="sys"><body action="apiOK" r="0"></body></msg>');
    }
  }, {
    key: 'handleRandomKey',
    value: function handleRandomKey(data, client) {
      client.randomKey = _Crypto2.default.generateKey();
      client.send('<msg t="sys"><body action="rndK" r="-1"><k>' + client.randomKey + '</k></body></msg>');
    }
  }, {
    key: 'handleLogin',
    value: function handleLogin(data, client) {
      var _this = this;

      var nick = data.split('<nick><![CDATA[')[1].split(']]></nick>')[0];
      var pass = data.split('<pword><![CDATA[')[1].split(']]></pword>')[0];

      this.database.getPlayerByName(nick).then(function (player) {
        if (_this.server.type === 'login') {
          var hash = _Crypto2.default.encryptPassword(player.password.toUpperCase(), client.randomKey);

          if (hash === pass) {
            var loginKey = _Crypto2.default.md5(_Crypto2.default.generateKey());
            var serverList = _this.server.getList();

            _this.database.updateColumn(player.id, 'loginKey', loginKey);

            client.sendXt('sd', -1, serverList);
            client.sendXt('l', -1, player.id, loginKey, '', '100,5');
          } else {
            client.sendError(101, true);
          }
        } else {
          var _hash = pass.substr(pass.length - 32);

          if (_hash.length === 32) {
            var playerObj = _this.server.getClientById(player.id);

            // remove client if already signed in
            if (playerObj) playerObj.disconnect();

            if (_hash === player.loginKey) {
              client.sendXt('l', -1);
              client.setClient(player);
            } else {
              client.sendError(101, true);
            }

            _this.database.updateColumn(player.id, 'loginKey', '');
          }
        }
      }).catch(function (error) {
        _Logger2.default.error(error);

        client.sendError(100, true);
      });
    }
  }, {
    key: 'handleData',
    value: function handleData(data, client) {
      _Logger2.default.debug('incoming: ' + data);

      var isGame = data.charAt(0) !== '<';

      if (!isGame) {
        if (data === '<policy-file-request/>') {
          client.send('<cross-domain-policy><allow-access-= require(domain="*" to-ports="*" /></cross-domain-policy>');
        } else {
          var action = data.split('action=\'')[1].split('\' r=')[0];

          var method = this.xmlHandlers[action];

          if (typeof this[method] === 'function') this[method](data, client);
        }
      } else {
        var packet = new _Packet2.default(data);
        var allowed = ['ur', 'af', 'gf', 'gr', 'gm', 'sm'];

        var world = this.world;

        if (packet.data.join('').includes('|') && !allowed.includes(packet.action) || !client.id || !client.username) {
          client.sendError(800, true);
        }

        if (this.throttle[packet.action]) {
          var timeout = this.throttle[packet.action];

          if (!client.throttled) client.throttled = {};

          if (client.throttled[packet.action] && _Utilities2.default.getTime() < client.throttled[packet.action]) return;

          client.throttled[packet.action] = _Utilities2.default.getTime() + timeout;
        }

        if (this.world.gameManager.handlers[packet.zone]) {
          var gameHandler = this.world.gameManager.handlers[packet.zone][packet.action];

          if (this.world.gameManager[gameHandler]) {
            return this.world.gameManager[gameHandler](data, client);
          }
        }

        var handler = void 0;

        if (_Requests2.default.includes(packet.action)) {
          handler = _Utilities2.default.getKeyFromValue(_Requests2.default, packet.action);
        }

        if (handler && packet.data !== undefined) {
          // data.splice(0, 3); // utilize es6 array destructuring

          if (this.world[handler]) this.world[handler](packet.data, client);
        } else {
          _Logger2.default.warn('Missing handler for ' + packet.action);
        }
      }
    }
  }]);

  return _class;
}();

exports.default = _class;