import winston from 'winston';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => {
      const stack = info.stack ? `\n${info.stack}` : '';
      return `${info.timestamp} ${info.level}: ${info.message}${stack}`;
    },
  ),
);

// File format without colors for better readability in text editors
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(
    (info) => {
      const stack = info.stack ? `\n${info.stack}` : '';
      return `${info.timestamp} ${info.level.toUpperCase()}: ${info.message}${stack}`;
    },
  ),
);

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({ 
    filename: 'logs/error.log', 
    level: 'error',
    format: fileFormat,
  }),
  new winston.transports.File({ 
    filename: 'logs/combined.log',
    format: fileFormat,
  }),
];

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'warn',
  levels,
  format,
  transports,
});

export default logger;

