module.exports = (data, client, world) => {
  const igloo = data[3];
  if(!isNaN(igloo)){
    client.updateIgloo(igloo);
  }
}