import SongHandler from './SongHandler';
import RPCHandler from './RPCHandler';
const config = require('../config.json');
const RPHandler = new RPCHandler();
console.log(config);
const TrackHandler = new SongHandler(config.user, config.apikey);
TrackHandler.on('songChange', async function (song) {
  if (!RPHandler.ready) return;
  song = TrackHandler.parseTrack(song);
  let info = await TrackHandler.getSongInfo(song.artist['#text'], song.name);
  console.log(info);
  const rp = RPHandler.parseToRP(info);
  RPHandler.setRP(rp);
});
