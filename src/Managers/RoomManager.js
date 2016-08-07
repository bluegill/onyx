import logger from '../Logger';
import room   from '../Room';

import crumbs from '../../crumbs/rooms';

export default class {
  constructor(world){
    this.rooms  = [];
    this.world  = world;
    this.server = world.server;

    for(let id of Object.keys(crumbs)){
      if(id < 900)
        this.rooms[id] = new room(id, this);
    }
    
    logger.info(`Room manager initialized, loaded ${this.rooms.length} rooms`);
  }
  
  createRoom(id){
    if(!this.rooms[id])
      return this.rooms[id] = new room(id, this);
  }

  getRoom(id){
    if(this.rooms[id])
      return this.rooms[id];
  }

  checkIgloo(id){
    if(this.rooms[id]){
      if(this.rooms[id].open === true)
        return true;
    }
  }

  closeIgloo(id){
    if(this.rooms[id])
      return (this.rooms[id].open = false);
  }
}