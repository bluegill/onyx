module.exports = (data, client, world) => {
  const id = data[3];
  if(world.isOnline(id) && client.isModerator){
    let player = world.getClientById(id);
    player.sendError(5);
    world.removeClient(player);
  }
}