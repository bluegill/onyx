module.exports = (data, client, world) => {
  const id = parseInt(data[3]);
  world.knex('users').select('igloo', 'music', 'floor', 'roomFurniture').where('id', id).then((player) => {
    player = player[0];
    if(player.roomFurniture == null) player.roomFurniture = '';
    let iglooStr = `${id}%${player.igloo}%${player.music}%${player.floor}%${player.roomFurniture}`;
    client.sendXt('gm', -1, iglooStr);
  });
}