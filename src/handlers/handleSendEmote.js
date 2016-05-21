module.exports = (data, client, world) => {
  client.room.sendXt('se', -1, client.id, data[3]);
}