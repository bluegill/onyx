module.exports = (data, client, world) => {
  const emote = parseInt(data[3]);
  if(emote == 19) return; // block annoying shitting noise
  client.room.sendXt('se', -1, client.id, data[3]);
}