module.exports = (data, client, world) => {
  const id     = data[3];
  const player = world.database.getPlayerById(id, (player, error) => {
    if(!error){
      const info = [
        id, player.username, 1, player.color,
        player.head, player.face,
        player.neck, player.body,
        player.hand, player.feet,
        player.pin, player.photo
      ];
      client.sendXt('gp', -1, info.join('|') + '|');
    } else {
      console.error(error);
    }
  });
}