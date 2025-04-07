import { LogLevel, LogEntry } from '../types';

export class LoggingService {
  private static instance: LoggingService;
  private logs: LogEntry[] = [];
  private readonly STORAGE_KEY = 'app_logs';
  private readonly MAX_LOGS = 1000;

  private constructor() {
    this.loadLogs();
  }

  public static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  private loadLogs() {
    try {
      const savedLogs = localStorage.getItem(this.STORAGE_KEY);
      if (savedLogs) {
        this.logs = JSON.parse(savedLogs);
      }
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  }

  private async saveLogs() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.logs));
    } catch (error) {
      console.error('Error saving logs:', error);
    }
  }

  public log(level: LogLevel, message: string, details?: any) {
    const entry: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      level,
      message,
      details
    };

    this.logs.push(entry);

    // Keep only the last MAX_LOGS entries
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(-this.MAX_LOGS);
    }

    this.saveLogs();

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      const consoleMethod = {
        error: console.error,
        warn: console.warn,
        info: console.info,
        debug: console.debug
      }[level];

      consoleMethod(`[${entry.timestamp}] ${message}`, details);
    }
  }

  public getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  public clearLogs() {
    this.logs = [];
    this.saveLogs();
  }

  public getErrorCount(): number {
    return this.logs.filter(log => log.level === 'error').length;
  }

  public getWarningCount(): number {
    return this.logs.filter(log => log.level === 'warn').length;
  }
} 