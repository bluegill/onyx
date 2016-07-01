module.exports = (data, client, world) => {
  const id       = parseInt(data[3]);
  const nickname = data[4];

  if(id !== client.id) return;

  const player = world.getClientByName(nickname);

  if(player){
    return client.sendXt('id', -1, player.id, player.nickname);
  }

  client.sendXt('id', -1);
}