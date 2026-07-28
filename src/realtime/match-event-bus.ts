import { MatchDomainEventPayload } from '../domain/match/match-events';
import { StructuredLogger } from '../logger/structured-logger';

export class MatchEventBus {
  private static instance: MatchEventBus;
  private eventLog: MatchDomainEventPayload[] = [];
  private listeners: Array<(event: MatchDomainEventPayload) => void> = [];

  public static getInstance(): MatchEventBus {
    if (!MatchEventBus.instance) {
      MatchEventBus.instance = new MatchEventBus();
    }
    return MatchEventBus.instance;
  }

  publish(event: MatchDomainEventPayload): void {
    const broadcastStartTime = Date.now();
    this.eventLog.push(event);

    StructuredLogger.info('EVENT_BUS_PUBLISHED', {
      eventId: event.eventId,
      eventType: event.eventType,
      matchId: event.matchId,
      minute: event.minute,
      broadcastLatencyMs: Date.now() - broadcastStartTime
    });

    this.listeners.forEach((listener) => listener(event));
  }

  subscribe(listener: (event: MatchDomainEventPayload) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  getEventHistory(matchId: string): MatchDomainEventPayload[] {
    return this.eventLog.filter((evt) => evt.matchId === matchId);
  }
}
