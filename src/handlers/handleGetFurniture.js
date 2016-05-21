module.exports = (data, client, world) => {
  client.sendXt('gf', -1, client.getFurniture());
}