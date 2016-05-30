import logger        from './logger';
import roomManager   from './roomManager';
import gameManager   from './gameManager';
import pluginManager from './pluginManager';

export default class {
  constructor(server){
    this.server        = server;
    this.database      = server.database;
    this.knex          = server.database.knex;
    
    this.roomManager   = new roomManager(this);
    this.pluginManager = new pluginManager(this);
    this.gameManager   = new gameManager(this);

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
        'sr': 'handleSearch'
      },
      // COMMUNICATION HANDLERS
      'm': {
        'sm': 'handleSendMessage'
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
      // BUDDY HANDLERS
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

    this.loadCrumbs();
  }

  do(handler, data, client, override){
    if(this[handler] && !override){
      this[handler](data, client);
    } else {
      try {
        require(`./handlers/${handler}.js`)(data, client, this);
      } catch(error){
        logger.error(error);
      }
    }
  }

  loadCrumbs(){
    this.itemCrumbs      = require('../crumbs/items');
    this.furnitureCrumbs = require('../crumbs/furniture');
    
    this.database.getItems((items, error) => {
      if(!error){
        for(const item of Object.values(items)){
          this.itemCrumbs[item.item_id] = {
            name: item.name,
            type: item.type,
            cost: parseInt(item.cost),
            member: false
          }
        }
      }
    });
  }

  reloadModules(){
    return this.server.reloadModules();
  }

  isOnline(id){
    return this.server.isOnline(id);
  }

  getUserCount(){
    return this.server.clients.length;
  }

  getClientById(id){
    return this.server.getClientById(id);
  }

  getClientByName(name){
    return this.server.getClientByName(name);
  }

  removeClient(client){
    return this.server.removeClient(client);
  }
}