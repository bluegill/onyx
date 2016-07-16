
export let Games = {

  handleGetTable: function(data, client) {
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
  },

  handleJoinTable: function(data, client) {
    const tableId  = parseInt(data[3]);
    const tableObj = this.tablePopulation[tableId];

    let seatId     = Object.keys(tableObj).length;

    if(!this.tableGames[tableId])
      this.tableGames[tableId] = new (require('../Games/FindFour'))(this);

    seatId += 1;

    this.tablePopulation[tableId][client.nickname] = client;
    this.tablePlayers[tableId].push(client);

    client.sendXt('jt', -1, tableId, seatId);

    client.room.sendXt('ut', -1, tableId, seatId);

    client.tableId = tableId;
  },

  handleLeaveTable: function(data, client) {
    this.leaveTable(client);
  },

  handleGetGame: function(data, client) {
    if(client.room.id == 802){      
      client.room.sendXt('gz', -1, this.puck.join('%'));
    } else if(client.tableId){
      const tableId          = client.tableId;
      const players          = Object.keys(this.tablePopulation[tableId]);
      const board            = this.tableGames[tableId].toString();

      const [playerOne, playerTwo] = players;

      client.sendXt('gz', -1, playerOne, playerTwo, board);
    }
  },

  handleJoinGame: function(data, client) {
    if(client.tableId){
      const tableId  = client.tableId;
      const tableObj = this.tablePopulation[tableId];
      const seatId   = Object.keys(tableObj).length - 1;

      client.sendXt('jz', -1, seatId);

      for(const player of this.tablePlayers[tableId]){
        player.sendXt('uz', -1, seatId, client.nickname);

        if(seatId === 1){
          player.sendXt('sz', -1, 0);
        }
      }
    }
  },

  handleSendMove: function(data, client) {
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
  },

  handleMovePuck: function(data, client) {
    const player = data[3];

    this.puck = [data[4], data[5], data[6], data[7]];
    client.room.sendXt('zm', -1, player, this.puck.join('%'));
  },

  handleGameOver: function(data, client) {
    let coins = parseInt(data[3]);

    if(!isNaN(coins)){
      coins = Math.round(coins / 4);

      if(coins > 300) coins = 300;

      client.addCoins(coins);
      client.sendXt('zo', -1, client.coins);
    }
  }

}