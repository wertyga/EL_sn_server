import fs from 'fs';
import util from 'util';
import config from './config';

class Logger {
    constructor(module) {
        this.pathName = module.filename;
        this.stat = util.promisify(fs.stat);
        this.writeFile = util.promisify(fs.writeFile);
        this.appendFile = util.promisify(fs.appendFile);
    };

    error(msg, name) {
        let message = `${new Date()} \n   ERROR: ${name ? name : ''} ${this.pathName}': ${msg}\n\n`;
        return this.stat(config.logFile)
            .then(stats => this.appendFile(config.logFile, message))
            .catch(err => {
                if(err.code === 'ENOENT') {
                    return this.writeFile(config.logFile, message);
                } else {
                    throw err;
                }
            }).catch(err => console.error(`Can't write log file: ${err}`))
    };

    info(msg) {
        let message = `${new Date()} \n   INFO: ${this.pathName}': ${msg}\n\n`;
        return this.stat(config.logFile)
            .then(stats => {
                this.appendFile(config.logFile, message);
            })
            .catch(err => {
                if(err.code === 'ENOENT') {
                    return this.writeFile(config.logFile, message);
                } else {
                    throw err;
                }
            }).catch(err => console.error(`Can't write log file: ${err}`))
    };
};

function logger(module) {
    return new Logger(module)
};

module.exports = logger;
