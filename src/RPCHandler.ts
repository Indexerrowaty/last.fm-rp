import { Client } from 'discord-rpc';
import { waitUntilUsed } from 'tcp-port-used';
export default class RPCHandler {
  rpc: any;
  static rpc: any;
  ready: boolean;
  constructor() {
    // @ts-ignore
    this.ready = false;
    waitUntilUsed(6463, 5000, 100000000).then(() => {
      console.log(1);
      this.rpc = new Client({ transport: 'ipc' });
      this.rpc.login({ clientId: '820262433611317259' });
      this.rpc.on('ready', () => {
        this.ready = true;
      });
    });
  }
  parseToRP(data: any) {
    // @ts-ignore
    const object = {
      details: data.name,
      state: data.artist.name,
      largeImageKey: 'lastfm',
      largeImageText: data.album?.name || 'None',
      startTimestamp: Date.now(),
    };

    if (data.duration === '0') {
      return object;
    } else {
      // @ts-ignore
      object.endTimestamp = Date.now() + parseInt(data.duration);
    }
    return object;
  }
  setRP(data: {
    details: any;
    state: any;
    largeImageKey: string;
    largeImageText: any;
    startTimestamp: number;
    endTimestamp?: any;
  }) {
    this.rpc.setActivity(data);
  }
}
