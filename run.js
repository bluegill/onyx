'use strict';

const path = 'lib';

if(process.argv.includes('--src')) path = 'src';

const server = require('./' + path + '/Onyx').default;
const logger = require('./' + path + '/Logger').default;
const utils  = require('./' + path + '/Utils').default;

let serverConfig = require('./onyxConfig').Server;
let serverId     = process.argv[2];

serverConfig = serverConfig[serverId];

if(!process.argv.includes('--hide-header'))
  utils.showHeader();

if(serverConfig){
  serverConfig.id = serverId;
  new server(serverConfig);
} else {
  logger.error('Server configuration not found');
}