import mongoose from 'mongoose';

const whaleSchema = new mongoose.Schema({
    symbol: {
        type: String
    },
    orders: {
        type: [{
            price: Number,
            amount: Number,
            totalBtc: Number
        }],
        default: []
    },
    type: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model('whale', whaleSchema);