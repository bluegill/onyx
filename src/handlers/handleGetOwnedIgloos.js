module.exports = (data, client, world) => {
  client.sendXt('go', -1, client.getIgloos());
}