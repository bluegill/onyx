'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Room = require('../Room');

var _Room2 = _interopRequireDefault(_Room);

var _Logger = require('../../Utilities/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _rooms = require('../../../data/crumbs/rooms');

var _rooms2 = _interopRequireDefault(_rooms);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
  function _class(world) {
    _classCallCheck(this, _class);

    this.rooms = [];
    this.world = world;
    this.server = world.server;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = Object.keys(_rooms2.default)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var id = _step.value;

        if (id < 900) {
          this.rooms[id] = new _Room2.default(id, this);
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

    _Logger2.default.info('Room manager initialized, loaded ' + this.rooms.length + ' rooms');
  }

  _createClass(_class, [{
    key: 'createRoom',
    value: function createRoom(id) {
      if (!this.rooms[id]) {
        this.rooms[id] = new _Room2.default(id, this);
      }
    }
  }, {
    key: 'getRoom',
    value: function getRoom(id) {
      if (this.rooms[id]) return this.rooms[id];
    }
  }, {
    key: 'checkIgloo',
    value: function checkIgloo(id) {
      if (this.rooms[id]) {
        if (this.rooms[id].open === true) return true;
      }
    }
  }, {
    key: 'closeIgloo',
    value: function closeIgloo(id) {
      if (this.rooms[id]) {
        return this.rooms[id].open = false;
      }
    }
  }]);

  return _class;
}();

exports.default = _class;