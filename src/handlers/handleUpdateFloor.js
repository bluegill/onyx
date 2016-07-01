module.exports = (data, client, world) => {
  let floor = parseInt(data[3]);
  if(!isNaN(floor) && world.floorCrumbs[floor]){
    client.updateFloor(floor);
  }
}