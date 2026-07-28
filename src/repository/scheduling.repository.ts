import { SupabaseClientHarness, GenerateScheduleParams } from '../db/supabase-client';
import { StructuredLogger } from '../logger/structured-logger';
import { DomainEventPayload } from './tournament.repository';

export interface ScheduledMatchSlot {
  matchId: string;
  roundNumber: number;
  homeTeam: string;
  awayTeam: string;
  venue: string;
  scheduledTime: string;
}

export class SchedulingRepository {
  private supabase: SupabaseClientHarness;

  constructor() {
    this.supabase = SupabaseClientHarness.getInstance();
  }

  /**
   * Conflict Detection Engine: Checks for venue conflicts
   */
  checkVenueConflict(existingSlots: ScheduledMatchSlot[], newSlot: ScheduledMatchSlot): boolean {
    return existingSlots.some(
      (slot) => slot.venue === newSlot.venue && slot.scheduledTime === newSlot.scheduledTime
    );
  }

  /**
   * Conflict Detection Engine: Checks for team time conflicts
   */
  checkTimeConflict(existingSlots: ScheduledMatchSlot[], newSlot: ScheduledMatchSlot): boolean {
    return existingSlots.some(
      (slot) =>
        slot.scheduledTime === newSlot.scheduledTime &&
        (slot.homeTeam === newSlot.homeTeam ||
          slot.homeTeam === newSlot.awayTeam ||
          slot.awayTeam === newSlot.homeTeam ||
          slot.awayTeam === newSlot.awayTeam)
    );
  }

  async saveGeneratedSchedule(
    params: GenerateScheduleParams,
    scheduledSlots: ScheduledMatchSlot[]
  ): Promise<{ tournamentId: string; totalMatches: number; event: DomainEventPayload }> {
    const response = await this.supabase.rpc<{ success: boolean; totalMatchesScheduled: number }>('fn_generate_tournament_schedule', {
      tournamentId: params.tournamentId,
      teams: params.teams,
      venues: params.venues,
      startDate: params.startDate
    });

    if (!response.data || response.error) {
      throw new Error(`Failed to generate schedule: ${response.error?.message}`);
    }

    const event: DomainEventPayload = {
      eventId: 'evt_sched_' + Date.now(),
      eventType: 'TOURNAMENT_CREATED', // Domain Event reuse
      timestamp: new Date().toISOString(),
      details: {
        tournamentId: params.tournamentId,
        totalRounds: Math.ceil(params.teams.length - 1),
        totalMatchesScheduled: scheduledSlots.length,
        venueConflictsCount: 0,
        timeConflictsCount: 0
      }
    };

    StructuredLogger.info('SCHEDULE_GENERATED_SUCCESS', {
      tournamentId: params.tournamentId,
      totalMatches: scheduledSlots.length
    });

    return {
      tournamentId: params.tournamentId,
      totalMatches: scheduledSlots.length,
      event
    };
  }
}
