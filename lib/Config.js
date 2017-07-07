'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var LOGIN_SERVER = exports.LOGIN_SERVER = {
  SERVER_ID: 1,
  SERVER_PORT: 6112,
  SERVER_HOST: '127.0.0.1'
};

var WORLD_SERVER = exports.WORLD_SERVER = {
  SERVER_ID: 100,
  SERVER_PORT: 9875,
  SERVER_HOST: '127.0.0.1'
};

var SERVER_ID = exports.SERVER_ID = process.argv[2];
var SERVER_TYPE = exports.SERVER_TYPE = SERVER_ID === LOGIN_SERVER.SERVER_ID ? 'login' : 'world';

var SERVER_CONNECTIONS_MAX = exports.SERVER_CONNECTIONS_MAX = 256;
var SERVER_CONNECTIONS_CONCURRENT = exports.SERVER_CONNECTIONS_CONCURRENT = -1; // -1 for unlimited

var SERVER_DATABASE = exports.SERVER_DATABASE = 'mysql'; // maybe use mongodb in the future?

var SERVER_DATABASE_HOST = exports.SERVER_DATABASE_HOST = '127.0.0.1';
var SERVER_DATABASE_PORT = exports.SERVER_DATABASE_PORT = 3306;
var SERVER_DATABASE_NAME = exports.SERVER_DATABASE_NAME = 'onyx';
var SERVER_DATABASE_USER = exports.SERVER_DATABASE_USER = 'root';
var SERVER_DATABASE_PASS = exports.SERVER_DATABASE_PASS = 'ascent';

var SERVER_EXTENSIONS = exports.SERVER_EXTENSIONS = [{
  enabled: true,
  path: 'Extensions/Bot',
  name: 'Bot'
}, {
  enabled: true,
  path: 'Extensions/Commands',
  name: 'Commands'
}, {
  enabled: false,
  path: 'Extensions/Censor',
  name: 'Censor'
}];

var ACCOUNT_LOGIN_AUTH = exports.ACCOUNT_LOGIN_AUTH = 'sha256'; // md5 or sha256