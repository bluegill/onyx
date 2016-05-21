module.exports = (data, client, world) => {
  const target = parseInt(data[3]);
  if(client.buddies.length >= 100){
    return client.sendError(901);
  }
  if(world.isOnline(target) && target !== client.id){
    const targetObj = world.getClientById(target);
    if(targetObj.buddies.length >= 100) return;
    if(targetObj.requests.includes(client.id)) return;    
    targetObj.requests.push(client.id);
    targetObj.sendXt('br', -1, client.id, client.nickname);
  }
}