'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Logger = require('../Utilities/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
  function _class(socket, server) {
    _classCallCheck(this, _class);

    this.socket = socket;
    this.server = server;
    this.database = server.database;
    this.knex = server.database.knex;
    this.ip = socket.remoteAddress.split(':').pop();
  }

  _createClass(_class, [{
    key: 'send',
    value: function send(data) {
      if (this.socket) {
        _Logger2.default.debug('outgoing: ' + data);

        this.socket.write(data + '\0');
      }
    }
  }]);

  return _class;
}();

exports.default = _class;