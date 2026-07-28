import { MatchConsoleRepository } from '../repository/match-console.repository';
import { MatchDomainEventPayload, MatchEventType } from '../domain/match/match-events';

export interface RecordEventInput {
  matchId: string;
  eventType: MatchEventType;
  minute: number;
  details: Record<string, any>;
}

export class MatchConsoleApplicationService {
  private repo: MatchConsoleRepository;

  constructor() {
    this.repo = new MatchConsoleRepository();
  }

  async handleRecordMatchEvent(input: RecordEventInput): Promise<{ eventId: string; status: string; latencyMs: number; event: MatchDomainEventPayload }> {
    const eventId = 'evt_' + Date.now();
    const timestamp = new Date().toISOString();

    const domainEvent: MatchDomainEventPayload = {
      eventId,
      eventType: input.eventType,
      matchId: input.matchId,
      minute: input.minute,
      timestamp,
      ...input.details
    } as MatchDomainEventPayload;

    const result = await this.repo.recordMatchDomainEvent(domainEvent);

    return {
      eventId: result.eventId,
      status: 'PROCESSED_AND_BROADCAST',
      latencyMs: result.latencyMs,
      event: domainEvent
    };
  }

  async getLiveMatchState(matchId: string) {
    const events = this.repo.getEventHistory(matchId);
    let homeScore = 0;
    let awayScore = 0;

    events.forEach((evt) => {
      if (evt.eventType === 'GOAL_SCORED') {
        if (evt.goalType !== 'OWN_GOAL') {
          homeScore += 1; // Simplified aggregate state computation
        }
      }
    });

    return {
      matchId,
      totalEvents: events.length,
      currentScore: { home: homeScore, away: awayScore },
      events
    };
  }
}
