module.exports = (data, client, world) => {
  const furniture = parseInt(data[3]);
  if(world.furnitureCrumbs[furniture]){
    const itemCost = world.furnitureCrumbs[furniture].cost;
    if(client.coins < itemCost){
      return client.sendError(401);
    }
    //client.removeCoins(itemCost);
    client.addFurniture(furniture);
  } else {
    client.sendError(410);
  }
}