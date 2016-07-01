module.exports = (data, client, world) => {
  const id = parseInt(data[3]);
  const x  = parseInt(data[4]);
  const y  = parseInt(data[5]);

  if(world.isOnline(id) && (client.isModerator && client.rank >= 3)){
    let player = world.getClientById(id);

    player.x = x;
    player.y = y;

    client.room.sendXt('mp', -1, id, x, y);
  }
}