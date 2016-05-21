module.exports = (data, client, world) => {
  const inventory = client.getInventory();
  client.sendXt('gi', -1, inventory);
}