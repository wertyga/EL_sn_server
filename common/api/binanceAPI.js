import axios from 'axios';
import WebSocket from '../WebSocket';

export default class BinanceApi {
    constructor() {
        this.baseUrl = 'https://api.binance.com';
    };

    exchangeInfo() { // Get full exchange info
        return axios({
            method: 'get',
            url: this.baseUrl + '/api/v1/exchangeInfo'
        })
            .then(res => {
                return res.data;
            })
            .catch(err => { throw Error(err.response ? err.response.data.msg : err.message) })
    };

    getServerTime() {
        return axios({
            method: 'get',
            url: this.baseUrl + '/api/v1/time'
        })
            .then(res => {
                return res.data.serverTime;
            })
            .catch(err => { throw Error(err.response ? err.response.data.msg : err.message) })
    };
    
    getTradePairs() { // Get all trade pairs
        const addedApiUrl = '/api/v1/exchangeInfo';
        const mainCoins = ['BTC', 'ETH', 'BNB'];

        return axios({
            method: 'get',
            url: this.baseUrl + addedApiUrl
        })
            .then(res => {
                return res.data.symbols
                    .map(item => item.symbol)
                    .filter(pair => pair.indexOf('BTC') !== -1);
            })
            .catch(err => { throw Error(err.response ? err.response.data.msg : err.message) })
    };

    getPriceForAllSymbols() {
        const addedUrl = '/api/v3/ticker/price';

        return axios({
            method: 'get',
            url: this.baseUrl + addedUrl
        })
            .then(res => {
                return res.data.filter(pair => pair.symbol.indexOf('BTC') !== -1);
            })
            .catch(err => { throw Error(err.response ? err.response.data.msg : err.message) })
    };

    getKlineData(symbol, interval = '2h', infelicity = 10800000) {
        return axios({
            method: 'get',
            params: {
                symbol,
                interval,
                limit: 1
            },
            url: this.baseUrl + '/api/v1/klines'
        })
            .then(res => {
                return {
                    pair: symbol,
                    data: res.data[0]
                }
            })
            .catch(err => { throw Error(err.response ? err.response.data.msg : err.message)})
    };

    getOrdersBook(symbol, limit = 100) {
        const addUrl = '/api/v1/depth';
        return axios({
            url: this.baseUrl + addUrl,
            method: 'get',
            params: {
                symbol,
                limit
            }
        })
            .then(res => res.data);
    };
};

export class BinanceSocketApi {
    constructor() {
        this._rootUrl = 'wss://stream.binance.com:9443/ws/';
        this._streams = {
            kline: (symbol, interval = '2h') => `${symbol.toLowerCase()}@kline_${interval}`,
        };
    };

    _createSocket(event) {
        const wsc = new WebSocket(1000);
        wsc.open(this._rootUrl + event);
        return wsc;
    };

    getKlineData(symbol, interval) {
        return this._createSocket(this._streams.kline(symbol, interval))
    };
};