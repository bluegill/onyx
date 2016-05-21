module.exports = (data, client, world) => {
  const mood = data[3];
  client.setCrumb('mood', mood);
  client.room.sendXt('upm', -1, client.id, mood);
}