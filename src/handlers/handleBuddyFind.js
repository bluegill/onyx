module.exports = (data, client, world) => {
  const target = parseInt(data[3]);
  if(world.isOnline(target)){
    const targetObj = world.getClientById(target);
    client.sendXt('bf', -1, targetObj.room.id);
  }
}