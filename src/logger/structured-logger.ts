export interface LogEntry {
  level: 'INFO' | 'WARN' | 'ERROR';
  event: string;
  traceId?: string;
  requestId?: string;
  userId?: string;
  correlationId?: string;
  orgId?: string;
  details?: Record<string, any>;
  timestamp: string;
}

export class ProductionStructuredLogger {
  static info(
    event: string,
    details?: Record<string, any>,
    context?: { orgId?: string; traceId?: string; requestId?: string; userId?: string; correlationId?: string }
  ) {
    const entry: LogEntry = {
      level: 'INFO',
      event,
      orgId: context?.orgId,
      traceId: context?.traceId || `trc_${Date.now()}`,
      requestId: context?.requestId || `req_${Date.now()}`,
      userId: context?.userId,
      correlationId: context?.correlationId || `corr_${Date.now()}`,
      details,
      timestamp: new Date().toISOString()
    };
    console.log(JSON.stringify(entry));
  }

  static error(
    event: string,
    error: Error | any,
    context?: { orgId?: string; traceId?: string; requestId?: string; userId?: string; correlationId?: string }
  ) {
    const entry: LogEntry = {
      level: 'ERROR',
      event,
      orgId: context?.orgId,
      traceId: context?.traceId || `trc_${Date.now()}`,
      requestId: context?.requestId || `req_${Date.now()}`,
      userId: context?.userId,
      correlationId: context?.correlationId || `corr_${Date.now()}`,
      details: {
        message: error ? (error.message || String(error)) : 'Unknown error',
        stack: error ? error.stack : undefined
      },
      timestamp: new Date().toISOString()
    };
    console.error(JSON.stringify(entry));
  }
}

export const StructuredLogger = ProductionStructuredLogger;
