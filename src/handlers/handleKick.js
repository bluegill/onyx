module.exports = (data, client, world) => {
  const id = parseInt(data[3]);
  
  if(world.isOnline(id) && client.isModerator){
    let player = world.getClientById(id);
    if(player.rank >= client.rank) return;
    player.sendError(5);
    world.removeClient(player);
  }
}