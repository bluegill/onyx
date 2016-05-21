module.exports = (data, client, world) => {
  const puffle = world.getPuffle(data[3]);
  client.sendXt('pg', -1, puffle);
}