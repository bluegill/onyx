module.exports = (data, client, world) => {
  const roomManager = world.roomManager;
  const room        = data[3];

  let x = data[4],
      y = data[5];

  if(!x || isNaN(x)) x = 0;
  if(!y || isNaN(y)) y = 0;

  if(client.room){
    client.room.removeClient(client);
  }

  if(room > 900){
    return client.sendXt('jg', -1, room);
  }

  const roomObject = roomManager.getRoom(room);
  
  if(roomObject){
    roomObject.addClient(client, [x, y]);
  } else {
    client.sendError(210);
  }
}