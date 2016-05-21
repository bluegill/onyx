module.exports = (data, client, world) => {
  const igloo = parseInt(data[3]);
  if(igloo == client.id){
    world.roomManager.rooms[igloo + 1000].open = true;
  }
}