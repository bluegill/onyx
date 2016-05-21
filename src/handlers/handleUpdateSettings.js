module.exports = (data, client, world) => {
  try {
    const json = JSON.parse(data[3]);
    if(!isNaN(json.dock) && !isNaN(json.log)){
      client.updateSettings(json);
    }
  } catch(error){
    console.error(error);
  }
}