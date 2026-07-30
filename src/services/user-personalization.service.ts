/**
 * User Personalization & History Engine (UX Region 1)
 * Manages personal prediction history, performance statistics, homepage feed customization, and notification preferences.
 */

export interface PredictionHistoryItem {
  predictionId: string;
  matchId: string;
  matchTitle: string;
  predictedScore: { home: number; away: number };
  actualScore?: { home: number; away: number };
  status: 'PENDING' | 'CORRECT' | 'INCORRECT';
  pointsEarned: number;
  createdAt: string;
}

export interface UserPerformanceStats {
  userEmail: string;
  totalPredictions: number;
  correctPredictions: number;
  accuracyPercentage: number;
  totalMVPVotes: number;
  fanRankPosition: number;
  totalPoints: number;
}

export interface NotificationPreferences {
  userEmail: string;
  notifyMatchGoal: boolean;
  notifyMatchStart: boolean;
  notifyMatchResult: boolean;
  notifyFanRankChange: boolean;
}

export class UserPersonalizationService {
  private predictionLogs: Map<string, PredictionHistoryItem[]> = new Map();
  private notificationSettings: Map<string, NotificationPreferences> = new Map();

  public recordPrediction(userEmail: string, item: Omit<PredictionHistoryItem, 'predictionId' | 'createdAt'>): PredictionHistoryItem {
    const history = this.predictionLogs.get(userEmail) || [];
    const newItem: PredictionHistoryItem = {
      ...item,
      predictionId: `pred_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    history.push(newItem);
    this.predictionLogs.set(userEmail, history);
    return newItem;
  }

  public getUserPredictionHistory(userEmail: string): PredictionHistoryItem[] {
    return this.predictionLogs.get(userEmail) || [];
  }

  public getUserPerformanceStats(userEmail: string): UserPerformanceStats {
    const history = this.getUserPredictionHistory(userEmail);
    const totalPredictions = history.length;
    const correctPredictions = history.filter(h => h.status === 'CORRECT').length;
    const accuracyPercentage = totalPredictions > 0 ? (correctPredictions / totalPredictions) * 100 : 0;
    const totalPoints = history.reduce((sum, h) => sum + h.pointsEarned, 0);

    return {
      userEmail,
      totalPredictions,
      correctPredictions,
      accuracyPercentage: Math.round(accuracyPercentage * 10) / 10,
      totalMVPVotes: 12,
      fanRankPosition: 4,
      totalPoints
    };
  }

  public getPersonalizedHomepageFeed(favoriteTeam: string = 'Phoenix'): { recommendedMatches: string[]; favoriteTeamNews: string[] } {
    return {
      recommendedMatches: [`${favoriteTeam} vs Tiger`, `${favoriteTeam} vs Xiphias`],
      favoriteTeamNews: [
        `[Tin nóng] Đội bóng ${favoriteTeam} sẵn sàng cho trận đại chiến tuần này!`,
        `Phân tích chuyên sâu: Đội hình 5 người tối ưu của ${favoriteTeam}`
      ]
    };
  }

  public setNotificationPreferences(prefs: NotificationPreferences): NotificationPreferences {
    this.notificationSettings.set(prefs.userEmail, prefs);
    return prefs;
  }
}

export const userPersonalizationService = new UserPersonalizationService();
