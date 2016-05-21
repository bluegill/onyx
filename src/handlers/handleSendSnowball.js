module.exports = (data, client, world) => {
  client.room.sendXt('sb', -1, client.id, data[3], data[4]);
}