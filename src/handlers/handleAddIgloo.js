module.exports = (data, client, world) => {
  let type = data[3];
  if(!isNaN(type)){
    type = parseInt(type);
    client.addIgloo(type);
  }  
}