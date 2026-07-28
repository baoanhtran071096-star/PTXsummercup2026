export type MatchEventType =
  | 'MATCH_STARTED'
  | 'GOAL_SCORED'
  | 'YELLOW_CARD_ISSUED'
  | 'RED_CARD_ISSUED'
  | 'PLAYER_SUBSTITUTED'
  | 'MATCH_ENDED';

export interface BaseDomainEvent {
  eventId: string;
  eventType: MatchEventType;
  matchId: string;
  timestamp: string;
  minute: number;
}

export interface MatchStartedEvent extends BaseDomainEvent {
  eventType: 'MATCH_STARTED';
  homeTeamId: string;
  awayTeamId: string;
  refereeName: string;
}

export interface GoalScoredEvent extends BaseDomainEvent {
  eventType: 'GOAL_SCORED';
  teamId: string;
  scorerPlayerId: string;
  assistPlayerId?: string;
  goalType: 'OPEN_PLAY' | 'FREE_KICK' | 'PENALTY' | 'OWN_GOAL';
  currentScore: { home: number; away: number };
}

export interface YellowCardIssuedEvent extends BaseDomainEvent {
  eventType: 'YELLOW_CARD_ISSUED';
  teamId: string;
  playerId: string;
  reason: string;
}

export interface RedCardIssuedEvent extends BaseDomainEvent {
  eventType: 'RED_CARD_ISSUED';
  teamId: string;
  playerId: string;
  reason: string;
  isSecondYellow: boolean;
}

export interface PlayerSubstitutedEvent extends BaseDomainEvent {
  eventType: 'PLAYER_SUBSTITUTED';
  teamId: string;
  playerOutId: string;
  playerInId: string;
}

export interface MatchEndedEvent extends BaseDomainEvent {
  eventType: 'MATCH_ENDED';
  finalScore: { home: number; away: number };
  durationMinutes: number;
}

export type MatchDomainEventPayload =
  | MatchStartedEvent
  | GoalScoredEvent
  | YellowCardIssuedEvent
  | RedCardIssuedEvent
  | PlayerSubstitutedEvent
  | MatchEndedEvent;
