module.exports = (data, client, world) => {
  const roomManager = world.roomManager;

  let room = data[3],
      x    = data[4],
      y    = data[5];

  if(!x || isNaN(x)) x = 0;
  if(!y || isNaN(y)) y = 0;

  if(client.room){
    client.room.removeClient(client);
  }

  if(room < 1000) room += 1000;

  if(roomManager.getRoom(room) == false){
    roomManager.createRoom(room);
  }

  const roomObject = roomManager.getRoom(room);

  if(roomObject){
    roomObject.addClient(client, [x, y]);
  } else {
    client.sendError(210);
  }
}