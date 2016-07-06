module.exports = (data, client, world) => {
  const frame = parseInt(data[3]);
  if(frame == 5012) return;
  client.frame = frame;
  client.room.sendXt('sf', -1, client.id, frame);
}