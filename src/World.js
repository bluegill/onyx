import fs            from 'fs';
import Promise       from 'bluebird';

Promise.promisifyAll(fs);

import utils         from './Utils';
import logger        from './Logger';

import roomManager   from './Managers/RoomManager';
import gameManager   from './Managers/GameManager';
import pluginManager from './Managers/PluginManager';

export default class {
  constructor(server){
    this.server        = server;
    this.database      = server.database;
    this.knex          = server.database.knex;

    this.fetchCrumbs();

    this.roomManager   = new roomManager(this);
    this.gameManager   = new gameManager(this);

    this.fetchHandlers().then(() => {
      this.pluginManager = new pluginManager(this);
    });

    this.handlers      = {
      // NAVIGATION HANDLERS
      'j': {
        'js': 'handleJoinServer',
        'jr': 'handleJoinRoom',
        'jp': 'handleJoinPlayer'
      },

      // PLAYER HANDLERS
      'u': {
        'h': 'handleHeartbeat',
        'gp': 'handleGetPlayer',
        'id': 'handleGetPlayerId',
        'sp': 'handleSendMove',
        'sf': 'handleSendFrame',
        'sa': 'handleSendAction',
        'sb': 'handleSendSnowball',
        'se': 'handleSendEmote',
        'ss': 'handleSendSafeMessage',
        'sj': 'handleSendJoke',
        'sg': 'handleSendTourGuide',
        'ge': 'handleGetSettings',
        'ue': 'handleUpdateSettings'
      },

      // SYSTEM HANDLERS
      's': {
        'upc': 'handleUpdateClothing',
        'uph': 'handleUpdateClothing',
        'upf': 'handleUpdateClothing',
        'upn': 'handleUpdateClothing',
        'upb': 'handleUpdateClothing',
        'upa': 'handleUpdateClothing',
        'upe': 'handleUpdateClothing',
        'upl': 'handleUpdateClothing',
        'upp': 'handleUpdateClothing',
        'upo': 'handleUpdateOutfit',
        'upu': 'handleUpdateCard',
        'upm': 'handleUpdateMood',
        'ups': 'handleUpdateSpeed',
        'upk': 'handleUpdateBeak',
        'ung': 'handleUpdateNameGlow',
        'ubc': 'handleUpdateBubbleColor'
      },

      // MODERATOR HANDLERS
      'o': {
        'k' : 'handleKick',
        'm' : 'handleMute',
        'b' : 'handleBan',
        'wa': 'handleWarn',
        'sr': 'handleSearch',
        'mp': 'handleMove',
        'bn': 'handleBlockName'
      },

      // COMMUNICATION HANDLERS
      'm': {
        'sm': 'handleSendMessage',
        'spm': 'handleSendPrivateMessage'
      },

      // INVENTORY HANDLERS
      'i': {
        'ai': 'handleAddItem',
        'gi': 'handleGetInventory'
      },

      // IGLOO HANDLERS
      'g': {
        'gm': 'handleGetIgloo',
        'gr': 'handleGetIglooList',
        'go': 'handleGetOwnedIgloos',
        'or': 'handleOpenIgloo',
        'cr': 'handleCloseIgloo',
        'ur': 'handleSaveFurniture',
        'um': 'handleUpdateMusic',
        'ag': 'handleUpdateFloor',
        'au': 'handleAddIgloo',
        'ao': 'handleUpdateIgloo',
        'af': 'handleAddFurniture',
        'gf': 'handleGetFurniture'
      },

      // PUFFLE HANDLERS
      'p': {
        'pg' : 'handleGetPuffle',
        'pgu': 'handleGetPuffleUser'
      },

      // TOY HANDLERS
      't': {
        'at': 'handleAddToy',
        'rt': 'handleRemoveToy'
      },

      // BUDDY LIST HANDLERS
      'b': {
        //'gb': 'handleGetBuddies',
        'ba': 'handleBuddyAccept',
        'rb': 'handleBuddyRemove',
        'bf': 'handleBuddyFind',
        'br': 'handleBuddyRequest'
      },

      // IGNORE LIST HANDLERS
      'n': {
        //'gn': 'handleGetIgnored',
        'an': 'handleAddIgnore',
        'rn': 'handleRemoveIgnore'
      },

      // MAIL HANDLERS
      'l': {
        'mst': 'handleStartMail',
        'mg' : 'handleGetMail'
      },
    }
  }

  fetchHandlers(){
    return fs.readdirAsync(__dirname + '/Handlers').map((file) => {
      if(file.substr(file.length - 3) == '.js'){
        let handlerFile = require(__dirname + '/Handlers/' + file)[file.slice(0, -3)];

        for(const handlerName of Object.keys(handlerFile)){
          this[handlerName] = handlerFile[handlerName];
        }
      }
    });
  }

  fetchCrumbs(){
    this.itemCrumbs      = require('../data/crumbs/items');
    this.furnitureCrumbs = require('../data/crumbs/furniture');
    this.iglooCrumbs     = require('../data/crumbs/igloos');
    this.floorCrumbs     = require('../data/crumbs/floors');
    
    this.database.getItems().then((items) => {
      Promise.each(items, (item) => {
        this.itemCrumbs[item.item_id] = {
          name: item.name,
          type: item.type,
          patched: item.patched,
          cost: parseInt(item.cost),
          member: false
        }
      });
    }).catch((error) => {
      logger.error(error);
    });
  }

  //////////////////

  isOnline(id){ return this.server.isOnline(id); }

  getUserCount(){ return this.server.clients.length; }

  getClientById(id){ return this.server.getClientById(id); }

  getClientByName(name){ return this.server.getClientByName(name); }

  removeClient(client){ return this.server.removeClient(client); }

  reloadModules(){ return this.server.reloadModules(); }
}