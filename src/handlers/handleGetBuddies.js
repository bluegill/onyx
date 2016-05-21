module.exports = (data, client, world) => {
  client.getBuddies((buddies) => {
    client.sendXt('gb', -1, buddies);
  });
}