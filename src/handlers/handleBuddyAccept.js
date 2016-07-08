module.exports = (data, client, world) => {
  const target = parseInt(data[3]);

  if(client.buddies.length >= 100) return client.sendError(901);

  if(client.buddies.includes(target)) return;
  if(!client.requests.includes(target)) return;

  world.database.getPlayerById(target).then((player) => {
    let buddies = player.buddies;
        buddies = JSON.parse(buddies);

    if(!buddies) buddies = [];

    if(!buddies.includes(client.id)){
      client.addBuddy(target);
      buddies.push(client.id);
      
      world.database.updateColumn(target, 'buddies', JSON.stringify(buddies));

      if(world.isOnline(target)){
        const targetObj = world.getClientById(target);
        targetObj.sendXt('ba', -1, client.id, client.nickname);
      }

      client.sendXt('ba', -1, target, player.nickname);
    }
  });

  const index = client.requests.indexOf(target);
  client.requests.splice(index, 1);
}