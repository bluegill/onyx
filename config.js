export const LOGIN_SERVER = {
  SERVER_ID: 1,
  SERVER_PORT: 6112,
  SERVER_HOST: '127.0.0.1'
}

export const WORLD_SERVER = {
  SERVER_ID: 100,
  SERVER_PORT: 9875,
  SERVER_HOST: '127.0.0.1'
}

export const SERVER_ID = process.argv[2]
export const SERVER_TYPE = (SERVER_ID === LOGIN_SERVER.SERVER_ID ? 'login' : 'world')

export const SERVER_CONNECTIONS_MAX = 256
export const SERVER_CONNECTIONS_CONCURRENT = -1 // -1 for unlimited

export const SERVER_DATABASE = 'mysql' // maybe use mongodb in the future?

export const SERVER_DATABASE_HOST = '127.0.0.1'
export const SERVER_DATABASE_PORT = 3306
export const SERVER_DATABASE_NAME = 'onyx'
export const SERVER_DATABASE_USER = 'root'
export const SERVER_DATABASE_PASS = 'ascent'

export const SERVER_PLUGINS = [{
  enabled: true,
  path: 'Plugins/Bot',
  name: 'Bot'
}, {
  enabled: true,
  path: 'Plugins/Commands',
  name: 'Commands'
}, {
  enabled: true,
  path: 'Plugins/Censor',
  name: 'Censor'
}, {
  enabled: false,
  path: 'Plugins/Welcome',
  name: 'Welcome Message'
}]

export const ACCOUNT_LOGIN_AUTH = 'sha256' // md5, sha256
