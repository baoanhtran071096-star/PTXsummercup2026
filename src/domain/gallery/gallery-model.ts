export interface MatchPhotoEntity {
  id: string;
  matchId: string;
  caption: string;
  photoAssetId: string; // NO photo_url RAW STRING ALLOWED (ARCHITECTURE FREEZE RULE)
  createdAt: string;
}

export interface HallOfFameEntity {
  id: string;
  tournamentId: string;
  awardName: 'GOLDEN_BOOT' | 'BEST_PLAYER_MVP' | 'BEST_GOALKEEPER' | 'CHAMPION_TEAM';
  recipientName: string;
  photoAssetId: string;
  createdAt: string;
}
