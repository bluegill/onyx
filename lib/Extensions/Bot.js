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

var _class = function (_Extension) {
  _inherits(_class, _Extension);

  function _class(manager) {
    _classCallCheck(this, _class);

    var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, manager));

    _this.id = 0;
    _this.username = 'Uber';

    _Utilities2.default.extend(_this, [_this.world.handleJoinRoom, _this.handleJoinRoom]);
    _Utilities2.default.extend(_this, [_this.world.handleJoinPlayer, _this.handleJoinPlayer]);
    return _this;
  }

  _createClass(_class, [{
    key: 'handleJoinRoom',
    value: function handleJoinRoom(data, client) {
      this.addToRoom(client);
    }
  }, {
    key: 'handleJoinPlayer',
    value: function handleJoinPlayer(data, client) {
      this.addToRoom(client);
    }
  }, {
    key: 'addToRoom',
    value: function addToRoom(client) {
      var bot = [this.id, this.username, 1, 1, // color
      90001, // head
      103, // face
      0, // neck
      240, // body
      0, // hand
      0, // feet
      0, // flag
      0, // photo
      0, // x
      0, // y
      1, // frame
      1, 1];

      client.sendXt('ap', -1, bot.join('|'));
    }
  }, {
    key: 'sendMessage',
    value: function sendMessage(msg, client) {
      if (client) {
        client.sendXt('sm', -1, this.id, msg);
      }
    }
  }, {
    key: 'sendGlobal',
    value: function sendGlobal(msg, client) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.server.clients[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _client = _step.value;

          _client.sendXt('sm', -1, this.id, msg);
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
  }]);

  return _class;
}(_Extension3.default);

exports.default = _class;