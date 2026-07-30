// @ptx/sdk – Date Utilities
export function formatDate(date: string | Date, locale = 'vi-VN'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatTime(time: string): string {
  return time.slice(0, 5);
}

export function formatMatchDate(date: string, time?: string): string {
  const d = new Date(date);
  const dateStr = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  return time ? `${dateStr} lúc ${formatTime(time)}` : dateStr;
}

export function isToday(date: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  return date === today;
}

export function getDaysUntil(date: string): number {
  const target = new Date(date).getTime();
  const now = new Date().getTime();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}
