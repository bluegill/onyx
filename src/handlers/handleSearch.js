module.exports = (data, client, world) => {
  if(client.isModerator){
    const player = world.getClientByName(data[3]);
    if(player){
      const playerObject = {
        'player_id': player.id,
        'nickname': player.username,
        'rank': player.rank,
        'location': player.room.id
      };
      client.sendXt('sr', -1, JSON.stringify(playerObject));
    } else {
      client.sendXt('sr', -1);
    }
  }
}