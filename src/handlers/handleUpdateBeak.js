module.exports = (data, client, world) => {
  const beak = parseInt(data[3]);

  if(!isNaN(beak)){
    client.setCrumb('beak', beak);
    client.room.sendXt('upk', -1, client.id, client.getCrumb('beak'));
  }
}