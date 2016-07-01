module.exports = (data, client, world) => {
  const id       = parseInt(data[3]);
  const reason   = data[4];
  const duration = 24;

  if(!isNaN(id) && client.isModerator){
    world.database.addBan(client.id, id, duration, reason);
    if(world.isOnline(id)){
      const player = world.getClientById(id);
      player.sendXt('b', -1);
      world.removeClient(player);
    }
  }
}