import libxmljs from 'libxmljs';
import crypto   from '../crypto';

module.exports = (data, client, server) => {
  const xml = libxmljs.parseXml(data);

  let nick  = (xml.get('//nick')).text();
  let pass  = (xml.get('//pword')).text();

  server.database.getPlayerByName(nick, (player, error) => {
    if(!error){
      if(server.type == 'login'){
        const hash = crypto.encryptPassword(player.password.toUpperCase(), client.randomKey);

        if(hash == pass){
          const loginKey   = crypto.md5(crypto.generateKey() + 'sosa');
          const serverList = server.getList();

          server.database.updateColumn(player.id, 'loginKey', loginKey);

          client.sendXt('sd', -1, serverList);
          client.sendXt('l', -1, player.id, loginKey, '', '100,5');
        } else {
          client.sendError(101);
          server.removeClient(client);
        }
      } else {
        const hash = pass.substr(pass.length - 32);

        if(hash.length == 32){
          const playerObj = server.getClientById(player.id);
          if(playerObj) server.removeClient(playerObj);
          if(hash == player.loginKey){
            client.sendXt('l', -1);
            client.setClient(player);
          } else {
            client.sendError(101);
            server.removeClient(client);
          }
          server.database.updateColumn(player.id, 'loginKey', '');
        }
      }
    } else {
      client.sendError(100);
      server.removeClient(client);
    }
  });
}