export let Communication = {

  handleSendMessage: function(data, client) {
    const message = data[4];

    if(!client.isMuted && message.length > 0)
      client.room.sendXt('sm', -1, client.id, message);
  },

  // CUSTOM HANDLERS

  handleSendPrivateMessage: function(data, client) {
    const id     = parseInt(data[3]);
    const player = parseInt(data[4]);

    let message  = data[5];

    //if(!client.buddies.includes(player) && !client.isModerator){
    //  return client.sendXt('spm', -1, player, '', 'This player is only accepting messages from their buddies.');
    //}

    if(!isNaN(id) && !isNaN(player)){
      if(id !== client.id)     return;

      if(message.length < 1)   return;
      if(message.length > 300) return;

      let playerObj = this.getClientById(player);

      if(playerObj){
        if(playerObj.ignored.includes(client.id))
          return client.sendXt('spm', -1, player, '', 'Message failed to send');

        // HTML sanitization done on client side
        
        this.database.addLog(id, player, message);
        
        playerObj.sendXt('spm', -1, client.id, client.nickname, message);
      } else {
        client.sendXt('spm', -1);
      }
    }
  }

}