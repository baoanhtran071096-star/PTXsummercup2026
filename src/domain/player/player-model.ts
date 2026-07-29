export type PlayerPosition = 'GOALKEEPER' | 'DEFENDER' | 'MIDFIELDER' | 'ATTACKER' | 'FORWARD';
export type PlayerStatus = 'ACTIVE' | 'INJURED' | 'SUSPENDED';

export interface PlayerEntity {
  id: string;
  teamId: string;
  teamName?: string;
  fullName: string;
  jerseyName: string;
  jerseyNumber: string;
  shirtSize: string;
  position?: PlayerPosition;
  avatarAssetId?: string;
  isCaptain?: boolean;
  isViceCaptain?: boolean;
  status?: PlayerStatus;
  shirtPrinted: boolean;
  shirtDelivered: boolean;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function createPlayerEntity(params: {
  id: string;
  teamId: string;
  teamName?: string;
  fullName: string;
  jerseyName: string;
  jerseyNumber: string;
  shirtSize: string;
  position?: PlayerPosition;
  avatarAssetId?: string;
  isCaptain?: boolean;
  isViceCaptain?: boolean;
  shirtPrinted?: boolean;
  shirtDelivered?: boolean;
  notes?: string;
}): PlayerEntity {
  return {
    id: params.id,
    teamId: params.teamId,
    teamName: params.teamName || 'Đội P',
    fullName: params.fullName,
    jerseyName: params.jerseyName,
    jerseyNumber: params.jerseyNumber,
    shirtSize: params.shirtSize,
    position: params.position || 'ATTACKER',
    avatarAssetId: params.avatarAssetId,
    isCaptain: params.isCaptain || false,
    isViceCaptain: params.isViceCaptain || false,
    status: 'ACTIVE',
    shirtPrinted: params.shirtPrinted ?? true,
    shirtDelivered: params.shirtDelivered ?? true,
    notes: params.notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
