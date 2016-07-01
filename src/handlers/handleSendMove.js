module.exports = (data, client, world) => {
  const x  = parseInt(data[3]),
        y  = parseInt(data[4]);

  if(!isNaN(x) && !isNaN(y)){
    client.x = x;
    client.y = y;

    client.room.sendXt('sp', -1, client.id, x, y);
  }
}