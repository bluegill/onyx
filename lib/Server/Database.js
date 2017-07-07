'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utilities = require('../Utilities');

var _Utilities2 = _interopRequireDefault(_Utilities);

var _Logger = require('../Utilities/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _Config = require('../Config');

var config = _interopRequireWildcard(_Config);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
  function _class() {
    _classCallCheck(this, _class);

    this.knex = require('knex')({
      client: 'mariadb',
      connection: {
        'host': config.SERVER_DATABASE_HOST,
        'db': config.SERVER_DATABASE_NAME,
        'user': config.SERVER_DATABASE_USER,
        'password': config.SERVER_DATABASE_PASS
      }
    });
  }

  _createClass(_class, [{
    key: 'updateColumn',
    value: function updateColumn(user, column, value) {
      return this.knex('users').update(column, value).where('id', user).then(function () {
        // execute
      }).catch(function (error) {
        _Logger2.default.error(error);
      });
    }
  }, {
    key: 'getItems',
    value: function getItems() {
      return this.knex('items').select('*');
    }
  }, {
    key: 'getPlayerByName',
    value: function getPlayerByName(username) {
      return this.knex('users').first('*').where('username', username);
    }
  }, {
    key: 'getPlayerById',
    value: function getPlayerById(id) {
      return this.knex('users').first('*').where('id', id);
    }
  }, {
    key: 'addBan',
    value: function addBan(moderator, user, duration, reason) {
      return this.knex('bans').insert({
        'player': user,
        'moderator': moderator,
        'reason': reason,
        'duration': duration,
        'timestamp': _Utilities2.default.getTime()
      }).then(function () {
        // execute
      }).catch(function (error) {
        _Logger2.default.error(error);
      });
    }
  }]);

  return _class;
}();

exports.default = _class;