'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _Logger = require('../Utilities/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _Requests = require('../Network/Requests');

var _Requests2 = _interopRequireDefault(_Requests);

var _bluebird = require('bluebird');

var Promise = _interopRequireWildcard(_bluebird);

var _RoomManager = require('./Managers/RoomManager');

var _RoomManager2 = _interopRequireDefault(_RoomManager);

var _GameManager = require('./Managers/GameManager');

var _GameManager2 = _interopRequireDefault(_GameManager);

var _ExtensionManager = require('./Managers/ExtensionManager');

var _ExtensionManager2 = _interopRequireDefault(_ExtensionManager);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
  function _class(server) {
    var _this = this;

    _classCallCheck(this, _class);

    this.server = server;
    this.database = server.database;
    this.knex = server.database.knex;

    this.fetchCrumbs();

    this.roomManager = new _RoomManager2.default(this);
    this.gameManager = new _GameManager2.default(this);

    Promise.promisifyAll(_fs2.default);

    this.fetchHandlers().then(function () {
      _this.extensionManager = new _ExtensionManager2.default(_this);
    });
  }

  _createClass(_class, [{
    key: 'fetchHandlers',
    value: function fetchHandlers() {
      var _this2 = this;

      return _fs2.default.readdirAsync(_path2.default.join(__dirname, 'Handlers')).map(function (file) {
        if (file.substr(file.length - 3) === '.js') {
          var handlerFile = require(_path2.default.join(__dirname, 'Handlers', file))[file.slice(0, -3)];

          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = Object.keys(handlerFile)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var handlerName = _step.value;

              _this2[handlerName] = handlerFile[handlerName];
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
      });
    }
  }, {
    key: 'fetchCrumbs',
    value: function fetchCrumbs() {
      var _this3 = this;

      this.itemCrumbs = require('../../data/crumbs/items');
      this.furnitureCrumbs = require('../../data/crumbs/furniture');
      this.iglooCrumbs = require('../../data/crumbs/igloos');
      this.floorCrumbs = require('../../data/crumbs/floors');

      this.database.getItems().then(function (items) {
        Promise.each(items, function (item) {
          _this3.itemCrumbs[item.item_id] = {
            name: item.name,
            type: item.type,
            patched: item.patched,
            cost: parseInt(item.cost),
            member: false
          };
        });
      }).catch(function (error) {
        _Logger2.default.error(error);
      });
    }

    //

  }, {
    key: 'isOnline',
    value: function isOnline(id) {
      return this.server.isOnline(id);
    }
  }, {
    key: 'getUserCount',
    value: function getUserCount() {
      return this.server.clients.length;
    }
  }, {
    key: 'getClientById',
    value: function getClientById(id) {
      return this.server.getClientById(id);
    }
  }, {
    key: 'getClientByName',
    value: function getClientByName(name) {
      return this.server.getClientByName(name);
    }
  }, {
    key: 'removeClient',
    value: function removeClient(client) {
      return this.server.removeClient(client);
    }
  }, {
    key: 'reloadModules',
    value: function reloadModules() {
      return this.server.reloadModules();
    }
  }]);

  return _class;
}();

exports.default = _class;