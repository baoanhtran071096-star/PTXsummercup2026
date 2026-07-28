import versionData from '../../../master-data/version.json';
import tournamentData from '../../../master-data/tournament.json';
import teamsData from '../../../master-data/teams.json';
import playersData from '../../../master-data/players.json';
import matchesData from '../../../master-data/matches.json';
import standingsData from '../../../master-data/standings.json';
import hallOfFameData from '../../../master-data/hall_of_fame.json';

export class MasterDatasetLoaderService {
  getVersionInfo() {
    return versionData;
  }

  getTournamentMetadata() {
    return tournamentData;
  }

  getRealTeams() {
    return teamsData;
  }

  getRealPlayers() {
    return playersData;
  }

  getMatches() {
    return matchesData;
  }

  getStandings() {
    return standingsData;
  }

  getHallOfFame() {
    return hallOfFameData;
  }

  validateSchemaIntegrity(): { isValid: boolean; totalPlayers: number; totalTeams: number } {
    const isTeamsValid = Array.isArray(teamsData) && teamsData.length === 3;
    const isPlayersValid = Array.isArray(playersData) && playersData.length === 26;
    return {
      isValid: isTeamsValid && isPlayersValid,
      totalTeams: teamsData.length,
      totalPlayers: playersData.length
    };
  }
}
