module.exports = (data, client, world) => {
  let type = data[3];
  if(!isNaN(type) && world.iglooCrumbs[type]){
    type = parseInt(type);
    client.addIgloo(type);
  }
}