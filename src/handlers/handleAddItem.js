module.exports = (data, client, world) => {
  const item = parseInt(data[3]);
  if(world.itemCrumbs[item]){
    const itemCost = world.itemCrumbs[item].cost;
    const patched  = world.itemCrumbs[item].patched;

    if(patched == 1 && client.rank < 1) return client.sendError(402);
    if(patched == 2 && client.rank < 2) return client.sendError(402);
    if(patched == 3 && client.rank < 4) return client.sendError(402);
    
    if(client.inventory.includes(item)){
      return client.sendError(400);
    }

    if(client.coins < itemCost){
      return client.sendError(401);
    }

    client.removeCoins(itemCost);
    client.addItem(item);
  } else {
    client.sendError(402);
  }
}