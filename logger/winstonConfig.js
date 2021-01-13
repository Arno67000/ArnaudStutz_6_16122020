const winston = require('winston');
const path = require('path');

const options = {
 file: {
   level: 'info',
   filename: path.join(__dirname, 'app.log'),
   handleExceptions: true,
   json: true,
   maxsize: 5242880, // 5MB
   maxFiles: 5,
   colorize: false,
 },
 console: {
   level: 'info',
   handleExceptions: true,
   json: false,
   colorize: true,
 },
};

const logger = winston.createLogger({
 transports: [
   new winston.transports.File(options.file),
   new winston.transports.Console(options.console)
 ],
 exitOnError: false, // do not exit on handled exceptions
});

//stream object => morgan
logger.stream = {
 write: function(message, encoding) {
   // 'info' log level (file and console)
   logger.info(message);
 },
};

module.exports = logger;