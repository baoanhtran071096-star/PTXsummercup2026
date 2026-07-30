// @ptx/sdk – Logger
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
  source?: string;
}

export class Logger {
  private source: string;

  constructor(source: string) {
    this.source = source;
  }

  private log(level: LogLevel, message: string, data?: unknown): void {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      source: this.source,
    };
    const prefix = `[${entry.timestamp}] [${level.toUpperCase()}] [${this.source}]`;
    if (level === 'error') console.error(prefix, message, data ?? '');
    else if (level === 'warn') console.warn(prefix, message, data ?? '');
    else console.log(prefix, message, data ?? '');
  }

  debug(msg: string, data?: unknown) { this.log('debug', msg, data); }
  info(msg: string, data?: unknown)  { this.log('info', msg, data); }
  warn(msg: string, data?: unknown)  { this.log('warn', msg, data); }
  error(msg: string, data?: unknown) { this.log('error', msg, data); }
}

export const createLogger = (source: string) => new Logger(source);
