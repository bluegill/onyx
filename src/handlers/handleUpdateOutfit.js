module.exports = (data, client, world) => {
  const outfit = data[3];
  try {
    const json = JSON.parse(outfit);
    client.setCrumb('outfit', json);
    client.room.sendXt('upo', -1, client.id, JSON.stringify(client.getCrumb('outfit')));
  } catch(error){
    ///// handle error
  }
}