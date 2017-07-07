'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Logger = require('../../Utilities/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _Config = require('../../Config');

var config = _interopRequireWildcard(_Config);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
  function _class(world) {
    _classCallCheck(this, _class);

    this.world = world;
    this.server = world.server;

    this.extensions = [];

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = config.SERVER_EXTENSIONS[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var extension = _step.value;

        if (extension.enabled) {
          try {
            var name = extension.name.toLowerCase();

            this.extensions[name] = new (require('../../' + extension.path))(this);
          } catch (error) {
            _Logger2.default.error('Unable to load extension: \'' + extension.path + '\'!', error);
          }
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

    var count = Object.keys(this.extensions).length;

    _Logger2.default.info('Extension manager initialized, loaded ' + count + ' extensions.');
  }

  _createClass(_class, [{
    key: 'getExtension',
    value: function getExtension(extension) {
      return this.extensions[extension.toLowerCase()];
    }
  }]);

  return _class;
}();

exports.default = _class;