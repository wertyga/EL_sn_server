// Compile symbol name
export default symbol => {
    return symbol === 'BTCUSDT' ? 'BTC / USDT' : symbol.split('BTC').join(' / BTC')
};