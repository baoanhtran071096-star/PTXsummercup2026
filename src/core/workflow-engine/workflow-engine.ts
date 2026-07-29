export type TournamentPhase =
  | 'REGISTRATION'
  | 'SCHEDULING'
  | 'PLAYING'
  | 'VERIFICATION'
  | 'STANDINGS'
  | 'AWARDS'
  | 'ARCHIVE';

export interface PhaseTransitionResult {
  previousPhase: TournamentPhase;
  currentPhase: TournamentPhase;
  allowedActions: string[];
  timestamp: string;
}

export class WorkflowEngineService {
  private currentPhase: TournamentPhase = 'PLAYING';
  private phaseActions: Record<TournamentPhase, string[]> = {
    REGISTRATION: ['REGISTER_TEAM', 'REGISTER_PLAYER'],
    SCHEDULING: ['GENERATE_SCHEDULE', 'PUBLISH_FIXTURES'],
    PLAYING: ['RECORD_GOAL', 'RECORD_CARD', 'SUBMIT_MATCH_RESULT'],
    VERIFICATION: ['VERIFY_MATCH_REPORT'],
    STANDINGS: ['CALCULATE_STANDINGS', 'UPDATE_GOLDEN_BOOT'],
    AWARDS: ['PUBLISH_HALL_OF_FAME'],
    ARCHIVE: ['FREEZE_DATASET']
  };

  getCurrentPhase(): TournamentPhase {
    return this.currentPhase;
  }

  transitionTo(nextPhase: TournamentPhase): PhaseTransitionResult {
    const previousPhase = this.currentPhase;
    this.currentPhase = nextPhase;
    return {
      previousPhase,
      currentPhase: nextPhase,
      allowedActions: this.phaseActions[nextPhase],
      timestamp: new Date().toISOString()
    };
  }

  isActionAllowed(action: string): boolean {
    return this.phaseActions[this.currentPhase].includes(action);
  }
}
