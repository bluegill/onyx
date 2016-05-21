module.exports = (data, client, world) => {
  client.room.sendXt('ss', -1, client.id, data[3]);
}