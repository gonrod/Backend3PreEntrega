const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Define log format
const logFormat = winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create Winston logger with daily rotation
const logger = winston.createLogger({
    level: 'info', // Mantiene 'info' para incluir error, warn, http e info
    format: winston.format.combine(
        winston.format.timestamp(),
        logFormat
    ),
    transports: [
        new winston.transports.Console(), // Log to console
        new DailyRotateFile({ 
            filename: path.join(__dirname, '../logs/error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxSize: '20m',
            maxFiles: '7d',
        }),
        new DailyRotateFile({
            filename: path.join(__dirname, '../logs/http-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'http',
            maxSize: '20m',
            maxFiles: '7d',
        }),
        new DailyRotateFile({ 
            filename: path.join(__dirname, '../logs/info-%DATE%.log'), 
            datePattern: 'YYYY-MM-DD',
            level: 'info',
            maxSize: '20m',
            maxFiles: '7d',
        }),
        new DailyRotateFile({ 
            filename: path.join(__dirname, '../logs/warn-%DATE%.log'), 
            datePattern: 'YYYY-MM-DD',
            level: 'warn',
            maxSize: '20m',
            maxFiles: '7d',
        })
    ]
});

module.exports = logger;
