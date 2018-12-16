export default pairs => { // Collect pairs into { title: String, name: String } type
    if(!(pairs instanceof Array)) pairs = [pairs];
    return pairs.map(pair => {
        return {
            title: pair.symbol,
            name: pair.symbol === 'BTCUSDT' ? 'BTC/USDT' : pair.symbol.split('BTC').join('/BTC')
        }
    });
};