module.exports = (data, client, world) => {
  let music = data[3];
  if(!isNaN(music)){
    music = parseInt(music);
    client.updateMusic(music);
  }  
}