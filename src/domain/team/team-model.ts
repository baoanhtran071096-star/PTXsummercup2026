export interface TeamEntity {
  id: string;
  seasonId: string;
  name: string;
  fullName: string;
  colorPrimary: string;
  colorSecondary: string;
  logoAssetId?: string; // NO logo_url RAW STRING ALLOWED (ARCHITECTURE FREEZE RULE)
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamInput {
  seasonId: string;
  name: string;
  fullName: string;
  colorPrimary: string;
  colorSecondary: string;
  logoAssetId?: string;
}
