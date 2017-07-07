'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {

  handleUpdateClothing: function handleUpdateClothing(data, client) {
    var type = data[1].substr(2);
    var item = parseInt(data[3]);

    var types = {
      'upc': 'color',
      'uph': 'head',
      'upf': 'face',
      'upn': 'neck',
      'upb': 'body',
      'upa': 'hand',
      'upe': 'feet',
      'upl': 'pin',
      'upp': 'photo'
    };

    if (item !== 0 && !client.inventory.includes(item)) return;

    if (types[type]) {
      client.room.sendXt(type, -1, client.id, item);
      client.updateOutfit(types[type], item);
    }
  }

};