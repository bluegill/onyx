'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _Utilities = require('../Utilities');

var _Utilities2 = _interopRequireDefault(_Utilities);

var _Logger = require('../Utilities/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _bluebird = require('bluebird');

var Promise = _interopRequireWildcard(_bluebird);

var _Penguin = require('./Penguin');

var _Penguin2 = _interopRequireDefault(_Penguin);

var _Database = require('./Database');

var _Database2 = _interopRequireDefault(_Database);

var _Network = require('../Network');

var _Network2 = _interopRequireDefault(_Network);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
  function _class(config) {
    var _this = this;

    _classCallCheck(this, _class);

    _Logger2.default.info('Starting server...');

    if (!config.SERVER_ID) {
      _Logger2.default.error('Missing server ID parameter', config);
      process.exit();
    }

    this.config = config;

    this.id = config.SERVER_ID;
    this.type = config.SERVER_TYPE;

    this.port = config.LOGIN_SERVER.SERVER_PORT;

    if (this.type === 'world') {
      this.port = config.WORLD_SERVER.SERVER_PORT;
    }

    this.maxClients = config.SERVER_CONNECTIONS_MAX ? config.SERVER_CONNECTIONS_MAX : 100;
    this.clients = [];

    this.database = new _Database2.default();
    this.network = new _Network2.default(this);

    Promise.promisifyAll(_fs2.default);

    if (this.type === 'world') {
      this.roomManager = this.world.roomManager;
      this.gameManager = this.world.gameManager;
    }

    this.createServer();

    if (process.env.NODE_ENV === 'production') {
      process.on('SIGINT', function () {
        return _this.handleShutdown();
      });
      process.on('SIGTERM', function () {
        return _this.handleShutdown();
      });
    }
  }

  _createClass(_class, [{
    key: 'createServer',
    value: function createServer() {
      var _this2 = this;

      _net2.default.createServer(function (socket) {
        _Logger2.default.info('A client has connected');

        socket.setEncoding('utf8');

        var clientObj = new _Penguin2.default(socket, _this2);

        if (_this2.clients.length >= _this2.maxClients) clientObj.sendError(103, true); // server full

        _this2.clients.push(clientObj);

        socket.on('data', function (data) {
          data = data.toString().split('\0')[0];

          _this2.network.handleData(data, clientObj);
        });

        socket.on('close', function () {
          clientObj.disconnect();

          _Logger2.default.info('A client has disconnected');
        });

        socket.on('error', function (error) {
          clientObj.disconnect();

          if (error.code === 'ETIMEDOUT' || error.code === 'ECONNRESET') return;

          _Logger2.default.error(error);
        });
      }).listen(this.port, function () {
        var type = _Utilities2.default.firstToUpper(_this2.type);

        _Logger2.default.info(type + ' server listening on port ' + _this2.port);
      });
    }
  }, {
    key: 'removeClient',
    value: function removeClient(client) {
      var index = this.clients.indexOf(client);

      if (index > -1) {
        _Logger2.default.debug('Removing disconnecting client...');

        if (client.room) client.room.removeClient(client);

        if (client.tableId) this.gameManager.leaveTable(client);

        if (client.buddies) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = client.buddies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var buddy = _step.value;

              if (this.isOnline(buddy)) this.getClientById(buddy).sendXt('bof', -1, client.id);
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

        if (this.roomManager) {
          var igloo = client.id + 1000;

          if (this.roomManager.checkIgloo(igloo)) this.roomManager.closeIgloo(igloo);
        }

        this.clients.splice(index, 1);

        client.socket.end();
        client.socket.destroy();
      }
    }
  }, {
    key: 'handleShutdown',
    value: function handleShutdown() {
      var _this3 = this;

      _Logger2.default.warn('Server shutting down in 30 seconds...');

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.clients[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var client = _step2.value;

          client.sendError(990);
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

      setTimeout(function () {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = _this3.clients[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var client = _step3.value;

            client.disconnect();
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

        process.exit();
      }, 30000);
    }
  }, {
    key: 'reloadModules',
    value: function reloadModules() {
      var _this4 = this;

      return _fs2.default.readdirAsync(_path2.default.join(__dirname, 'Handlers')).map(function (file) {
        if (file.substr(file.length - 3) === '.js') delete require.cache[file];
      }).then(function () {
        _this4.world.fetchHandlers();
        _this4.gameManager.fetchHandlers();
      });
    }
  }, {
    key: 'isOnline',
    value: function isOnline(id) {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this.clients[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var client = _step4.value;

          if (client.id === id) return true;
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return false;
    }
  }, {
    key: 'getClientById',
    value: function getClientById(id) {
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = this.clients[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var client = _step5.value;

          if (client.id === id) return client;
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
    }
  }, {
    key: 'getClientByName',
    value: function getClientByName(name) {
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = this.clients[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var client = _step6.value;

          if (client.nickname.toLowerCase() === name.toLowerCase()) return client;
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }
    }
  }, {
    key: 'getList',
    value: function getList() {
      var serverList = [];

      var world = this.config.WORLD_SERVER;

      var server = [world.SERVER_ID, world.SERVER_NAME, world.SERVER_HOST, world.SERVER_PORT];

      serverList.push(server);

      return serverList.join('%');
    }
  }]);

  return _class;
}();

exports.default = _class;