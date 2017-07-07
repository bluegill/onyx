'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
  function _class() {
    _classCallCheck(this, _class);
  }

  _createClass(_class, null, [{
    key: 'generateKey',
    value: function generateKey() {
      var characterMap = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-_+=:;,./[]`~';

      var randomKey = '';

      for (var i = 0; i < 12; i++) {
        var randomChar = Math.floor(Math.random() * characterMap.length);
        randomKey += characterMap.charAt(randomChar);
      }

      return randomKey;
    }
  }, {
    key: 'md5',
    value: function md5(data) {
      return _crypto2.default.createHash('md5').update(data).digest('hex');
    }
  }, {
    key: 'sha256',
    value: function sha256(data) {
      return _crypto2.default.createHash('sha256').update(data).digest('hex');
    }
  }, {
    key: 'swapHash',
    value: function swapHash(hash) {
      var swappedHash = hash.substr(32, 32) + hash.substr(0, 32);

      return swappedHash;
    }
  }, {
    key: 'encryptPassword',
    value: function encryptPassword(pass, key) {
      var encryptedPass = this.swapHash(pass) + key;

      encryptedPass += 'Y(02.>\'H}t":E1';
      encryptedPass = this.sha256(encryptedPass);

      return this.swapHash(encryptedPass);
    }
  }]);

  return _class;
}();

exports.default = _class;