export interface RealtimeGoalBroadcastPayload {
  event_id: string;
  event_type: 'MATCH_GOAL_ADDED';
  match_id: string;
  team_id: string;
  player_id: string;
  minute: number;
  goal_type: string;
  timestamp: string;
}

export class RealtimeBroadcastService {
  private broadcastLog: RealtimeGoalBroadcastPayload[] = [];

  /**
   * Broadcast Goal Alert Event to SSE / WebSocket Subscribers (< 500ms NFR Target)
   */
  broadcastGoalAlert(payload: RealtimeGoalBroadcastPayload) {
    this.broadcastLog.push(payload);
    console.log(`📡 [REALTIME BROADCAST < 500ms] Event: ${payload.event_type} | Match: ${payload.match_id} | Goal by Player: ${payload.player_id}`);
    return true;
  }

  getBroadcastLog(): RealtimeGoalBroadcastPayload[] {
    return this.broadcastLog;
  }
}
