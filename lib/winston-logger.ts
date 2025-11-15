// lib/winston-logger.ts
import winston from 'winston';
import path from 'path';

// 创建日志目录
const logDir = path.join(process.cwd(), 'logs');
// const logDir = '/app/logs';

// 确保日志目录存在
import fs from 'fs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// 创建 logger 实例
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple()
    ),
    transports: [
        // 输出到文件
        new winston.transports.File({
            filename: path.join(logDir, 'app.log')
        }),
        // 输出到控制台
        new winston.transports.Console()
    ],
});

export default logger;