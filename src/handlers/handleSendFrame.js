module.exports = (data, client, world) => {
  client.frame = data[3];
  client.room.sendXt('sf', -1, client.id, data[3]);
}