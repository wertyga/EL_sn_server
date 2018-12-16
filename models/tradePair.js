import mongoose from 'mongoose';

import fetchFields from '../common/functions/compileNeedFields';

const TradePairSchema = new mongoose.Schema({
    symbolData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'symbolData',
        default: null
    },
    symbol: {
        type: String,
        unique: true
    },
    baseAsset: {
        type: String,
        unique: true
    },
    quoteAsset: {
        type: String
    },
    price: {
        type: Number,
        default: 0
    },
    prevPrice: {
        type: Number,
        default: 0
    }
});

TradePairSchema.static('findWithSymbolPopulate', function(symbols) {
    let isArray = symbols instanceof Array;
    if(!isArray) symbols = [symbols];

    return Promise.all(symbols.map(item => {
        return this.findOne({ symbol: item })
            .populate('symbolData')
    }))
        .then(datas => {
            if(isArray) {
                return datas;
            } else {
                return datas[0];
            }
        })
});

export const tradePairFields = (instance) => {
    const tradePairNeedFields = ['price', 'prevPrice', 'symbol', 'baseAsset', 'quoteAsset'];
    return fetchFields(tradePairNeedFields, instance);
};

export default mongoose.model('actualPair', TradePairSchema);
