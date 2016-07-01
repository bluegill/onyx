import striptags from 'striptags';

module.exports = (data, client, world) => {
  if(!client.isMuted){
    var message = striptags(data[4]);
    client.room.sendXt('sm', -1, client.id, message);
  }
}