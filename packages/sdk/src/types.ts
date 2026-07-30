// @ptx/sdk – Shared Types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export type Tournament = {
  id: string;
  name: string;
  season: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'finished';
};
