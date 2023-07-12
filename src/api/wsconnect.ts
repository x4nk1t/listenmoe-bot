import Client from "../Client";
import WebSocket from 'ws';

import { ListenMoe } from "../../index";

class WSConnect {
    client: Client;
    gateaway: string;
    heartbeatInterval: NodeJS.Timer | undefined;
    currentPlaying: ListenMoe.SongResponse;

    constructor(client: Client, gateaway: string) {
        this.client = client;
        this.gateaway = gateaway;

        this.currentPlaying = {} as ListenMoe.SongResponse;

        this.heartbeatInterval = undefined;

        this.events();
    }

    events() {
        this.client.on('ready', () => this.run());
    }

    run() {
        let ws: WebSocket | undefined = new WebSocket('wss://listen.moe/' + this.gateaway);

        ws.onopen = () => {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = undefined;
        }

        ws.onmessage = message => {
            let response: ListenMoe.ListenMoeResponse;

            try {
                response = JSON.parse(message.data as string);
            } catch (err) {
                return;
            }

            switch (response.op) {
                case 0:
                    ws!.send(JSON.stringify({op: 9}));
                    this.heartbeat(ws!, response.d.heartbeat);
                    break;

                case 1:
                    if (response.t != 'TRACK_UPDATE' && response.t != 'TRACK_UPDATE_REQUEST') return;

                    this.currentPlaying = response.d;

                    if (this.gateaway == 'gateway_v2') {
                        const artists = response.d.song.artists.map(artist => artist.nameRomaji ? artist.nameRomaji : artist.name).join(',');
                        this.client.editStatus({name: response.d.song.title + ' by ' + artists});
                    }
                    break;
            }
        }

        ws.onerror = error => {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = undefined;
            if (ws) {
                ws.close();
                ws = undefined;
            }

            setTimeout(() => this.run(), 5000);
        }
    }

    heartbeat(ws: WebSocket, interval: number) {
        this.heartbeatInterval = setInterval(() => {
            ws.send(JSON.stringify({op: 9}));
        }, interval);
    }
}

export default WSConnect;