// lib/file-logger.ts
import fs from 'fs';
import path from 'path';

class FileLogger {
    private logDir: string;
    private logFile: string;

    constructor() {
        this.logDir = '/app/logs';
        this.logFile = path.join(this.logDir, 'app.log');

        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    private write(level: string, message: string, data?: any) {
        const timestamp = new Date().toISOString();
        let logLine = `[${timestamp}] [${level}] ${message}`;

        if (data) {
            logLine += ` | ${JSON.stringify(data)}`;
        }
        logLine += '\n';

        // 写入文件
        fs.appendFileSync(this.logFile, logLine, 'utf8');
        // 控制台也输出（已移除）
    }

    info(message: string, data?: any) {
        this.write('INFO', message, data);
    }

    error(message: string, data?: any) {
        this.write('ERROR', message, data);
    }

    warn(message: string, data?: any) {
        this.write('WARN', message, data);
    }
}

export const logger = new FileLogger();
export default logger;