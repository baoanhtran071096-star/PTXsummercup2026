import { SupabaseClientHarness } from '../db/supabase-client';
import { MatchDomainEventPayload } from '../domain/match/match-events';
import { MatchEventBus } from '../realtime/match-event-bus';

export class MatchConsoleRepository {
  private supabase: SupabaseClientHarness;
  private eventBus: MatchEventBus;

  constructor() {
    this.supabase = SupabaseClientHarness.getInstance();
    this.eventBus = MatchEventBus.getInstance();
  }

  async recordMatchDomainEvent(event: MatchDomainEventPayload): Promise<{ success: boolean; eventId: string; latencyMs: number }> {
    const startTime = Date.now();

    const rpcResponse = await this.supabase.rpc<{ success: boolean; eventId: string; db_execution_time_ms: number }>('fn_record_match_event', {
      matchId: event.matchId,
      eventType: event.eventType,
      minute: event.minute,
      payload: event
    });

    if (!rpcResponse.data || rpcResponse.error) {
      throw new Error(`Failed to record match event: ${rpcResponse.error?.message}`);
    }

    // Publish to Realtime Event Bus
    this.eventBus.publish(event);

    const totalLatency = Date.now() - startTime;

    return {
      success: true,
      eventId: rpcResponse.data.eventId || event.eventId,
      latencyMs: totalLatency
    };
  }

  getEventHistory(matchId: string): MatchDomainEventPayload[] {
    return this.eventBus.getEventHistory(matchId);
  }
}
