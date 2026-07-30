/**
 * Gamification, Badges & Achievements Engine (UX Region 4)
 * Manages seasonal fan ranking, achievement badges ("Tân thủ", "Chuyên gia dự đoán", "Fan cuồng nhiệt", "Sứ giả PTX"), challenges, and lucky rewards.
 */

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  unlockedAt: string;
}

export interface DailyQuest {
  questId: string;
  title: string;
  targetCount: number;
  currentProgress: number;
  rewardPoints: number;
  completed: boolean;
}

export class GamificationBadgesService {
  private userBadgesMap: Map<string, UserBadge[]> = new Map();

  public checkAndAwardBadges(userEmail: string, stats: { totalPredictions: number; correctPredictions: number; referralCount: number }): UserBadge[] {
    const badges: UserBadge[] = [];

    // Badge 1: Tân thủ
    badges.push({
      id: 'badge_newbie',
      name: 'Tân thủ',
      description: 'Gia nhập nền tảng PTX Summer Cup 2026',
      iconUrl: 'https://cdn.ptxsummercup.vn/badges/newbie.png',
      unlockedAt: new Date().toISOString()
    });

    // Badge 2: Chuyên gia dự đoán
    if (stats.correctPredictions >= 3) {
      badges.push({
        id: 'badge_prediction_expert',
        name: 'Chuyên gia dự đoán',
        description: 'Dự đoán chính xác từ 3 trận trở lên',
        iconUrl: 'https://cdn.ptxsummercup.vn/badges/expert.png',
        unlockedAt: new Date().toISOString()
      });
    }

    // Badge 3: Sứ giả PTX
    if (stats.referralCount >= 1) {
      badges.push({
        id: 'badge_ambassador',
        name: 'Sứ giả PTX',
        description: 'Giới thiệu thành công bạn bè tham gia',
        iconUrl: 'https://cdn.ptxsummercup.vn/badges/ambassador.png',
        unlockedAt: new Date().toISOString()
      });
    }

    this.userBadgesMap.set(userEmail, badges);
    return badges;
  }

  public getUserBadges(userEmail: string): UserBadge[] {
    return this.userBadgesMap.get(userEmail) || [];
  }

  public getDailyQuests(userEmail: string): DailyQuest[] {
    return [
      { questId: 'q1', title: 'Dự đoán kết quả 1 trận đấu hôm nay', targetCount: 1, currentProgress: 1, rewardPoints: 50, completed: true },
      { questId: 'q2', title: 'Gửi 5 tin nhắn cổ vũ trong Live Chat', targetCount: 5, currentProgress: 3, rewardPoints: 30, completed: false }
    ];
  }

  public spinLuckyWheel(userEmail: string): { rewardName: string; pointsWon: number } {
    return {
      rewardName: 'Voucher Nước ngọt PTX Cup & 100 Điểm thưởng',
      pointsWon: 100
    };
  }
}

export const gamificationBadgesService = new GamificationBadgesService();
