export interface SponsorEntity {
  id: string;
  tournamentId: string;
  name: string;
  sponsorTier: 'TITLE_SPONSOR' | 'GOLD_SPONSOR' | 'SILVER_SPONSOR' | 'MEDIA_PARTNER';
  logoAssetId?: string; // NO logo_url RAW STRING ALLOWED (ARCHITECTURE FREEZE RULE)
  createdAt: string;
  updatedAt: string;
}

export interface CreateSponsorInput {
  tournamentId: string;
  name: string;
  sponsorTier: 'TITLE_SPONSOR' | 'GOLD_SPONSOR' | 'SILVER_SPONSOR' | 'MEDIA_PARTNER';
  logoAssetId?: string;
}
