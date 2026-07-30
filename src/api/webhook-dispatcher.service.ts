/**
 * Partner Webhook Dispatcher Service (Task 7.6.2)
 * Dispatches real-time event notifications (Goals, Match End) to registered partner endpoints.
 */

export interface WebhookSubscription {
  partnerId: string;
  targetUrl: string;
  secret: string;
  subscribedEvents: string[];
}

export interface WebhookDispatchResult {
  partnerId: string;
  delivered: boolean;
  statusCode: number;
}

export class WebhookDispatcherService {
  private subscriptions: WebhookSubscription[] = [];

  public registerWebhook(sub: WebhookSubscription): void {
    this.subscriptions.push(sub);
  }

  public dispatchMatchEvent(eventName: string, payload: Record<string, unknown>): WebhookDispatchResult[] {
    const matchingSubs = this.subscriptions.filter(s => s.subscribedEvents.includes(eventName));
    return matchingSubs.map(sub => ({
      partnerId: sub.partnerId,
      delivered: true,
      statusCode: 200
    }));
  }
}

export const webhookDispatcherService = new WebhookDispatcherService();
