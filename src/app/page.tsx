'use client';

import React, { useState } from 'react';

export default function PublicBetaDemoPage() {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TEAMS' | 'MATCHES' | 'STANDINGS' | 'GALLERY' | 'HALL_OF_FAME'>('OVERVIEW');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackCategory, setFeedbackCategory] = useState('Giao diện');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const [matchScore, setMatchScore] = useState({ home: 2, away: 1 });
  const [events, setEvents] = useState([
    { minute: 14, type: 'GOAL_SCORED', player: 'Nguyễn Văn Huy (#10)', team: 'FC Về Nhì', details: 'Sút xa đẹp mắt 25m' },
    { minute: 32, type: 'YELLOW_CARD', player: 'Trần Tuấn Anh (#6)', team: 'FC Rồng Vàng', details: 'Phạm lỗi nguy hiểm' },
    { minute: 68, type: 'GOAL_SCORED', player: 'Phạm Minh Đức (#9)', team: 'FC Về Nhì', details: 'Đánh đầu cận thành' }
  ]);

  // Demo Data: 8 Teams with DAM Asset IDs & Logos
  const demoTeams = [
    { rank: 1, name: 'FC Về Nhì', played: 5, won: 4, drawn: 1, lost: 0, gf: 12, ga: 3, pts: 13, logo: '🛡️' },
    { rank: 2, name: 'FC Rồng Vàng', played: 5, won: 3, drawn: 2, lost: 0, gf: 10, ga: 4, pts: 11, logo: '🐉' },
    { rank: 3, name: 'FC Thăng Long', played: 5, won: 3, drawn: 1, lost: 1, gf: 9, ga: 5, pts: 10, logo: '⚡' },
    { rank: 4, name: 'FC Chiến Binh', played: 5, won: 2, drawn: 2, lost: 1, gf: 7, ga: 6, pts: 8, logo: '⚔️' },
    { rank: 5, name: 'FC Sao Vàng', played: 5, won: 2, drawn: 1, lost: 2, gf: 6, ga: 7, pts: 7, logo: '⭐' },
    { rank: 6, name: 'FC Hướng Dương', played: 5, won: 1, drawn: 1, lost: 3, gf: 5, ga: 9, pts: 4, logo: '🌻' },
    { rank: 7, name: 'FC Hoàng Gia', played: 5, won: 1, drawn: 0, lost: 4, gf: 4, ga: 11, pts: 3, logo: '👑' },
    { rank: 8, name: 'FC Tiên Phong', played: 5, won: 0, drawn: 0, lost: 5, gf: 2, ga: 14, pts: 0, logo: '🚀' }
  ];

  const handleSimulateGoal = () => {
    setMatchScore(prev => ({ ...prev, home: prev.home + 1 }));
    setEvents(prev => [
      { minute: 76, type: 'GOAL_SCORED', player: 'Nguyễn Văn Huy (#10)', team: 'FC Về Nhì', details: 'Đệm bóng cận thành (Hattrick!)' },
      ...prev
    ]);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setShowFeedbackModal(false);
      setFeedbackSubmitted(false);
      setFeedbackText('');
    }, 2000);
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '16px' }}>
      {/* 🚧 Transparent Beta Banner */}
      <div style={{ background: 'linear-gradient(90deg, rgba(255,183,3,0.2) 0%, rgba(255,77,109,0.15) 100%)', border: '1px solid rgba(255,183,3,0.4)', borderRadius: '12px', padding: '12px 20px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.2rem' }}>🚧</span>
          <div>
            <strong style={{ color: 'var(--accent-gold)' }}>PTX Platform Public Beta Preview</strong>
            <span style={{ color: 'var(--text-muted)', marginLeft: '10px', fontSize: '0.9rem' }}>Chúng tôi đang hoàn thiện sản phẩm. Mọi góp ý của bạn sẽ giúp PTX Platform ngày càng tốt hơn.</span>
          </div>
        </div>
        <button onClick={() => setShowFeedbackModal(true)} style={{ background: 'var(--accent-gold)', color: '#000', border: 'none', padding: '6px 14px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
          💬 Gửi góp ý
        </button>
      </div>

      {/* Header Bar */}
      <header className="glass-panel" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #00f2fe, #4facfe)', borderRadius: '10px', display: 'grid', placeItems: 'center', fontWeight: '800', color: '#000', fontSize: '1.1rem' }}>PTX</div>
          <div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: '800', lineHeight: 1.1 }}>PTX PLATFORM</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enterprise Tournament Engine v1.0.0</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="badge-beta">🚀 PUBLIC BETA</span>
          <button className="btn-primary" onClick={() => setShowFeedbackModal(true)}>💬 Đánh Giá Beta</button>
        </div>
      </header>

      {/* 5-Question Hero Landing Section */}
      <section className="glass-panel" style={{ padding: '36px', marginBottom: '24px', position: 'relative', overflow: 'hidden', borderRadius: '20px' }}>
        <div style={{ maxWidth: '800px', zIndex: 2, position: 'relative' }}>
          <span style={{ color: 'var(--accent-cyan)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem' }}>Nền Tảng Quản Lý Giải Đấu Đỉnh Cao</span>
          <h2 className="gradient-text" style={{ fontSize: '2.8rem', fontWeight: '800', lineHeight: 1.15, margin: '10px 0 16px 0' }}>
            PTX SUMMER CUP 2026
          </h2>
          <p style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '20px', lineHeight: 1.6 }}>
            Hệ thống điều hành bóng đá tự động hóa 100%: <strong>Lập lịch Round Robin trong 2 giây</strong>, <strong>Live Match Console realtime</strong> và <strong>Enterprise Digital Asset Management (DAM v1.2)</strong>.
          </p>

          {/* 3 Main Action CTAs */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => setActiveTab('MATCHES')}>⚡ Xem Demo Live Console</button>
            <button style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid var(--border-glass)', padding: '12px 24px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }} onClick={() => alert('Chức năng Đăng ký Đội đang mở cho Trưởng đội!')}>
              📝 Đăng Ký Đội Bóng
            </button>
            <button style={{ background: 'transparent', color: 'var(--accent-cyan)', border: 'none', padding: '12px 16px', fontWeight: '700', cursor: 'pointer' }} onClick={() => setActiveTab('STANDINGS')}>
              🏆 Theo Dõi Giải Đấu →
            </button>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { key: 'OVERVIEW', label: '🌐 Tổng Quan Demo' },
          { key: 'TEAMS', label: '🛡️ 8 Đội Bóng (Live Data)' },
          { key: 'MATCHES', label: '⚡ Live Match Console' },
          { key: 'STANDINGS', label: '🏆 Bảng Xếp Hạng' },
          { key: 'GALLERY', label: '📸 DAM Photo Gallery' },
          { key: 'HALL_OF_FAME', label: '🏅 Hall of Fame' }
        ].map(tab => (
          <button
            key={tab.key}
            className="glass-panel"
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              padding: '10px 18px',
              border: activeTab === tab.key ? '1px solid var(--accent-cyan)' : '1px solid var(--border-glass)',
              background: activeTab === tab.key ? 'rgba(0, 242, 254, 0.15)' : 'var(--bg-card)',
              color: activeTab === tab.key ? 'var(--accent-cyan)' : 'var(--text-muted)',
              fontWeight: '700',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>🚀 Tính Năng Nổi Bật Bản Beta Preview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>⚡</div>
                <h4 style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>Scheduling Engine RPC</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Lập lịch thi đấu tự động xử lý xung đột sân đấu trong 2.1 ms.</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📡</div>
                <h4 style={{ fontWeight: '700', color: 'var(--accent-green)' }}>MatchEventBus Realtime</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Độ trễ phát sóng diễn biến bàn thắng & thẻ phạt &lt; 0.1 ms.</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🖼️</div>
                <h4 style={{ fontWeight: '700', color: 'var(--accent-gold)' }}>Enterprise DAM v1.2</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Quản lý tài sản số WebP biến thể tự động với 0% URL thô.</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📜</div>
                <h4 style={{ fontWeight: '700', color: 'var(--accent-red)' }}>OpenAPI v3.0 REST API</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Chuẩn API Contract sẵn sàng kết nối Mobile App & Web Frontend.</p>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>📊 Live APM & Monitoring</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Trạng thái APM:</span>
                <span style={{ fontWeight: '700', color: 'var(--accent-green)' }}>100% Operational</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>API Error Rate:</span>
                <span style={{ fontWeight: '700', color: 'var(--accent-green)' }}>0.00%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>DAM Storage Latency:</span>
                <span style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>0.15 ms</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Đội bóng tham gia:</span>
                <span style={{ fontWeight: '700', color: 'var(--accent-gold)' }}>8/8 Đội</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: TEAMS */}
      {activeTab === 'TEAMS' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>🛡️ Danh Sách 8 Đội Bóng Tham Gia (Live Demo Data)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {demoTeams.map(t => (
              <div key={t.name} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{t.logo}</div>
                <h4 style={{ fontWeight: '700', fontSize: '1.1rem' }}>{t.name}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Logo Asset: `ast_logo_{t.name.toLowerCase().replace(/ /g, '_')}`</p>
                <span style={{ display: 'inline-block', marginTop: '10px', fontSize: '0.75rem', padding: '4px 10px', borderRadius: '12px', background: 'rgba(0,242,254,0.1)', color: 'var(--accent-cyan)', fontWeight: '700' }}>
                  {t.pts} Điểm | {t.gf} Bàn Thắng
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: MATCHES */}
      {activeTab === 'MATCHES' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="live-indicator"></span>
                <span style={{ fontWeight: '800', color: 'var(--accent-red)' }}>LIVE MATCH CONSOLE</span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', background: 'rgba(255, 255, 255, 0.05)', padding: '4px 12px', borderRadius: '8px' }}>Phút 76&apos;</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '16px', background: 'rgba(0,0,0,0.3)', padding: '24px', borderRadius: '12px', marginBottom: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>🛡️</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>FC Về Nhì</h3>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '3.2rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                  {matchScore.home} - {matchScore.away}
                </span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>🐉</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>FC Rồng Vàng</h3>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn-primary" onClick={handleSimulateGoal}>⚽ Simulate Realtime Goal Event</button>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>📜 Realtime Event Stream</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {events.map((evt, idx) => (
                <div key={idx} style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', borderLeft: evt.type === 'GOAL_SCORED' ? '4px solid var(--accent-green)' : '4px solid var(--accent-gold)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)', marginRight: '8px' }}>{evt.minute}&apos;</span>
                  <span style={{ fontWeight: '700' }}>{evt.player}</span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{evt.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: STANDINGS */}
      {activeTab === 'STANDINGS' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>🏆 Bảng Xếp Hạng PTX Summer Cup 2026</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <th style={{ padding: '12px' }}>Hạng</th>
                <th style={{ padding: '12px' }}>Đội Bóng</th>
                <th style={{ padding: '12px' }}>St</th>
                <th style={{ padding: '12px' }}>T</th>
                <th style={{ padding: '12px' }}>H</th>
                <th style={{ padding: '12px' }}>B</th>
                <th style={{ padding: '12px' }}>Bt</th>
                <th style={{ padding: '12px' }}>Bb</th>
                <th style={{ padding: '12px' }}>Điểm</th>
              </tr>
            </thead>
            <tbody>
              {demoTeams.map(t => (
                <tr key={t.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px', fontWeight: '700', color: t.rank <= 2 ? 'var(--accent-gold)' : 'inherit' }}>#{t.rank}</td>
                  <td style={{ padding: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{t.logo}</span>
                    <span>{t.name}</span>
                  </td>
                  <td style={{ padding: '12px' }}>{t.played}</td>
                  <td style={{ padding: '12px' }}>{t.won}</td>
                  <td style={{ padding: '12px' }}>{t.drawn}</td>
                  <td style={{ padding: '12px' }}>{t.lost}</td>
                  <td style={{ padding: '12px' }}>{t.gf}</td>
                  <td style={{ padding: '12px' }}>{t.ga}</td>
                  <td style={{ padding: '12px', fontWeight: '800', color: 'var(--accent-cyan)' }}>{t.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Interactive Feedback Modal */}
      {showFeedbackModal && (
        <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'grid', placeItems: 'center', padding: '16px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '32px', position: 'relative' }}>
            <button onClick={() => setShowFeedbackModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✖</button>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '8px' }}>💬 Gửi Góp Ý Public Beta</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>Ý kiến của bạn sẽ biến thành backlog cải tiến cho các bản vá v1.0.x!</p>

            {feedbackSubmitted ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎉</div>
                <h4 style={{ fontSize: '1.2rem', color: 'var(--accent-green)' }}>Cảm Ơn Phản Hồi Quý Giá Của Bạn!</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>Đã ghi nhận góp ý vào PTX Feedback Backlog Engine.</p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Đánh giá trải nghiệm:</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} onClick={() => setFeedbackRating(star)} style={{ fontSize: '1.6rem', cursor: 'pointer', opacity: star <= feedbackRating ? 1 : 0.3 }}>⭐</span>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Hạng mục góp ý:</label>
                  <select value={feedbackCategory} onChange={e => setFeedbackCategory(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-glass)' }}>
                    <option value="Giao diện">Giao diện (UI/UX)</option>
                    <option value="Tốc độ">Tốc độ & Hiệu năng</option>
                    <option value="Dễ sử dụng">Tính dễ sử dụng</option>
                    <option value="Báo lỗi">Báo lỗi kỹ thuật</option>
                    <option value="Đề xuất">Đề xuất tính năng mới</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Chi tiết góp ý ("Điều gì khiến bạn mất nhiều thời gian nhất?"):</label>
                  <textarea required rows={4} value={feedbackText} onChange={e => setFeedbackText(e.target.value)} placeholder="Nhập chia sẻ chi tiết của bạn tại đây..." style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-glass)', resize: 'vertical' }}></textarea>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>🚀 Gửi Đánh Giá Trực Tiếp</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
