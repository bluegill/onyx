module.exports = (data, client, world) => {
  const target = parseInt(data[3]);
  client.removeBuddy(target);
  world.database.knex('users').select('nickname', 'buddies').where('id', target).then((player) => {
    let buddies = player[0].buddies;
        buddies = JSON.parse(buddies);
    if(!buddies) buddies = [];
    if(buddies.includes(client.id)){
      const index = buddies.indexOf(client.id);
      buddies.splice(index, 1);
      world.database.updateColumn(target, 'buddies', JSON.stringify(buddies));
      if(world.isOnline(target)){
        const targetObj = world.getClientById(target);
        targetObj.sendXt('rb', -1, client.id, client.nickname);
        targetObj.buddies = buddies;
      }
      client.sendXt('rb', -1, target, player.nickname);
    }
  });
}