'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: USE DIFFERENT LOGGING LIBRARY

_winston2.default.emitErrs = true;

exports.default = new _winston2.default.Logger({
  transports: [new _winston2.default.transports.Console({
    level: 'debug',
    colorize: true,
    handleExceptions: true,
    humanReadableUnhandledException: true
  }), new _winston2.default.transports.File({
    name: 'error',
    level: 'error',
    filename: 'error.log'
  }) /*,
     new winston.transports.File({
     name: 'debug',
     level: 'debug',
     filename: 'debug.log'
     }) */
  ],

  exitOnError: false
});