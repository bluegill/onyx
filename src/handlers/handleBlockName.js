module.exports = (data, client, world) => {
  const id     = parseInt(data[3]);

  if(isNaN(id) || !client.isModerator) return;

  const player = world.getClientById(id);

  if(player){
    const nickname = 'p' + player.id;
    player.nickname = nickname;
    player.updateColumn('nickname', nickname);
    player.sendXt('bn', -1, player.id);
  }
}