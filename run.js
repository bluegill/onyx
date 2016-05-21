'use strict';

var path = 'lib';

if(process.argv[3] == '--src'){
  path = 'src';
}

var server = require('./' + path + '/server').default;
var logger = require('./' + path + '/logger').default;
var utils  = require('./' + path + '/utils').default;

var serverConfig = require('./config/server');
var serverId     = process.argv[2];

serverConfig = serverConfig[serverId];

utils.handleStartup();

if(serverConfig){
  serverConfig.id = serverId;
  new server(serverConfig);
} else {
  logger.error('Server configuration not found');
}