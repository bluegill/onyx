'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
  function _class() {
    _classCallCheck(this, _class);
  }

  _createClass(_class, null, [{
    key: 'inherit',
    value: function inherit(a, b) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(b)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var i = _step.value;

          if (typeof b[i] === 'function') {
            a.prototype[i] = b[i];
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
    }
  }, {
    key: 'extend',
    value: function extend(parent, arr) {
      var _arr = _slicedToArray(arr, 2),
          methodOne = _arr[0],
          methodTwo = _arr[1];

      var result = function result(data, client) {
        methodOne.apply(parent.world, [data, client]);
        methodTwo.apply(parent, [data, client]);
      };

      parent.world[methodTwo.name] = result;
    }
  }, {
    key: 'firstToUpper',
    value: function firstToUpper(text) {
      return text.charAt(0).toUpperCase() + text.slice(1);
    }
  }, {
    key: 'getKeyByValue',
    value: function getKeyByValue(obj, val) {
      return Object.keys(obj).find(function (key) {
        return obj[key] === val;
      });
    }
  }, {
    key: 'getTime',
    value: function getTime() {
      return Math.floor(new Date() / 1000);
    }
  }, {
    key: 'getVersion',
    value: function getVersion() {
      var version = require(process.cwd() + '/package.json').version;

      return version;
    }
  }]);

  return _class;
}();

exports.default = _class;