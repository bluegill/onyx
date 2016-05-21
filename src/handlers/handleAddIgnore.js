module.exports = (data, client, world) => {
  const target = parseInt(data[3]);
  if(client.buddies.includes(target)) return;
  if(client.ignored.includes(target)) return;
  client.addIgnore(target);
  client.sendXt('gn', -1, target);
}