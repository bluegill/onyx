export let Toy = {

  handleAddToy: function(data, client) {
    client.room.sendXt('at', -1, client.id);
  },

  handleRemoveToy: function(data, client) {
    client.room.sendXt('rt', -1, client.id);
  }

}