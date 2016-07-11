import logger from './logger';

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

  handleGetTable(data, client){
    data.splice(0, 3);

    let tablePopulation = '';

    for(const tableId of data){
      if(this.tablePopulation[tableId]){
        const tableObj   = this.tablePopulation[tableId];
        const seatId     = Object.keys(tableObj).length;

        tablePopulation += (tableId + '|' + seatId) + '%';
      }
    }

    client.sendXt('gt', -1, tablePopulation.slice(0, -1));
  }

  handleJoinTable(data, client){
    const tableId  = parseInt(data[3]);
    const tableObj = this.tablePopulation[tableId];

    let seatId     = Object.keys(tableObj).length;

    if(!this.tableGames[tableId]){
      this.tableGames[tableId] = new (require('./games/findFour'))(this);
    }

    seatId += 1;

    this.tablePopulation[tableId][client.nickname] = client;
    this.tablePlayers[tableId].push(client);

    client.sendXt('jt', -1, tableId, seatId);
    client.room.sendXt('ut', -1, tableId, seatId);

    client.tableId = tableId;
  }

  leaveTable(client){
    const tableId = client.tableId;

    if(tableId){
      const seatId       = this.tablePlayers[tableId].indexOf(client);
      const opponentSeat = (seatId == 0 ? 1 : 0);

      client.room.sendXt('ut', -1, tableId, seatId);

      for(const player of this.tablePlayers[tableId]){
        if(player.id !== client.id){
          player.sendXt('cz', -1, client.nickname);
        }
        player.tableId = null;
      }

      this.tablePlayers[tableId]    = [];
      this.tablePopulation[tableId] = {};
      this.tableGames[tableId]      = null;
    }
  }

  handleLeaveTable(data, client){
    this.leaveTable(client);
  }

  handleGetGame(data, client){
    if(client.room.id == 802){      
      client.room.sendXt('gz', -1, this.puck.join('%'));
    } else if(client.tableId){
      const tableId          = client.tableId;
      const players          = Object.keys(this.tablePopulation[tableId]);
      const board            = this.tableGames[tableId].boardMap;

      const [playerOne, playerTwo] = players;

      client.sendXt('gz', -1, playerOne, playerTwo, board);
    }
  }

  handleJoinGame(data, client){
    if(client.tableId){
      const tableId  = client.tableId;
      const tableObj = this.tablePopulation[tableId];
      const seatId   = Object.keys(tableObj).length - 1;

      client.sendXt('jz', -1, seatId);

      if(seatId < 2){
        client.room.sendXt('uz', -1, seatId, client.nickname);

        if(seatId == 1){
          for(const player of this.tablePlayers[tableId]){
            player.sendXt('sz', -1, 0);
          }
        }
      }
    }
  }

  handleLeaveGame(data, client){
  }

  handleSendMove(data, client){
    if(client.tableId){
      const tableId   = client.tableId;
      const isPlaying = this.tablePlayers[tableId].indexOf(client) < 2;
      const isReady   = this.tablePlayers[tableId].length >= 2;

      if(isPlaying && isReady){
        const chipColumn = parseInt(data[3]);
        const chipRow    = parseInt(data[4]);

        const seatId = this.tablePlayers[tableId].indexOf(client);

        if(this.tableGames[tableId].currentPlayer == (seatId + 1)){
          const result = this.tableGames[tableId].placeChip(chipColumn, chipRow);

          const opponentSeat = (seatId == 0 ? 1 : 0);
          const opponent     = this.tablePlayers[tableId][opponentSeat];

          if(result === 1){
            client.addCoins(20);
            opponent.addCoins(10);
          }

          if(result === 2){
            client.addCoins(5);
            opponent.addCoins(5);
          }

          for(const player of this.tablePlayers[tableId]){
            player.sendXt('zm', -1, seatId, chipColumn, chipRow);

            if(result === 1 || result === 2){
              player.sendXt('zo', -1, player.coins);
            }
          }
        }
      }
    }
  }

  handleMovePuck(data, client){
    const player = data[3];
    this.puck = [data[4], data[5], data[6], data[7]];
    client.room.sendXt('zm', -1, player, this.puck.join('%'));
  }

  handleGameOver(data, client){
    let coins = parseInt(data[3]);
    if(!isNaN(coins)){
      coins = Math.round(coins / 4);
      if(coins > 300) coins = 300;
      client.addCoins(coins);
      client.sendXt('zo', -1, client.coins);
    }
  }
}