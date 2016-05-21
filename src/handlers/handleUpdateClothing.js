module.exports = (data, client, world) => {
  const type  = data[1].substr(2), item = data[3];
  const types = {
    'upc': 'color',
    'uph': 'head',
    'upf': 'face',
    'upn': 'neck',
    'upb': 'body',
    'upa': 'hand',
    'upe': 'feet',
    'upl': 'pin',
    'upp': 'photo'
  }
  
  if(types[type]){
    client.room.sendXt(type, -1, client.id, item);
    client.updateOutfit(types[type], item);
  }
}