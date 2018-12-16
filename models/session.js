import mongoose from 'mongoose';
import shortid from 'shortid';
import crypto from 'crypto';

import User from './user';

const SessionSchema = new mongoose.Schema({
    token: {
        type: String
    },
    userID: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        index: '1d'
    }
});

SessionSchema.static('saveToken', function(userID) {
    if(typeof userID !== 'string') userID = userID.toString();
    const token = crypto.createHmac('sha256', shortid.generate()).update(userID).digest('hex');
    return this.findOne({ userID })
        .then(session => {
            if(session) {
                session.token = token;
                return session.save().then(session => session.token)
            } else {
                return Promise.all([
                    new this({ token, userID }).save(),
                    User.findByIdAndUpdate(userID, { $set: { isAuth: true, lastAuth: new Date() }})
                ])
                    .then(data => {
                        const token = data[0].token;
                        return token;
                    })
            }
        })

});
SessionSchema.static('findByTokenAndRemove', function(token) {
    return this.findOne({ token }).then(session => {
        if(!session) return;
        return Promise.all([
            User.findByIdAndUpdate(session.userID, { $set: { isAuth: false }}),
            session.remove()
        ])
    })
});
SessionSchema.static('findByUserAndRemove', function(userID) {
    if(!userID) return;
    return Promise.all([
        User.findByIdAndUpdate(userID, { $set: { isAuth: false }}),
        this.findOne({ userID }).then(session => session && session.remove())
    ])
});


export default mongoose.model('session', SessionSchema);