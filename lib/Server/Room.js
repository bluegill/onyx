'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
  function _class(id, manager) {
    _classCallCheck(this, _class);

    this.clients = [];
    this.id = id;
    this.parent = manager;
    this.server = manager.server;
  }

  _createClass(_class, [{
    key: 'addClient',
    value: function addClient(client, coords) {
      var x = coords[0];
      var y = coords[1];

      if (!x) x = 0;
      if (!y) y = 0;

      client.room = this;
      client.frame = 1;

      client.x = x;
      client.y = y;

      this.clients.push(client);

      this.sendXt('ap', -1, client.buildString());

      if (this.id > 1000) {
        client.sendXt('jp', -1, this.id);
      }

      if (this.clients.length > 0) {
        client.sendXt('jr', -1, this.id, this.buildString());
      } else {
        client.sendXt('jr', -1, this.id);
      }
    }
  }, {
    key: 'removeClient',
    value: function removeClient(client) {
      var index = this.clients.indexOf(client);

      if (index > -1) {
        this.clients.splice(index, 1);
        this.sendXt('rp', -1, client.id);
      }
    }
  }, {
    key: 'sendXt',
    value: function sendXt() {
      var args = Array.prototype.join.call(arguments, '%');

      this.sendData('%xt%' + args + '%');
    }
  }, {
    key: 'sendData',
    value: function sendData(data) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.clients[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var client = _step.value;

          client.send(data);
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
  }, {
    key: 'buildString',
    value: function buildString() {
      var roomStr = '';

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.clients[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var client = _step2.value;

          roomStr += '%' + client.buildString();
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

      return roomStr.substr(1);
    }
  }]);

  return _class;
}();

exports.default = _class;