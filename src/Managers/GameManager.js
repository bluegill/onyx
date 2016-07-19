import logger from '../logger';

export default class {
  constructor(world){
    this.world  = world;
    this.server = world.server;

    this.handlers = {
      // GENERAL GAME HANDLERS
      'z': {
        'zo': 'handleGameOver',
        'gz': 'handleGetGame',
        'm' : 'handleMovePuck',

        'jz': 'handleJoinGame',
        'lz': 'handleLeaveGame',

        'zm': 'handleSendMove'
      },

      // MULTIPLAYER HANDLERS
      's': {
        'a#gt': 'handleGetTable',
        'a#jt': 'handleJoinTable',
        'a#lt': 'handleLeaveTable'
      }
    }

    this.fetchHandlers();

    this.puck = [];

    this.tableGames      = [];
    this.tablePopulation = [];
    this.tablePlayers    = [];

    // populate tables
    for(let i = 200; i < 208; i++){
      this.tableGames[i]      = null;
      this.tablePopulation[i] = {};
      this.tablePlayers[i]    = [];
    }

    logger.info('Game manager initialized');
  }

  fetchHandlers(){
    const gameHandler = require('../Handlers/Games').Games;

    for(const handlerName of Object.keys(gameHandler)){
      this[handlerName] = gameHandler[handlerName];
    }
  }

  leaveTable(client){
    const tableId = client.tableId;

    if(tableId){
      const seatId       = this.tablePlayers[tableId].indexOf(client);
      const opponentSeat = (seatId == 0 ? 1 : 0);

      client.room.sendXt('ut', -1, tableId, seatId);

      client.tableId = null;

      if(this.tablePlayers[tableId].length == 2)
        this.tablePlayers[tableId][opponentSeat].sendXt('cz', -1, client.nickname);

      this.tablePlayers[tableId].splice(seatId);

      delete this.tablePopulation[tableId][client.nickname];

      if(this.tablePlayers[tableId].length == 0){
        this.tablePlayers[tableId]    = [];
        this.tablePopulation[tableId] = {};
        this.tableGames[tableId]      = null;
      }
    }
  }
}