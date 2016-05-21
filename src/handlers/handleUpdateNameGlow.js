module.exports = (data, client, world) => {
  const nameColor = data[3];
  const nameGlow = data[4];

  if(/^0x[0-9A-F]{6}$/i.test(nameColor) !== false){
    client.setCrumb('nameColor', nameColor);
  } else {
    client.setCrumb('nameColor', '');
  }

  if(/^0x[0-9A-F]{6}$/i.test(nameGlow) !== false){
    client.setCrumb('nameGlow', nameGlow);
  } else {
    client.setCrumb('nameGlow', '');
  }

  client.room.sendXt('ung', -1, client.id, client.getCrumb('nameColor'), client.getCrumb('nameGlow'));
}