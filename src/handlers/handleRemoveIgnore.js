module.exports = (data, client, world) => {
  const target = parseInt(data[3]);
  if(client.ignored.includes(target)){
    client.removeIgnore(target);
    client.sendXt('rn', -1, target);
  }  
}