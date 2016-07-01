module.exports = (data, client, world) => {
  let speed = parseInt(data[3]);

  if(speed > 120) speed = 120;
  if(speed < 0)   speed = 0;

  client.setCrumb('speed', speed);
  client.room.sendXt('ups', -1, client.id, speed);
}