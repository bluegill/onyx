module.exports = (data, client, world) => {
  let music = parseInt(data[3]);
  
  if(!isNaN(music)){
    client.updateMusic(music);
  }  
}