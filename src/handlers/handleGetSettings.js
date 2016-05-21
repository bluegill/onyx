module.exports = (data, client, world) => {
  if(client.settings){
    const json = JSON.stringify(client.settings);
    client.sendXt('ge', -1, json);
  }
}