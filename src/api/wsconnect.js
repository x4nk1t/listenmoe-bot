const WebSocket = require('ws');

class WSConnect {
    constructor(client, gateaway) {
        this.client = client;
        this.gateaway = gateaway;

        this.currentPlaying = [];

        this.heartbeatInterval = null;

        this.events();
    }

    events() {
        this.client.on('ready', () => this.run());
    }

    run() {
        const ws = new WebSocket('wss://listen.moe/' + this.gateaway);

        ws.onopen = () => {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }

        ws.onmessage = message => {
            if (!message.data.length) return;

            let response;
            try {
                response = JSON.parse(message.data);
            } catch (err) {
                return;
            }

            switch (response.op) {
                case 0:
                    ws.send(JSON.stringify({op: 9}));
                    this.heartbeat(ws, response.d.heartbeat);
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
            this.heartbeatInterval = null;
            if (ws) {
                ws.close();
                ws = null;
            }

            setTimeout(() => this.run(), 5000);
        }
    }

    heartbeat(ws, interval) {
        this.heartbeatInterval = setInterval(() => {
            ws.send(JSON.stringify({op: 9}));
        }, interval);
    }
}

module.exports = WSConnect;