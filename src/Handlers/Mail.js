export let Mail = {

  // TODO
  
  handleStartMail: function(data, client) {
    client.sendXt('mst', -1, 0, 0);
  },

  handleGetMail: function(data, client) {
    client.sendXt('mg', -1, '');
  }

}