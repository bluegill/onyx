import utils from '../Utils';

export let Navigation = {

  handleJoinServer: function(data, client) {
    client.sendXt('js', -1, 0, 1, client.isModerator ? 1 : 0);
    client.sendXt('gps', -1, '');
    client.sendXt('lp', -1, client.buildString(), client.coins, 0, 1440, utils.getTime(), client.age, 1000, 233, '', 7);

    if(client.settings){
      const json = JSON.stringify(client.settings);
      client.sendXt('ge', -1, json);
    }

    this.handleGetBuddies(data, client);
    this.handleGetIgnored(data, client);

    this.handleJoinRoom({2: 'j#jr', 3: client.defaultRoom}, client);
  },

  handleJoinRoom: function(data, client) {
    const room = parseInt(data[3]);

    let x = parseInt(data[4]),
        y = parseInt(data[5]);

    if(!x || isNaN(x)) x = 0;
    if(!y || isNaN(y)) y = 0;

    if(client.room)
      client.room.removeClient(client);

    if(room > 900)
      return client.sendXt('jg', -1, room);

    const roomObject = this.roomManager.getRoom(room);
    
    if(roomObject){
      roomObject.addClient(client, [x, y]);
    } else {
      client.sendError(210);
    }
  },

  handleJoinPlayer: function(data, client) {
    let room = parseInt(data[3]),
        x    = parseInt(data[4]),
        y    = parseInt(data[5]);

    if(!x || isNaN(x)) x = 0;
    if(!y || isNaN(y)) y = 0;

    if(client.room)
      client.room.removeClient(client);

    if(room < 1000) room += 1000;

    if(!this.roomManager.getRoom(room))
      this.roomManager.createRoom(room);

    const roomObject = this.roomManager.getRoom(room);

    if(roomObject){
      roomObject.addClient(client, [x, y]);
    } else {
      client.sendError(210);
    }
  }

}