module.exports = (data, client, world) => {
  const id = data[3];

  const x = data[4];
  const y = data[5];

  if(world.isOnline(id) && (client.isModerator && client.rank >= 3)){
    let player = world.getClientById(id);

    player.x = x;
    player.y = y;

    client.room.sendXt('mp', -1, id, x, y);
  }
}