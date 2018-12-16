import WebSocket from 'ws';

export default class WebSocketClient {
    constructor(reconnectTime) {
        this.reconnectTime = reconnectTime;
    };

    open(url) {
        this.url = url;
        this._instance = new WebSocket(url);

        this._instance.on('open', () => this.onopen);
        this._instance.on('message', (data) => this.onmessage(data));
        this._instance.on('close', (e) => {
            switch(e.code) {
                case 1000: // Normal close
                    console.log('Close socket: normal');
                    break;

                default:
                    this.reconnect(e);
                    break;
            };
        });
        this._instance.on('error', (e) => {
            switch(e.code) {
                case 'ECONNREFUSED':
                    this.reconnect(e);
                    break;
                case 'ETIMEDOUT':
                    this.reconnect(e);
                    break;
                default:
                    this.onerror(e);
                    break;
            };
        });
    };

    send(data, options) {
        try {
            this._instance.send(data, options);
        } catch(e) {
            this._instance.emit('error', e);
        };
    };

    onopen() {
        console.log('Open socket!')
    };

    onmessage(data) {
        return data;
    };

    reconnect(e) {
        console.log(`Reconnect in ${this.reconnectTime} ms`);
        this._instance.removeAllListeners();
        const self = this;
        setTimeout(() => {
            console.log('Socket reconnecting...');
            return self.open(self.url);

        }, this.reconnectTime)
    };
};