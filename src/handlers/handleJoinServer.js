import utils from '../utils';

module.exports = (data, client, world) => {
  const timestamp = utils.getTimestamp();
  client.sendXt('js', -1, 0, 1, client.isModerator ? 1 : 0);
  client.sendXt('gps', -1, '');
  client.sendXt('lp', -1, client.buildString(), client.coins, 0, 1440, timestamp, client.age, 1000, 233, '', 7);
  if(client.settings){
    const json = JSON.stringify(client.settings);
    client.sendXt('ge', -1, json);
  }
  world.do('handleGetBuddies', data, client);
  world.do('handleGetIgnored', data, client);
  world.do('handleJoinRoom', {2: 'j#jr', 3: client.defaultRoom}, client);
}