module.exports = (data, client, world) => {
  const item = parseInt(data[3]);
  if(world.itemCrumbs[item]){
    const itemCost = world.itemCrumbs[item].cost;
    if(client.inventory.includes(item)){
      return client.sendError(400);
    }
    if(client.coins < itemCost){
      return client.sendError(401);
    }
    //client.removeCoins(itemCost);
    client.addItem(item);
  } else {
    client.sendError(402);
  }
}