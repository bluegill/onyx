import Promise    from 'bluebird';

import utils      from './Utils';
import database   from './Database';
import clientBase from './ClientBase';

export default class extends clientBase {
  constructor(socket, server){
    super(socket, server);
  }

  setClient(player){
    const time       = (utils.getTime() - player.registeredTime);

    this.id          = player.id;
    this.username    = player.username;
    this.nickname    = player.nickname;
    this.age         = Math.round(time / 86400);
    this.coins       = player.coins;
    this.color       = player.color;
    this.head        = player.head;
    this.face        = player.face;
    this.neck        = player.neck;
    this.body        = player.body;
    this.hand        = player.hand;
    this.feet        = player.feet;
    this.pin         = player.pin;
    this.photo       = player.photo;
    this.rank        = player.rank;

    this.igloo       = player.igloo;
    this.floor       = player.floor;
    this.music       = player.music;

    this.crumbs      = (player.crumbs ? JSON.parse(player.crumbs) : {});
    this.settings    = (player.settings ? JSON.parse(player.settings) : {});
    this.igloos      = (player.igloos ? JSON.parse(player.igloos) : []);
    this.furniture   = (player.furniture ? JSON.parse(player.furniture) : {});
    this.inventory   = (player.inventory ? JSON.parse(player.inventory) : []);
    this.buddies     = (player.buddies ? JSON.parse(player.buddies) : []);
    this.ignored     = (player.ignored ? JSON.parse(player.ignored) : []);

    this.isModerator = (player.rank > 1);
    this.isMuted     = false;

    this.x           = 0;
    this.y           = 0;
    this.frame       = 1;

    this.requests    = [];
    
    this.defaultRoom = (!isNaN(this.settings['defaultRoom']) ? this.settings['defaultRoom'] : 100);

    this.updateColumn('lastLogin', utils.getTime());
    this.updateColumn('lastIP', this.address);
  }

  setCrumb(key, value){
    this.crumbs[key] = value;
    const json = JSON.stringify(this.crumbs);
    return this.updateColumn('crumbs', json);
  }

  getCrumb(key){
    return this.crumbs[key];
  }

  addBuddy(id){
    if(!this.buddies.includes(id) && !isNaN(id)){
      this.buddies.push(id);
      this.updateColumn('buddies', JSON.stringify(this.buddies));
    }
  }

  removeBuddy(id){
    if(this.buddies.includes(id)){
      const index = this.buddies.indexOf(id);
      this.buddies.splice(index, 1);
      this.updateColumn('buddies', JSON.stringify(this.buddies));
    }
  }

  addIgnore(id){
    if(!this.ignored.includes(id) && !isNaN(id)){
      this.ignored.push(id);
      this.updateColumn('ignored', JSON.stringify(this.ignored));
    }
  }

  removeIgnore(id){
    if(this.ignored.includes(id)){
      const index = this.ignored.indexOf(id);
      this.ignored.splice(index, 1);
      this.updateColumn('ignored', JSON.stringify(this.ignored));
    }
  }

  getFurniture(){
    let furnitureStr = '';
    if(this.furniture.length == 0) return;
    for(const id of Object.keys(this.furniture)){
      let amount = this.furniture[id];
      furnitureStr += '%' + (id + '|' + amount);
    }
    return furnitureStr.substr(1);
  }

  getIgloos(){
    if(this.igloos.length > 0)
      return this.igloos.join('|');

    return 1;
  }

  getBuddies(callback){
    let buddyStr = '';

    this.knex('users').select('id', 'nickname').whereIn('id', this.buddies).then((users) => {
      Promise.each(users, (player) => {
        buddyStr += (player.id + '|' + player.nickname + '|');

        if(this.server.isOnline(player.id)){
          const client = this.server.getClientById(player.id);
          client.sendXt('bon', -1, this.id);

          buddyStr += '1%';
        } else {
          buddyStr += '0%';
        }
      }).then(() => {
        callback(buddyStr.slice(0, -1));
      });
    });
  }

  getIgnored(callback){
    let ignoreStr = '';

    this.knex('users').select('id', 'nickname').whereIn('id', this.ignored).then((users) => {
      Promise.each(users, (player) => {
        ignoreStr += (player.id + '|' + player.nickname) + '%';
      }).then(() => {
        callback(ignoreStr.slice(0, -1));
      });
    });
  }

  updateSettings(settings){
    this.settings = settings;
    const json = JSON.stringify(settings);
    return this.updateColumn('settings', json);
  }

  buildString(){
    const crumbs = JSON.stringify(this.crumbs);
    const string = [
      this.id,
      this.nickname,
      1,
      this.color,
      this.head,
      this.face,
      this.neck,
      this.body,
      this.hand,
      this.feet,
      this.pin,
      this.photo,
      this.x,
      this.y,
      this.frame,
      1,
      this.rank,
      crumbs
    ];

    return string.join('|');
  }

  getInventory(){
    return this.inventory.join('%');
  }

  updateMusic(music){
    if(!isNaN(music)){
      this.music = music;
      this.updateColumn('music', music);
    }
  }

  updateFloor(floor){
    if(!isNaN(floor)){
      this.floor = floor;
      this.updateColumn('floor', floor);
      
      if(this.room.id == (this.id + 1000))
        this.sendXt('ag', -1, floor, this.coins);
    }
  }

  updateIgloo(igloo){
    if(!isNaN(igloo)){
      this.updateColumn('roomFurniture', '[]');
      this.updateColumn('igloo', igloo);
      this.updateColumn('floor', 0);
    }
  }

  addIgloo(igloo){
    // add coin handling at some point
    if(!isNaN(igloo)){
      if(!this.igloos[igloo]){
        this.igloos.push(igloo);
        this.updateColumn('igloos', JSON.stringify(this.igloos));
      }

      if(this.room.id == (this.id + 1000))
        this.sendXt('au', -1, igloo, this.coins);
    }
  }

  addItem(item){
    if(!this.inventory.includes(item)){
      this.inventory.push(item);
      this.updateColumn('inventory', JSON.stringify(this.inventory));
      this.sendXt('ai', -1, item, this.coins);
    } else {
      this.sendError(400);
    }
  }

  addFurniture(furniture){
    let amount = 1;

    if(this.furniture[furniture])
      amount = (parseInt(this.furniture[furniture]) + 1);

    this.furniture[furniture] = amount;
    this.updateColumn('furniture', JSON.stringify(this.furniture));
    this.sendXt('af', -1, furniture, this.coins);
  }

  addCoins(coins){
    this.coins += coins;
    this.updateColumn('coins', this.coins);
  }

  removeCoins(coins){
    this.coins -= coins;
    this.updateColumn('coins', this.coins);
  }

  updateOutfit(type, item){
    this[type] = item;
    this.updateColumn(type, item);
  }

  updateColumn(column, value){
    this.database.updateColumn(this.id, column, value).catch((error) => {
      // why would this fail?
      logger.error(error);
    });
  }

  sendError(error, disconnect){
    this.sendXt('e', -1, error);
    if(disconnect) this.disconnect();
  }

  sendXt(){
    const args = Array.prototype.join.call(arguments, '%');
    this.send('%xt%' + args + '%');
  }

  disconnect(){
    this.server.removeClient(this);
  }
}