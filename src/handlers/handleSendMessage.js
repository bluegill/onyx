module.exports = (data, client, world) => {
  if(!client.isMuted){
    var message = data[4];
    if(message.includes('<') || message.includes('>')){
      message = message.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>?/gi, '').trim();
    }
    client.room.sendXt('sm', -1, client.id, message);
  }
}