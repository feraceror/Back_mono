const winston = require('winston');

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6
  };


  const logFormatter = winston.format.printf((info) => {
    let { stack, message } = info;
    message = stack || message;
    return  message;
  });

const loggerinfo = winston.createLogger({
    level: 'info'
  });
  
  const DailyRotateFile = require('winston-daily-rotate-file');
  loggerinfo.configure({
    level: 'info',
    transports: [
    new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize(), winston.format.simple(), winston.format.timestamp(), logFormatter),
        }),
      new DailyRotateFile({ filename: 'combined.log' })
    ]
  });


const logger = (msg, type = "info")=>{

    const now = new Date().toLocaleString( 'sv', { timeZoneName: 'short' } )
    loggerinfo.log({
        level: type,
        message: `[${type.toUpperCase()}-LOG]${now} : ${msg}`
      });
}   

module.exports = logger 