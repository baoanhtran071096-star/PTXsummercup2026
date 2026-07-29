import versionData from '../../../master-data/version.json';
import tournamentData from '../../../master-data/tournament.json';
import teamsData from '../../../master-data/teams.json';
import playersData from '../../../master-data/players.json';
import matchesData from '../../../master-data/matches.json';
import standingsData from '../../../master-data/standings.json';
import hallOfFameData from '../../../master-data/hall_of_fame.json';
import assetManifestData from '../../../master-data/asset-manifest.json';

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

  getAssetManifest() {
    return assetManifestData;
  }

  validateTeamIds(): boolean {
    const teamIds = new Set(teamsData.map(t => t.id));
    return teamIds.size === 3;
  }

  validatePlayerIds(): boolean {
    const playerIds = new Set(playersData.map(p => p.id));
    return playerIds.size === 26;
  }

  validateAssetIds(): boolean {
    const assetKeys = Object.keys(assetManifestData);
    return assetKeys.length >= 9;
  }

  validateMatchReferences(): boolean {
    const teamIds = new Set(teamsData.map(t => t.id));
    return matchesData.every(m => teamIds.has(m.homeTeamId) && teamIds.has(m.awayTeamId));
  }

  validateSchemaIntegrity(): { isValid: boolean; totalPlayers: number; totalTeams: number } {
    const isTeamsValid = this.validateTeamIds();
    const isPlayersValid = this.validatePlayerIds();
    const isMatchesValid = this.validateMatchReferences();
    const isAssetsValid = this.validateAssetIds();

    return {
      isValid: isTeamsValid && isPlayersValid && isMatchesValid && isAssetsValid,
      totalTeams: teamsData.length,
      totalPlayers: playersData.length
    };
  }

  generateAuditReport() {
    const integrity = this.validateSchemaIntegrity();
    return {
      version: versionData.version,
      auditStatus: integrity.isValid ? 'PASSED' : 'FAILED',
      totalTeams: integrity.totalTeams,
      totalPlayers: integrity.totalPlayers,
      totalMatches: matchesData.length,
      timestamp: new Date().toISOString()
    };
  }
}
