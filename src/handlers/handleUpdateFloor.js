module.exports = (data, client, world) => {
  let floor = data[3];
  if(!isNaN(floor) && world.floorCrumbs[floor]){
    floor = parseInt(floor);
    client.updateFloor(floor);
  }
}