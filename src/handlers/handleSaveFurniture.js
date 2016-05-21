module.exports = (data, client, world) => {
  let furnitureStr = '';
  for(const index of Object.keys(data)){
    const item = data[index];
    if(index > 2 && item !== ''){
      furnitureStr += (item + ',');
    }
  }
  client.updateColumn('roomFurniture', furnitureStr.slice(0, -1));
}