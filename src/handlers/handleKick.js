module.exports = (data, client, world) => {
  const id = data[3];
  if(world.isOnline(id) && client.isModerator){
    let player = world.getClientById(id);
    if(player.rank >= client.rank){
      client.sendError(5);
      return world.removeClient(client);
    }
    player.sendError(5);
    world.removeClient(player);
  }
}