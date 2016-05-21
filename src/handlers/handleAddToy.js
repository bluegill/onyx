module.exports = (data, client, world) => {
  client.room.sendXt('at', -1, client.id);
}