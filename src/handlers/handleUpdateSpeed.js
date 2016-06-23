module.exports = (data, client, world) => {
  let speed = !isNaN(data[3]) ? parseInt(data[3]) : 0;

  if(speed > 120) speed = 120;
  if(speed < 0)   speed = 0;

  client.setCrumb('speed', speed);
  client.room.sendXt('ups', -1, client.id, speed);
}