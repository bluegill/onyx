module.exports = (data, client, world) => {
  const id = parseInt(data[3]);

  world.database.getPlayerById(id).then((player) => {
    if(player.roomFurniture == null) player.roomFurniture = '';

    // so fucking ugly
    let iglooStr = `${id}%${player.igloo}%${player.music}%${player.floor}%${player.roomFurniture}`;

    client.sendXt('gm', -1, iglooStr);
  })
}