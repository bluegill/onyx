module.exports = (data, client, world) => {
  const igloo = parseInt(data[3]);
  if(!isNaN(igloo)){
    client.updateIgloo(igloo);
  }
}