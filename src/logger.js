import winston from 'winston';

winston.emitErrs = true;

export default new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      colorize: true,
      handleExceptions: true,
      humanReadableUnhandledException: true      
    }),

    new winston.transports.File({
      name: 'error',
      level: 'error',
      filename: 'error.log'
    })/*,

    new winston.transports.File({
      name: 'debug',
      level: 'debug',
      filename: 'debug.log'
    })*/
  ],
  
  exitOnError: false
});