// PTX NEWS SERVICE – Business Capability Layer
import { dbService, NewsArticle } from '../../data-platform/supabase/db.service';

export class NewsService {
  async getLatestNews(limit = 10): Promise<NewsArticle[]> {
    return dbService.getNews(limit);
  }

  async publishArticle(article: NewsArticle): Promise<NewsArticle> {
    return dbService.saveNews(article);
  }

  async getNewsForMatch(matchId: string): Promise<NewsArticle[]> {
    const all = await dbService.getNews(50);
    return all.filter(n => n.match_id === matchId);
  }

  async getNewsCount(): Promise<number> {
    const news = await dbService.getNews(100);
    return news.length;
  }
}

export const newsService = new NewsService();
