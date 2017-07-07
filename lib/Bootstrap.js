'use strict';

// bootstrap server
// npm start [server id]
// or node Bootstrap.js [server id]

var _Logger = require('./Utilities/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _Server = require('./Server');

var _Server2 = _interopRequireDefault(_Server);

var _Config = require('./Config');

var Config = _interopRequireWildcard(_Config);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (Config.SERVER_ID) {
  var Instance = new _Server2.default(Config);

  if (!Instance) {
    _Logger2.default.error('Unable to create server instance.');
  }
} else {
  _Logger2.default.error('Server configuration not found');
}