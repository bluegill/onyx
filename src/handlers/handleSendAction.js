module.exports = (data, client, world) => {
  const action  = parseInt(data[3]);
  const blocked = [5051, 10194, 328, 194, 3002, 5035];
  if(blocked.includes(client.hand)) return;
  client.frame = 1;
  client.room.sendXt('sa', -1, client.id, action);
}