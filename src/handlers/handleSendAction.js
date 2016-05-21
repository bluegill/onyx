module.exports = (data, client, world) => {
  client.frame = 1;
  client.room.sendXt('sa', -1, client.id, data[3]);
}