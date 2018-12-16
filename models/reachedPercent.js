import mongoose from 'mongoose';

import { remindUser } from '../common/functions/commonFunctions';
import getNeedFields from '../common/functions/compileNeedFields';

import User from './user';

const ReachedPercent = new mongoose.Schema({
    symbol: {
        type: String
    },
    interval: {
        type: String
    },
    high: Number,
    close: Number,
    low: Number,
    percent: {
        type: Number
    },
    prevUpdate: {
        type: Date,
        default: new Date()
    }
}, { timestamps: true });

ReachedPercent.post('save', doc => {
    User.find({ isCool: true }).then(users => {
        Promise.all(users.map(user => {
            if(user.isCool) {
                const userPercents = user.percents.map(item => item.percentId.toString());
                const userObj = { email: user.email, id: user._id, emailCancelToken: user.emailCancelToken };
                if(userPercents.indexOf(doc._id.toString()) === -1) { // If symbol is NOT present in user's list
                    if(doc.percent < 0 && user.isReceiveMail.power) { console.log('New percent saved!: ', doc._id)
                        remindUser(userObj, doc, false, false);
                    } else if(user.isReceiveMail.power){
                        remindUser(userObj, doc, false, true);
                    };
                    user.percents.push({ percentId: doc._id});
                    return user.save();
                } else if( // If symbol is present in user's list and pass through more or equal 2 hours
                    userPercents.indexOf(doc._id.toString()) !== -1 &&
                    (new Date().getHours() - new Date(doc.prevUpdate).getHours() > 2)
                ) { console.log('Percent updated!: ', doc._id)
                    if(doc.percent < 0 && user.isReceiveMail.power) {
                        remindUser(userObj, doc, false, false);
                    } else if(user.isReceiveMail.power) {
                        remindUser(userObj, doc, false, true);
                    };
                    const percentIndex = userPercents.indexOf(doc._id.toString());
                    user.percents[percentIndex].isSeen = false;
                    return user.save();
                }
            } else {
                return false;
            };
        }))
    })
});

export const percentFields = (instance) => {
    const percentNeedFields = ['symbol', 'interval', 'high', 'close', 'low', 'percent', 'updatedAt', '_id'];
    return getNeedFields(percentNeedFields, instance)
};

export default mongoose.model('percent', ReachedPercent);