module.exports = (data, client, world) => {
  client.room.sendXt('rt', -1, client.id);
}