module.exports = (data, client, world) => {
  const x  = data[3],
        y  = data[4];

  client.x = x;
  client.y = y;

  client.room.sendXt('sp', -1, client.id, x, y);
}