'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = require('bluebird');

var Promise = _interopRequireWildcard(_bluebird);

var _Utilities = require('../Utilities');

var _Utilities2 = _interopRequireDefault(_Utilities);

var _Logger = require('../Utilities/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _Client2 = require('./Client');

var _Client3 = _interopRequireDefault(_Client2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_Client) {
  _inherits(_class, _Client);

  function _class() {
    _classCallCheck(this, _class);

    return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
  }

  _createClass(_class, [{
    key: 'setClient',
    value: function setClient(player) {
      var time = _Utilities2.default.getTime() - player.registeredTime;

      this.id = player.id;
      this.username = player.username;
      this.nickname = player.nickname;

      this.age = Math.round(time / 86400);

      this.coins = player.coins;
      this.color = player.color;
      this.head = player.head;
      this.face = player.face;
      this.neck = player.neck;
      this.body = player.body;
      this.hand = player.hand;
      this.feet = player.feet;
      this.pin = player.pin;
      this.photo = player.photo;
      this.rank = player.rank;

      this.igloo = player.igloo;
      this.floor = player.floor;
      this.music = player.music;

      this.crumbs = player.crumbs ? JSON.parse(player.crumbs) : {};
      this.igloos = player.igloos ? JSON.parse(player.igloos) : [];
      this.furniture = player.furniture ? JSON.parse(player.furniture) : {};
      this.inventory = player.inventory ? JSON.parse(player.inventory) : [];
      this.buddies = player.buddies ? JSON.parse(player.buddies) : [];
      this.ignored = player.ignored ? JSON.parse(player.ignored) : [];

      this.isModerator = player.rank > 1;
      this.isMuted = false;

      this.x = 0;
      this.y = 0;
      this.frame = 1;

      this.requests = [];

      this.updateColumn('lastLogin', _Utilities2.default.getTime());
      this.updateColumn('lastIP', this.address);
    }
  }, {
    key: 'setCrumb',
    value: function setCrumb(key, value) {
      this.crumbs[key] = value;

      return this.updateColumn('crumbs', JSON.stringify(this.crumbs));
    }
  }, {
    key: 'getCrumb',
    value: function getCrumb(key) {
      return this.crumbs[key];
    }
  }, {
    key: 'addBuddy',
    value: function addBuddy(id) {
      if (!this.buddies.includes(id) && !isNaN(id)) {
        this.buddies.push(id);

        this.updateColumn('buddies', JSON.stringify(this.buddies));
      }
    }
  }, {
    key: 'removeBuddy',
    value: function removeBuddy(id) {
      if (this.buddies.includes(id)) {
        var index = this.buddies.indexOf(id);

        this.buddies.splice(index, 1);

        this.updateColumn('buddies', JSON.stringify(this.buddies));
      }
    }
  }, {
    key: 'addIgnore',
    value: function addIgnore(id) {
      if (!this.ignored.includes(id) && !isNaN(id)) {
        this.ignored.push(id);

        this.updateColumn('ignored', JSON.stringify(this.ignored));
      }
    }
  }, {
    key: 'removeIgnore',
    value: function removeIgnore(id) {
      if (this.ignored.includes(id)) {
        var index = this.ignored.indexOf(id);

        this.ignored.splice(index, 1);

        this.updateColumn('ignored', JSON.stringify(this.ignored));
      }
    }
  }, {
    key: 'getFurniture',
    value: function getFurniture() {
      var furnitureStr = '';

      if (this.furniture.length === 0) return;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(this.furniture)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var id = _step.value;

          var amount = this.furniture[id];

          furnitureStr += '%' + (id + '|' + amount);
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

      return furnitureStr.substr(1);
    }
  }, {
    key: 'getIgloos',
    value: function getIgloos() {
      if (this.igloos.length > 0) {
        return this.igloos.join('|');
      }

      return 1;
    }
  }, {
    key: 'getBuddies',
    value: function getBuddies(callback) {
      var _this2 = this;

      var buddyStr = '';

      this.knex('users').select('id', 'nickname').whereIn('id', this.buddies).then(function (users) {
        Promise.each(users, function (player) {
          buddyStr += player.id + '|' + player.nickname + '|';

          if (_this2.server.isOnline(player.id)) {
            var client = _this2.server.getClientById(player.id);

            client.sendXt('bon', -1, _this2.id);

            buddyStr += '1%';
          } else {
            buddyStr += '0%';
          }
        }).then(function () {
          callback(buddyStr.slice(0, -1));
        });
      });
    }
  }, {
    key: 'getIgnored',
    value: function getIgnored(callback) {
      var ignoreStr = '';

      this.knex('users').select('id', 'nickname').whereIn('id', this.ignored).then(function (users) {
        Promise.each(users, function (player) {
          ignoreStr += player.id + '|' + player.nickname + '%';
        }).then(function () {
          callback(ignoreStr.slice(0, -1));
        });
      });
    }
  }, {
    key: 'buildString',
    value: function buildString() {
      var crumbs = JSON.stringify(this.crumbs);

      var string = [this.id, this.nickname, 1, this.color, this.head, this.face, this.neck, this.body, this.hand, this.feet, this.pin, this.photo, this.x, this.y, this.frame, 1, this.rank, crumbs];

      return string.join('|');
    }
  }, {
    key: 'getInventory',
    value: function getInventory() {
      return this.inventory.join('%');
    }
  }, {
    key: 'updateMusic',
    value: function updateMusic(music) {
      if (!isNaN(music)) {
        this.music = music;
        this.updateColumn('music', music);
      }
    }
  }, {
    key: 'updateFloor',
    value: function updateFloor(floor) {
      if (!isNaN(floor)) {
        this.floor = floor;
        this.updateColumn('floor', floor);

        if (this.room.id === this.id + 1000) {
          this.sendXt('ag', -1, floor, this.coins);
        }
      }
    }
  }, {
    key: 'updateIgloo',
    value: function updateIgloo(igloo) {
      if (!isNaN(igloo)) {
        this.updateColumn('roomFurniture', '[]');
        this.updateColumn('igloo', igloo);
        this.updateColumn('floor', 0);
      }
    }
  }, {
    key: 'addIgloo',
    value: function addIgloo(igloo) {
      if (!isNaN(igloo)) {
        if (!this.igloos[igloo]) {
          this.igloos.push(igloo);
          this.updateColumn('igloos', JSON.stringify(this.igloos));
        }

        if (this.room.id === this.id + 1000) {
          this.sendXt('au', -1, igloo, this.coins);
        }
      }
    }
  }, {
    key: 'addItem',
    value: function addItem(item) {
      if (!this.inventory.includes(item)) {
        this.inventory.push(item);

        this.updateColumn('inventory', JSON.stringify(this.inventory));

        this.sendXt('ai', -1, item, this.coins);
      } else {
        this.sendError(400);
      }
    }
  }, {
    key: 'addFurniture',
    value: function addFurniture(furniture) {
      var amount = 1;

      if (this.furniture[furniture]) {
        amount = parseInt(this.furniture[furniture]) + 1;
      }

      this.furniture[furniture] = amount;

      this.updateColumn('furniture', JSON.stringify(this.furniture));

      this.sendXt('af', -1, furniture, this.coins);
    }
  }, {
    key: 'addCoins',
    value: function addCoins(coins) {
      this.coins += coins;

      this.updateColumn('coins', this.coins);
    }
  }, {
    key: 'removeCoins',
    value: function removeCoins(coins) {
      this.coins -= coins;

      this.updateColumn('coins', this.coins);
    }
  }, {
    key: 'updateOutfit',
    value: function updateOutfit(type, item) {
      this[type] = item;

      this.updateColumn(type, item);
    }
  }, {
    key: 'updateColumn',
    value: function updateColumn(column, value) {
      this.database.updateColumn(this.id, column, value).catch(function (error) {
        _Logger2.default.error(error);
      });
    }
  }, {
    key: 'sendXt',
    value: function sendXt() {
      var args = Array.prototype.join.call(arguments, '%');

      this.send('%xt%' + args + '%');
    }
  }, {
    key: 'sendError',
    value: function sendError(error, disconnect) {
      this.sendXt('e', -1, error);

      if (disconnect) this.disconnect();
    }
  }, {
    key: 'disconnect',
    value: function disconnect() {
      this.server.removeClient(this);
    }
  }]);

  return _class;
}(_Client3.default);

exports.default = _class;