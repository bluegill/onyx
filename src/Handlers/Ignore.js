export let Ignore = {

  handleGetIgnored: function(data, client) {
    client.getIgnored((ignored) => {
      client.sendXt('gn', -1, ignored);
    });
  },

  handleAddIgnore: function(data, client) {
    const target = parseInt(data[3]);

    if(client.buddies.includes(target)) return;
    if(client.ignored.includes(target)) return;
    
    client.addIgnore(target);
    client.sendXt('gn', -1, target);
  },

  handleRemoveIgnore: function(data, client) {
    const target = parseInt(data[3]);

    if(client.ignored.includes(target)){
      client.removeIgnore(target);
      client.sendXt('rn', -1, target);
    }
  }

}