export let Puffle = {

  // TODO
  
  handleGetPuffle: function(data, client) {
    client.sendXt('pg', -1, data[3]);
  },

  handleGetPuffleUser: function(data, client) {

  }

}