module.exports = (data, client, world) => {
  client.sendXt('pg', -1, data[3]);
}