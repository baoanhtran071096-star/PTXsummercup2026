/**
 * Event Check-in & Big Screen TV Scoreboard Engine (UX Region 6)
 * Generates and verifies QR Codes for match attendees, and feeds data to TV/Projector Scoreboards.
 */

export interface QRCheckinTicket {
  ticketId: string;
  userEmail: string;
  matchId: string;
  seatZone: string;
  qrPayload: string;
  checkedIn: boolean;
}

export interface BigScreenScoreboardPayload {
  matchId: string;
  homeTeam: { name: string; score: number; logoUrl: string };
  awayTeam: { name: string; score: number; logoUrl: string };
  matchMinute: number;
  matchStatus: 'UPCOMING' | 'LIVE_1ST_HALF' | 'HALFTIME' | 'LIVE_2ND_HALF' | 'FINISHED';
  stadiumName: string;
}

export class EventCheckinService {
  private tickets: Map<string, QRCheckinTicket> = new Map();

  public generateTicket(userEmail: string, matchId: string): QRCheckinTicket {
    const ticketId = `tkt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const ticket: QRCheckinTicket = {
      ticketId,
      userEmail,
      matchId,
      seatZone: 'Zone A - Fan Stand',
      qrPayload: `PTX_SUMMER_CUP_TICKET_${ticketId}`,
      checkedIn: false
    };
    this.tickets.set(ticketId, ticket);
    return ticket;
  }

  public verifyAndCheckin(ticketId: string): { success: boolean; message: string } {
    const ticket = this.tickets.get(ticketId);
    if (!ticket) return { success: false, message: 'TÉ Vé không tồn tại!' };
    if (ticket.checkedIn) return { success: false, message: 'Vé đã được Check-in trước đó!' };

    ticket.checkedIn = true;
    return { success: true, message: 'Check-in thành công! Chúc bạn xem trận đấu vui vẻ!' };
  }

  public getBigScreenScoreboardFeed(matchId: string): BigScreenScoreboardPayload {
    return {
      matchId,
      homeTeam: { name: 'Phoenix FC', score: 2, logoUrl: 'https://cdn.ptxsummercup.vn/teams/phoenix.png' },
      awayTeam: { name: 'Tiger FC', score: 1, logoUrl: 'https://cdn.ptxsummercup.vn/teams/tiger.png' },
      matchMinute: 38,
      matchStatus: 'LIVE_1ST_HALF',
      stadiumName: 'Sân vận động Trung tâm PTX Complex'
    };
  }
}

export const eventCheckinService = new EventCheckinService();
