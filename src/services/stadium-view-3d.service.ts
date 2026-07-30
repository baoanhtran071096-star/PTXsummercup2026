/**
 * 3D Stadium View & Positional Simulation Engine (Task A.1)
 * Renders 3D pitch coordinates, player locations, and camera angles for Live Match simulation.
 */

export interface PlayerPosition3D {
  playerId: string;
  playerName: string;
  team: 'HOME' | 'AWAY';
  x: number; // 0 to 100 on pitch
  y: number;
  speed: number;
}

export interface Stadium3DState {
  matchId: string;
  cameraPreset: 'BROADCAST' | 'TACTICAL' | 'BEHIND_GOAL';
  players: PlayerPosition3D[];
  ballPosition: { x: number; y: number; z: number };
}

export class StadiumView3DService {
  public getStadium3DState(matchId: string): Stadium3DState {
    return {
      matchId,
      cameraPreset: 'BROADCAST',
      ballPosition: { x: 50, y: 35, z: 0.5 },
      players: [
        { playerId: 'p10', playerName: 'Nguyễn Văn B (Phoenix Cáp)', team: 'HOME', x: 75, y: 30, speed: 6.2 },
        { playerId: 'p7', playerName: 'Trần Minh C', team: 'HOME', x: 55, y: 40, speed: 5.8 },
        { playerId: 't9', playerName: 'Hoàng Văn X (Tiger)', team: 'AWAY', x: 30, y: 25, speed: 6.0 }
      ]
    };
  }
}

export const stadiumView3DService = new StadiumView3DService();
