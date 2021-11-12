const {createLogger, format, transports} = require('winston');
require('winston-daily-rotate-file');


const opendttLogger = new createLogger({
    format: format.combine(
        format.colorize(),
        format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.sss' }),
        format.align(),
        format.printf(
            info => `${info.timestamp}, ${info.message}`
        )
    ),
    transports: [
        new transports.DailyRotateFile({
            filename: './logs/opendtt-%DATE%.log',
            datePattern: 'YYYY-MM-DD', //daily rotation
            json: true,
            maxFiles: 1,
            zippedArchive: true,
            handleExceptions: true
          })
    ]
})

module.exports = {
    opendttLogger: opendttLogger
}