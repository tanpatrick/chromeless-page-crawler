const moment = require('moment');

module.exports = function log(message) {
    const logMessage = `[${moment().format('DD/MM/YYYY HH:mm:ss')}] ${message}`;
    console.log(logMessage);
};
