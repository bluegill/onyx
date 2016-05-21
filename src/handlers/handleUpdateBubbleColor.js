module.exports = (data, client, world) => {
  const bubbleColor = data[3];
  const bubbleText = data[4];

  if(/^0x[0-9A-F]{6}$/i.test(bubbleColor) !== false){
    client.setCrumb('bubbleColor', bubbleColor);
  } else {
    client.setCrumb('bubbleColor', '');
  }

  if(/^0x[0-9A-F]{6}$/i.test(bubbleText) !== false){
    client.setCrumb('bubbleText', bubbleText);
  } else {
    client.setCrumb('bubbleText', '');
  }

  client.room.sendXt('ubc', -1, client.id, client.getCrumb('bubbleColor'), client.getCrumb('bubbleText'));
}