import { Client } from 'discord-rpc';
import get from 'axios';
let rpcClient = new Client({ transport: 'ipc' });
const clientId = '820262433611317259';
rpcClient.on('ready', () => {
	console.log("I'm ready!");
});
let id;
let starttime;
let endtime;
async function main() {
	let lastfm: any = await get(
		'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=USER&api_key=API_KEY&format=json&limit=10'
	).catch(err => {
		console.error('There was an error!');
		console.error(err);
		return;
	});

	lastfm = lastfm?.data.recenttracks.track[0];
	if (lastfm['@attr']?.nowplaying === 'true') {
		if (!id || id !== lastfm.name + lastfm.artist['#text']) {
			starttime = Math.floor((+new Date() - 1000) / 1000);
		}
		id = lastfm.name + lastfm.artist['#text'];

		rpcClient.setActivity({
			details: lastfm.name,
			state: lastfm.artist['#text'],
			largeImageKey: 'lastfm',
			largeImageText: lastfm.album['#text'] || 'Brak',
			startTimestamp: starttime
		});
	} else {
		rpcClient.clearActivity();
	}
}
setInterval(main, 2000);
rpcClient.login({ clientId });
