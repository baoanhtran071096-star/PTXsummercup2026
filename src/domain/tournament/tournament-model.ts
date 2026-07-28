export interface TournamentEntity {
  id: string;
  orgId: string;
  name: string;
  year: number;
  seasonId: string;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED';
  bannerAssetId?: string; // NO banner_url RAW STRING ALLOWED (ARCHITECTURE FREEZE RULE)
  createdAt: string;
  updatedAt: string;
}

export interface CreateTournamentInput {
  orgId: string;
  name: string;
  year: number;
  seasonId: string;
  bannerAssetId?: string;
}
