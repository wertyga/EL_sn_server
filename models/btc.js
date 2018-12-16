import mongoose from 'mongoose';

const BtcSchema = new mongoose.Schema({
   currentPrice: {
       type: Number
   },
   prevPrice: {
       type: Number
   },
   prevPriceDate: {
       type: Date
   }
});

BtcSchema.post('save', function(doc) {
    const now = new Date();
    const prevDate = doc.prevPriceDate;
    if((now.getHours() - prevDate.getHours()) >= 2) {
        doc.prevPrice = doc.currentPrice;
        doc.prevPriceDate = now;
        return doc.save();
    };
});