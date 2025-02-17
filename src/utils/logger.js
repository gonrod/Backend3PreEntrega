const winston = require('winston');
const path = require('path');

// Define custom log formats
const logFormat = winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create the Winston logger
const logger = winston.createLogger({
    level: 'info', // Default log level
    format: winston.format.combine(
        winston.format.timestamp(),
        logFormat
    ),
    transports: [
        new winston.transports.Console(), // Logs to the console
        new winston.transports.File({ filename: path.join(__dirname, '../logs/error.log'), level: 'error' }), // Logs errors to a file
        new winston.transports.File({ filename: path.join(__dirname, '../logs/http.log'), level: 'http' }) // Logs HTTP requests to a file
    ]
});

module.exports = logger;
