'use strict';

const path = 'lib';

if(process.argv.includes('--src')){
  path = 'src';
}

const server = require('./' + path + '/server').default;
const logger = require('./' + path + '/logger').default;
const utils  = require('./' + path + '/utils').default;

let serverConfig = require('./config/server');
let serverId     = process.argv[2];

serverConfig = serverConfig[serverId];

if(!process.argv.includes('--hide-header')){
  utils.showHeader();
}

if(serverConfig){
  serverConfig.id = serverId;
  new server(serverConfig);
} else {
  logger.error('Server configuration not found');
}