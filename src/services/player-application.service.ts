import { PlayerEntity, CreatePlayerInput } from '../domain/player/player-model';
import { MediaAssetV12ApplicationService } from './media-asset-v1-2-application.service';

export interface PlayerProfileDTO extends PlayerEntity {
  resolvedAvatarUrl: string;
}

export class PlayerApplicationService {
  private memoryPlayers: Map<string, PlayerEntity> = new Map();
  private damService: MediaAssetV12ApplicationService;

  constructor() {
    this.damService = new MediaAssetV12ApplicationService();
  }

  async createPlayer(input: CreatePlayerInput): Promise<PlayerProfileDTO> {
    const playerId = 'ply_' + Date.now();
    const timestamp = new Date().toISOString();

    const player: PlayerEntity = {
      id: playerId,
      teamId: input.teamId,
      name: input.name,
      shirtNumber: input.shirtNumber,
      position: input.position,
      avatarAssetId: input.avatarAssetId,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
      mvpCount: 0,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    this.memoryPlayers.set(playerId, player);
    return this.getPlayerProfile(playerId);
  }

  async getPlayerProfile(playerId: string): Promise<PlayerProfileDTO> {
    const player = this.memoryPlayers.get(playerId);
    if (!player) {
      throw new Error(`ERR_PLAYER_NOT_FOUND: Player ${playerId} does not exist.`);
    }

    // Integrated DAM AssetResolver Call
    let resolvedAvatarUrl = 'https://ptx.vn/assets/default-avatar-placeholder.png';
    if (player.avatarAssetId) {
      resolvedAvatarUrl = await this.damService.resolveAssetUrlV12(player.avatarAssetId, {
        variantSize: 'medium'
      });
    }

    return {
      ...player,
      resolvedAvatarUrl
    };
  }
}
