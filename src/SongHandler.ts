import EventEmitter from 'events';
import get from 'axios';
const { url } = require('../config.json');
export default class SongHandler extends EventEmitter {
  lastSong: string;
  song: string;
  user: string;
  key: string;
  constructor(user: string, key: string) {
    super({});

    this.lastSong = 'started!';
    this.user = user;
    this.key = key;
    this.song = 'none';

    setInterval(async () => {
      let lastfm: any = await get(
        `${url}?method=user.getrecenttracks&user=${user}&api_key=${key}&format=json&limit=10`,
      ).catch((e) => {
        console.error('There was an error!');
        console.error(e);
      });

      this.song = `${this.parseTrack(lastfm).artist['#text']} - ${
        this.parseTrack(lastfm).name
      }`;

      if (this.song === this.lastSong) return;

      this.emit('songChange', lastfm);

      this.lastSong = `${this.parseTrack(lastfm).artist['#text']} - ${
        this.parseTrack(lastfm).name
      }`;
    }, 3000);
  }
  async getSongInfo(author: string, song: string) {
    const data = await get(
      `${url}?method=track.getInfo&api_key=${
        this.key
      }&artist=${encodeURIComponent(author)}&track=${encodeURIComponent(
        song,
      )}&format=json`,
    );
    return data.data.track;
  }

  parseTrack(song: any) {
    return song?.data.recenttracks.track[0];
  }
}
