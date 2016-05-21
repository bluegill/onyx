module.exports = (data, client, world) => {
  let iglooStr = '';
  for(const id of Object.keys(world.roomManager.rooms)){
    const room = world.roomManager.rooms[id];
    if(id > 1000 && room.open){
      const player = world.getClientById((id - 1000));
      if(player){
        iglooStr += '%' + (player.id + '|' + player.nickname);
      }      
    }
  }
  if(iglooStr.length > 1){
    iglooStr = iglooStr.substr(1);
    client.sendXt('gr', -1, iglooStr);
  } else {
    client.sendXt('gr', -1);
  }
}