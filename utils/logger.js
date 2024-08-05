import winston from 'winston';

const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warn: 'yellow',
        info: 'blue',
        http: 'green',
        debug: 'white',
    },
};

const logger = winston.createLogger({
    levels: customLevels.levels,
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

winston.addColors(customLevels.colors);

export default logger;
