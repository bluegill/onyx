import striptags from 'striptags';

module.exports = (data, client, world) => {
  const id     = data[3];
  const player = data[4];

  let message  = data[5];

  //if(!client.buddies.includes(player) && !client.isModerator){
  //  return client.sendXt('spm', -1, player, '', 'This player is only accepting messages from their buddies.');
  //}

  if(!isNaN(id) && !isNaN(player)){
    if(parseInt(id) !== client.id) return;

    if(message.length < 4) return;
    if(message.length > 300) return;

    let playerObj = world.getClientById(player);

    if(playerObj){
      if(playerObj.ignored.includes(client.id)){
        return client.sendXt('spm', -1, player, '', 'Message failed to send');
      }
      playerObj.sendXt('spm', -1, client.id, client.nickname, striptags(message));
    } else {
      client.sendXt('spm', -1, player, '', 'error:offline');
    }
  }
}