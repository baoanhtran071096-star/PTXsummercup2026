export interface PlayerEntity {
  id: string;
  teamId: string;
  name: string;
  shirtNumber: number;
  position: 'GOALKEEPER' | 'DEFENDER' | 'MIDFIELDER' | 'ATTACKER';
  avatarAssetId?: string; // NO avatar_url RAW STRING ALLOWED (ARCHITECTURE FREEZE RULE)
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  mvpCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlayerInput {
  teamId: string;
  name: string;
  shirtNumber: number;
  position: 'GOALKEEPER' | 'DEFENDER' | 'MIDFIELDER' | 'ATTACKER';
  avatarAssetId?: string;
}
