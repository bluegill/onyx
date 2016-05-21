import logger from './logger';

export default class {
  constructor(world){
    this.world  = world;
    this.server = world.server;

    this.puck = [];

    this.handlers = {
      'zo': 'handleGameOver',
      'gz': 'handleGetGame',
      'm' : 'handleMovePuck'
    }

    logger.info('Game manager initialized');
  }

  handle(data, client){
    const handler = this.handlers[data[1]];
    if(this[handler]){
      this[handler](data, client);
    } else {
      logger.warn(`Missing game handler for ${data[1]}`);
    }
  }

  handleGetGame(data, client){
    if(client.room.id == 802){      
      client.room.sendXt('gz', -1, this.puck.join('%'));
    }
  }

  handleMovePuck(data, client){
    const player = data[3];
    this.puck = [data[4], data[5], data[6], data[7]];
    client.room.sendXt('zm', -1, player, this.puck.join('%'));
  }

  handleGameOver(data, client){
    let coins = parseInt(data[3]);
    coins = Math.round(coins / 4);
    if(coins < 1) coins = 50;
    if(coins > 1000) coins = 100;
    client.addCoins(coins);
    client.sendXt('zo', -1, client.coins);
  }
}