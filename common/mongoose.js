import mongoose from 'mongoose';

import config from './config';
const log = require('./log')(module)

// mongoose.set('debug', true);
mongoose.Promise = require('bluebird');

mongoose.connect(config.mongoose.uri, { useNewUrlParser: true }, (err) => {
    if(err) {
        log.error(err.message);
    } else {
        console.log('-- Mongoose connect --');
    };
}), config.mongoose.options;


export default mongoose;
