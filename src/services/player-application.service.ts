import { PlayerEntity, createPlayerEntity } from '../domain/player/player-model';
import { MediaAssetV12ApplicationService } from './media-asset-v1-2-application.service';

export interface PlayerDTO extends PlayerEntity {
  resolvedAvatarUrl: string;
}

export class PlayerApplicationService {
  private damService: MediaAssetV12ApplicationService;
  private players: Map<string, PlayerEntity> = new Map();

  constructor(damService?: MediaAssetV12ApplicationService) {
    this.damService = damService || new MediaAssetV12ApplicationService();
  }

  async createPlayer(params: {
    teamId: string;
    fullName: string;
    jerseyName: string;
    jerseyNumber: string;
    shirtSize: string;
    position?: 'GOALKEEPER' | 'DEFENDER' | 'MIDFIELDER' | 'ATTACKER' | 'FORWARD';
    avatarAssetId?: string;
    isCaptain?: boolean;
    isViceCaptain?: boolean;
    shirtPrinted?: boolean;
    shirtDelivered?: boolean;
    notes?: string;
  }): Promise<PlayerDTO> {
    const id = `ply_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const entity = createPlayerEntity({
      id,
      teamId: params.teamId,
      fullName: params.fullName,
      jerseyName: params.jerseyName,
      jerseyNumber: params.jerseyNumber,
      shirtSize: params.shirtSize,
      position: params.position,
      avatarAssetId: params.avatarAssetId,
      isCaptain: params.isCaptain,
      isViceCaptain: params.isViceCaptain,
      shirtPrinted: params.shirtPrinted,
      shirtDelivered: params.shirtDelivered,
      notes: params.notes
    });

    this.players.set(id, entity);

    let resolvedAvatarUrl = 'https://ptx.vn/assets/default-avatar-placeholder.png';
    if (entity.avatarAssetId) {
      resolvedAvatarUrl = await this.damService.resolveAssetUrlV12(entity.avatarAssetId, {
        variantSize: 'small'
      });
    }

    return {
      ...entity,
      resolvedAvatarUrl
    };
  }

  async getPlayerProfile(playerId: string): Promise<PlayerDTO | null> {
    const entity = this.players.get(playerId);
    if (!entity) return null;

    let resolvedAvatarUrl = 'https://ptx.vn/assets/default-avatar-placeholder.png';
    if (entity.avatarAssetId) {
      resolvedAvatarUrl = await this.damService.resolveAssetUrlV12(entity.avatarAssetId, {
        variantSize: 'medium'
      });
    }

    return {
      ...entity,
      resolvedAvatarUrl
    };
  }
}
