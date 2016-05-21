module.exports = (data, client, world) => {
  const hue = parseInt(data[3]);
  if(!isNaN(hue)){
    client.setCrumb('cardHue', hue);
    client.room.sendXt('upu', -1, client.id, hue);
  }
}