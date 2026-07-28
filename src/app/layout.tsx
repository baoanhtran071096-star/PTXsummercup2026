import './globals.css';

export const metadata = {
  title: 'PTX Summer Cup 2026 — Public Beta Demo Preview',
  description: 'Trải nghiệm Nền tảng Đỉnh cao Quản lý Giải đấu Bóng đá PTX Summer Cup 2.0 (Public Beta Preview)',
  openGraph: {
    title: 'PTX Summer Cup 2026 — Public Beta Demo',
    description: 'Nền tảng Quản lý Giải đấu, Live Match Console & Enterprise Digital Asset Management',
    url: 'https://ptx.vn',
    siteName: 'PTX Platform',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
