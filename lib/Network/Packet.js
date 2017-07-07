'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
  function _class(data) {
    _classCallCheck(this, _class);

    this.parse(data.toString());
  }

  _createClass(_class, [{
    key: 'parse',
    value: function parse(data) {
      var packet = data.split('\0')[0];

      this.raw = packet;

      if (packet.startsWith('<')) {
        this.type = 'xml';

        if (packet.includes('policy')) {
          this.action = 'policy';

          return;
        }

        var action = packet.split('action=\'')[1].split('\' r=')[0];

        this.action = action;
      }

      if (packet.startsWith('%')) {
        var raw = packet.split('%');

        raw.shift();
        raw.shift();

        this.type = 'ext';
        this.zone = raw.shift();
        this.action = raw.shift();
        this.data = raw;
      }
    }
  }]);

  return _class;
}();

exports.default = _class;