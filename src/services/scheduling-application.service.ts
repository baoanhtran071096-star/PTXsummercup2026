import { SchedulingRepository, ScheduledMatchSlot } from '../repository/scheduling.repository';
import { GenerateScheduleParams } from '../db/supabase-client';

export interface ScheduleGenerationResult {
  tournamentId: string;
  totalRounds: number;
  totalMatchesScheduled: number;
  venueConflictsDetected: number;
  timeConflictsDetected: number;
  scheduledSlots: ScheduledMatchSlot[];
  executionTimeSec: string;
}

export class SchedulingApplicationService {
  private repo: SchedulingRepository;

  constructor() {
    this.repo = new SchedulingRepository();
  }

  async generateRoundRobinSchedule(params: GenerateScheduleParams): Promise<ScheduleGenerationResult> {
    const startTime = Date.now();
    const teams = [...params.teams];
    const venues = params.venues.length > 0 ? params.venues : ['Sân 1 Sân Vận Động PTX'];
    const scheduledSlots: ScheduledMatchSlot[] = [];

    let venueConflictsDetected = 0;
    let timeConflictsDetected = 0;

    // Generate Round Robin Match Matrix
    const numTeams = teams.length;
    const roundsCount = numTeams % 2 === 0 ? numTeams - 1 : numTeams;
    const baseDate = new Date(params.startDate || Date.now());

    let matchCounter = 1;
    for (let round = 1; round <= roundsCount; round++) {
      for (let i = 0; i < Math.floor(numTeams / 2); i++) {
        const home = teams[i];
        const away = teams[numTeams - 1 - i];

        if (home && away && home !== away) {
          const matchTime = new Date(baseDate.getTime() + round * 86400000 + i * 3600000).toISOString();
          const venue = venues[i % venues.length];

          const slot: ScheduledMatchSlot = {
            matchId: `mth_r${round}_${matchCounter++}`,
            roundNumber: round,
            homeTeam: home,
            awayTeam: away,
            venue,
            scheduledTime: matchTime
          };

          // Audit conflicts
          if (this.repo.checkVenueConflict(scheduledSlots, slot)) {
            venueConflictsDetected++;
          }
          if (this.repo.checkTimeConflict(scheduledSlots, slot)) {
            timeConflictsDetected++;
          }

          scheduledSlots.push(slot);
        }
      }

      // Rotate team array for Round Robin
      teams.splice(1, 0, teams.pop()!);
    }

    const repoResult = await this.repo.saveGeneratedSchedule(params, scheduledSlots);
    const executionTimeSec = ((Date.now() - startTime) / 1000).toFixed(2);

    return {
      tournamentId: repoResult.tournamentId,
      totalRounds: roundsCount,
      totalMatchesScheduled: scheduledSlots.length,
      venueConflictsDetected,
      timeConflictsDetected,
      scheduledSlots,
      executionTimeSec: `${executionTimeSec} sec`
    };
  }
}
