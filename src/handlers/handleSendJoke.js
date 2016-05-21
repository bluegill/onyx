module.exports = (data, client, world) => {
  client.room.sendXt('sj', -1, client.id, data[3]);
}