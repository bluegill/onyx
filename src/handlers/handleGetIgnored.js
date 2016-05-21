module.exports = (data, client, world) => {
  client.getIgnored((ignored) => {
    client.sendXt('gn', -1, ignored);
  });
}