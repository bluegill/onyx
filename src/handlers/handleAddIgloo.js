module.exports = (data, client, world) => {
  let type = parseInt(data[3]);
  if(!isNaN(type) && world.iglooCrumbs[type]){
    client.addIgloo(type);
  }
}