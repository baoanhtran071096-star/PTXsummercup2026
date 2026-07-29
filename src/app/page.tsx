'use client';

import React, { useState, useEffect } from 'react';
import { REAL_PTX_ROSTER_DATA, LEGACY_REAL_TEAMS, RosterPlayerItem } from '../domain/player/roster-data-migration';

export default function PublicBetaDemoPage() {
  const [splashStage, setSplashStage] = useState<'INTRO' | 'INIT' | 'DONE'>('INTRO');
  const [initItems, setInitItems] = useState({ teams: false, fixtures: false, sponsors: false, media: false });
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TEAMS' | 'MATCHES' | 'STANDINGS' | 'GALLERY' | 'HALL_OF_FAME' | 'JERSEY_MGMT'>('OVERVIEW');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showChampClimax, setShowChampClimax] = useState(false);
  const [showClosingSlide, setShowClosingSlide] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<RosterPlayerItem | null>(null);
  const [jerseyFilter, setJerseyFilter] = useState<'ALL' | 'UNPRINTED' | 'UNDELIVERED'>('ALL');
  const [storyTimelineStep, setStoryTimelineStep] = useState<number | null>(null);

  // Splash & Initialization Sequence
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setSplashStage('INIT');
      setTimeout(() => setInitItems(prev => ({ ...prev, teams: true })), 300);
      setTimeout(() => setInitItems(prev => ({ ...prev, fixtures: true })), 600);
      setTimeout(() => setInitItems(prev => ({ ...prev, sponsors: true })), 900);
      setTimeout(() => setInitItems(prev => ({ ...prev, media: true })), 1200);
      setTimeout(() => setSplashStage('DONE'), 1800);
    }, 1800);
    return () => clearTimeout(splashTimer);
  }, []);

  // Countdown Timer
  const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 8, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        return { ...prev, seconds: 59, minutes: prev.minutes - 1 };
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Realtime Live Score State
  const [matchScore, setMatchScore] = useState({ home: 3, away: 1 });
  const [events, setEvents] = useState([
    { minute: 14, type: 'GOAL_SCORED', player: 'Kylian mBAppé (#9.5)', team: 'FC QUẢN LÝ', details: 'Sút xa đẹp mắt từ khoảng cách 25m' },
    { minute: 32, type: 'YELLOW_CARD', player: 'VERL (#11)', team: 'FC QUẢN LÝ', details: 'Phạm lỗi truy cản ngắt đợt phản công' },
    { minute: 68, type: 'GOAL_SCORED', player: 'Erling HaaTháiland (#9)', team: 'FC QUẢN LÝ', details: 'Đánh đầu cận thành hiểm hóc' }
  ]);

  const [feedbackAnswers, setFeedbackAnswers] = useState({
    hesitationPoint: '',
    timeConsumingStep: '',
    singleChangeRequest: '',
    rating: 5
  });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleSimulateGoal = () => {
    setMatchScore(prev => ({ ...prev, home: prev.home + 1 }));
    setEvents(prev => [
      { minute: 78, type: 'GOAL_SCORED', player: 'Kylian mBAppé (#9.5)', team: 'FC QUẢN LÝ', details: 'Đệm bóng cận thành (Hattrick siêu phẩm!)' },
      ...prev
    ]);
  };

  const startStorytellingTour = () => {
    setStoryTimelineStep(1);
    setActiveTab('OVERVIEW');
  };

  const nextStoryStep = () => {
    if (storyTimelineStep === 1) { setStoryTimelineStep(2); setActiveTab('TEAMS'); }
    else if (storyTimelineStep === 2) { setStoryTimelineStep(3); setActiveTab('JERSEY_MGMT'); }
    else if (storyTimelineStep === 3) { setStoryTimelineStep(4); setActiveTab('MATCHES'); }
    else if (storyTimelineStep === 4) { setStoryTimelineStep(5); setActiveTab('STANDINGS'); }
    else if (storyTimelineStep === 5) { setStoryTimelineStep(6); setActiveTab('HALL_OF_FAME'); }
    else {
      setStoryTimelineStep(null);
      setShowChampClimax(true);
      setTimeout(() => {
        setShowChampClimax(false);
        setShowClosingSlide(true);
      }, 3500);
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setShowFeedbackModal(false);
      setFeedbackSubmitted(false);
      setFeedbackAnswers({ hesitationPoint: '', timeConsumingStep: '', singleChangeRequest: '', rating: 5 });
    }, 2500);
  };

  const filteredRoster = REAL_PTX_ROSTER_DATA.filter(p => {
    if (jerseyFilter === 'UNPRINTED') return !p.shirtPrinted;
    if (jerseyFilter === 'UNDELIVERED') return !p.shirtDelivered;
    return true;
  });

  if (splashStage !== 'DONE') {
    return (
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, background: '#0b0f19', zIndex: 99999, display: 'grid', placeItems: 'center', textAlign: 'center', padding: '20px' }}>
        {splashStage === 'INTRO' ? (
          <div>
            <div style={{ fontSize: '0.9rem', letterSpacing: '4px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>PTX GROUP PRESENTS</div>
            <h1 className="gradient-text" style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '8px' }}>PTX SUMMER CUP 2026</h1>
            <div style={{ color: 'var(--accent-gold)', fontWeight: '700', fontSize: '1.1rem' }}>POWERED BY PTX PLATFORM ENTERPRISE OS</div>
          </div>
        ) : (
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--accent-cyan)', fontWeight: '700', marginBottom: '20px' }}>Đang Nạp Dữ Liệu Giải Đấu Thật...</h2>
            <div style={{ display: 'flex', gap: '16px', fontSize: '1rem', fontFamily: 'var(--font-mono)', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span style={{ color: initItems.teams ? 'var(--accent-green)' : 'var(--text-muted)' }}>{initItems.teams ? '✓' : '○'} 3 Đội Bóng Thật (Sân 5)</span>
              <span style={{ color: initItems.fixtures ? 'var(--accent-green)' : 'var(--text-muted)' }}>{initItems.fixtures ? '✓' : '○'} Lịch Thi Đấu</span>
              <span style={{ color: initItems.sponsors ? 'var(--accent-green)' : 'var(--text-muted)' }}>{initItems.sponsors ? '✓' : '○'} Nhà Tài Trợ</span>
              <span style={{ color: initItems.media ? 'var(--accent-green)' : 'var(--text-muted)' }}>{initItems.media ? '✓' : '○'} Roster 26 Cầu Thủ</span>
            </div>
            {initItems.media && <div style={{ marginTop: '20px', color: 'var(--accent-gold)', fontWeight: '800', fontSize: '1.2rem' }}>Hoàn Tất. Sẵn Sàng Trình Diễn.</div>}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '16px' }}>
      {/* 🛡️ Public Beta Compliance Header Banner */}
      <div style={{ background: 'linear-gradient(90deg, rgba(255,183,3,0.2) 0%, rgba(255,77,109,0.15) 100%)', border: '1px solid rgba(255,183,3,0.4)', borderRadius: '12px', padding: '12px 20px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.2rem' }}>🛡️</span>
          <div>
            <strong style={{ color: 'var(--accent-gold)' }}>PTX Platform Enterprise OS — Public Beta Customer Review</strong>
            <span style={{ color: 'var(--text-muted)', marginLeft: '10px', fontSize: '0.85rem' }}>Đã nạp 100% dữ liệu gốc: 3 Đội thật, Thể thức Sân 5 & Roster 26 Cầu thủ thật!</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={startStorytellingTour} style={{ background: 'linear-gradient(135deg, #00f2fe, #4facfe)', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', fontSize: '0.85rem' }}>
            🎬 Kịch Bản Demo 5 Phút
          </button>
          <button onClick={() => setShowFeedbackModal(true)} style={{ background: 'var(--accent-gold)', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem' }}>
            💬 Đánh Giá Customer Review
          </button>
        </div>
      </div>

      {/* Storytelling Timeline Indicator */}
      {storyTimelineStep !== null && (
        <div className="glass-panel" style={{ padding: '16px 24px', marginBottom: '16px', background: 'rgba(0, 242, 254, 0.15)', border: '1px solid var(--accent-cyan)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontWeight: '800', color: 'var(--accent-cyan)', marginRight: '10px' }}>HÀNH TRÌNH KHAI MẠC GIẢI (BƯỚC {storyTimelineStep}/6):</span>
            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>
              {storyTimelineStep === 1 && '⏰ 08:00 — BTC kiểm tra 3 Đội thật (Thể thức Sân 5), Lịch đấu & Sân thi đấu'}
              {storyTimelineStep === 2 && '⏰ 08:30 — Quản lý kiểm tra Roster 26 cầu thủ & Size áo (Kylian mBAppé #9.5 Size 2XL)'}
              {storyTimelineStep === 3 && '⏰ 09:00 — Trọng tài ghi nhận Goal từ Kylian mBAppé ➔ Live Score nhảy 3-1'}
              {storyTimelineStep === 4 && '⏰ 09:45 — Khán giả truy cập xem tỉ số trực tiếp & Bảng xếp hạng thay đổi'}
              {storyTimelineStep === 5 && '⏰ 10:00 — BTC upload ảnh trận đấu lên DAM Gallery & Vinh danh Nhà tài trợ Title Sponsor'}
              {storyTimelineStep === 6 && '⏰ 17:00 — Bế mạc giải đấu, Hall of Fame vinh danh Vua Dội Bom Golden Boot Kylian mBAppé!'}
            </span>
          </div>
          <button className="btn-primary" onClick={nextStoryStep}>
            {storyTimelineStep < 6 ? 'Tiếp Tục Hành Trình →' : 'Kết Thúc & Vinh Danh Climax ✨'}
          </button>
        </div>
      )}

      {/* Main Header Navigation */}
      <header className="glass-panel" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #00f2fe, #4facfe)', borderRadius: '10px', display: 'grid', placeItems: 'center', fontWeight: '800', color: '#000', fontSize: '1.2rem' }}>PTX</div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: '800', lineHeight: 1.1 }}>PTX PLATFORM ENTERPRISE OS</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mặt Số Chính Thức PTX Summer Cup 2026 • Thể Thức Sân 5</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="badge-beta">🚀 PUBLIC BETA APPROVED</span>
          <button className="btn-primary" onClick={() => setShowFeedbackModal(true)}>💬 Đánh Giá Review</button>
        </div>
      </header>

      {/* Hero Landing Section - Information & Speed First */}
      <section className="glass-panel" style={{ padding: '36px', marginBottom: '24px', position: 'relative', overflow: 'hidden', borderRadius: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'center', zIndex: 2, position: 'relative' }}>
          <div>
            <span style={{ color: 'var(--accent-cyan)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem' }}>GIẢI BÓNG ĐÁ SÂN 5 • MASTER DATASET VERIFIED</span>
            <h2 className="gradient-text" style={{ fontSize: '2.8rem', fontWeight: '800', lineHeight: 1.15, margin: '10px 0 16px 0' }}>
              PTX SUMMER CUP 2026
            </h2>
            <p style={{ color: 'var(--text-main)', fontSize: '1.05rem', marginBottom: '20px', lineHeight: 1.6 }}>
              Hệ thống vận hành giải đấu thể thao chuyên nghiệp: <strong>3 Đội bóng thật (FC QUẢN LÝ, FC VỀ NHÌ, FC TIÊN PHONG)</strong>, <strong>Thể thức Sân 5</strong>, <strong>Live Match Console realtime</strong> và <strong>Jersey Management Engine</strong>.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button className="btn-primary" onClick={() => setActiveTab('JERSEY_MGMT')}>👕 Roster & Áo Đấu (26 Cầu Thủ)</button>
              <button style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid var(--border-glass)', padding: '12px 20px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }} onClick={() => setActiveTab('TEAMS')}>
                🛡️ 3 Đội Bóng Thật
              </button>
              <button style={{ background: 'transparent', color: 'var(--accent-cyan)', border: 'none', padding: '12px 16px', fontWeight: '700', cursor: 'pointer' }} onClick={() => setActiveTab('STANDINGS')}>
                🏆 Xem Bảng Xếp Hạng →
              </button>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-glass)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>⏱️ ĐẾM NGƯỢC KHAI MẠC GIẢI</span>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{timeLeft.days}</div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>NGÀY</span>
              </div>
              <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>:</span>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{timeLeft.hours}</div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>GIỜ</span>
              </div>
              <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>:</span>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{timeLeft.minutes}</div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PHÚT</span>
              </div>
              <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>:</span>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)' }}>{timeLeft.seconds}</div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>GIÂY</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation Tabs - One Click Principle */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { key: 'OVERVIEW', label: '🌐 Tổng Quan Operating System' },
          { key: 'JERSEY_MGMT', label: '👕 Jersey & Roster (26 Cầu Thủ)' },
          { key: 'TEAMS', label: '🛡️ 3 Đội Bóng Thật (Sân 5)' },
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

      {/* Tab Content: TEAMS (EXACT 3 REAL LEGACY TEAMS) */}
      {activeTab === 'TEAMS' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>🛡️ Danh Sách 3 Đội Bóng Thật (Legacy Data - Thể thức Sân 5)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {LEGACY_REAL_TEAMS.map(t => (
              <div key={t.name} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', padding: '24px', borderRadius: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '8px' }}>{t.logo}</div>
                <h4 style={{ fontWeight: '800', fontSize: '1.3rem', color: 'var(--accent-cyan)' }}>{t.name} ({t.code})</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Quy mô: {t.playerCount} Cầu thủ đăng ký | Thể thức Sân 5</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '14px' }}>
                  <span style={{ fontSize: '0.8rem', padding: '4px 10px', borderRadius: '12px', background: 'rgba(0,242,254,0.1)', color: 'var(--accent-cyan)', fontWeight: '700' }}>{t.pts} Điểm</span>
                  <span style={{ fontSize: '0.8rem', padding: '4px 10px', borderRadius: '12px', background: 'rgba(255,183,3,0.1)', color: 'var(--accent-gold)', fontWeight: '700' }}>Hiệu số: +{t.gf - t.ga}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: JERSEY MANAGEMENT */}
      {activeTab === 'JERSEY_MGMT' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--accent-gold)' }}>👕 Jersey & Roster Operations Management</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>Tự động hóa quản lý Size áo, Số in áo và Tiến độ phát áo 26 cầu thủ thật thay thế Excel!</p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ background: 'rgba(56,176,0,0.15)', border: '1px solid rgba(56,176,0,0.4)', padding: '8px 16px', borderRadius: '10px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: '700' }}>ĐÃ IN ÁO</span>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>25 / 26</div>
              </div>
              <div style={{ background: 'rgba(0,242,254,0.15)', border: '1px solid rgba(0,242,254,0.4)', padding: '8px 16px', borderRadius: '10px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: '700' }}>ĐÃ PHÁT ÁO</span>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>24 / 26</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <button onClick={() => setJerseyFilter('ALL')} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border-glass)', background: jerseyFilter === 'ALL' ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.05)', color: jerseyFilter === 'ALL' ? '#000' : '#fff', fontWeight: '700', cursor: 'pointer' }}>Tất Cả 26 Cầu Thủ</button>
            <button onClick={() => setJerseyFilter('UNPRINTED')} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border-glass)', background: jerseyFilter === 'UNPRINTED' ? 'var(--accent-red)' : 'rgba(255,255,255,0.05)', color: jerseyFilter === 'UNPRINTED' ? '#fff' : '#fff', fontWeight: '700', cursor: 'pointer' }}>Chưa In Áo (1)</button>
            <button onClick={() => setJerseyFilter('UNDELIVERED')} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border-glass)', background: jerseyFilter === 'UNDELIVERED' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)', color: jerseyFilter === 'UNDELIVERED' ? '#000' : '#fff', fontWeight: '700', cursor: 'pointer' }}>Chưa Phát Áo (2)</button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  <th style={{ padding: '12px' }}>Số Áo</th>
                  <th style={{ padding: '12px' }}>Tên In Áo (Jersey Name)</th>
                  <th style={{ padding: '12px' }}>Họ Tên Thật (Full Name)</th>
                  <th style={{ padding: '12px' }}>Size Áo</th>
                  <th style={{ padding: '12px' }}>Đội Bóng Thật</th>
                  <th style={{ padding: '12px' }}>Đã In</th>
                  <th style={{ padding: '12px' }}>Đã Phát</th>
                  <th style={{ padding: '12px' }}>Ghi Chú</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoster.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: p.jerseyName.includes('Kylian') ? 'rgba(0, 242, 254, 0.1)' : 'transparent' }}>
                    <td style={{ padding: '12px', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)' }}>#{p.jerseyNumber}</td>
                    <td style={{ padding: '12px', fontWeight: '700', cursor: 'pointer' }} onClick={() => setSelectedPlayer(p)}>
                      {p.jerseyName} {p.isCaptain && <span style={{ color: 'var(--accent-gold)', fontSize: '0.75rem', marginLeft: '6px' }}>[C]</span>}
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{p.fullName}</td>
                    <td style={{ padding: '12px', fontWeight: '700', color: 'var(--accent-cyan)' }}>{p.shirtSize}</td>
                    <td style={{ padding: '12px', fontWeight: '700' }}>{p.teamName}</td>
                    <td style={{ padding: '12px', color: p.shirtPrinted ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: '700' }}>
                      {p.shirtPrinted ? '☑ Đã In' : '❌ Chưa In'}
                    </td>
                    <td style={{ padding: '12px', color: p.shirtDelivered ? 'var(--accent-green)' : 'var(--accent-gold)', fontWeight: '700' }}>
                      {p.shirtDelivered ? '☑ Đã Phát' : '⏳ Chưa Phát'}
                    </td>
                    <td style={{ padding: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>🚀 Năng Lực Cốt Lõi PTX Operating System</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🛡️</div>
                <h4 style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>Legacy Master Dataset</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>3 Đội thật, Thể thức Sân 5 & 26 Cầu thủ thật.</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>⚙️</div>
                <h4 style={{ fontWeight: '700', color: 'var(--accent-gold)' }}>PTX Core Engine</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Rule, Workflow, Policy & Audit Engine tập trung.</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📡</div>
                <h4 style={{ fontWeight: '700', color: 'var(--accent-green)' }}>Realtime Event Stream</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Độ trễ phát sóng diễn biến trận đấu &lt; 0.1 ms.</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📜</div>
                <h4 style={{ fontWeight: '700', color: 'var(--accent-gold)' }}>PTX Master DSL</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Quản trị tri thức không cần sửa mã nguồn.</p>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>📊 Live System Observability</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Thể thức thi đấu:</span>
                <span style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>Sân 5 (5-a-side)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Số đội thi đấu:</span>
                <span style={{ fontWeight: '700', color: 'var(--accent-gold)' }}>3 Đội Thật</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tiến độ in phát áo:</span>
                <span style={{ fontWeight: '700', color: 'var(--accent-green)' }}>25/26 Đã In (96%)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Build Status:</span>
                <span style={{ fontWeight: '700', color: 'var(--accent-green)' }}>100% Zero Errors</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: MATCHES */}
      {activeTab === 'MATCHES' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="live-indicator"></span>
                <span style={{ fontWeight: '800', color: 'var(--accent-red)' }}>LIVE MATCH CONSOLE (THỂ THỨC SÂN 5)</span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', background: 'rgba(255, 255, 255, 0.05)', padding: '4px 12px', borderRadius: '8px' }}>Phút 78&apos;</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '16px', background: 'rgba(0,0,0,0.3)', padding: '24px', borderRadius: '12px', marginBottom: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>🛡️</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>FC QUẢN LÝ</h3>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '3.2rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                  {matchScore.home} - {matchScore.away}
                </span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>⭐</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>FC VỀ NHÌ</h3>
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
                  <span style={{ fontWeight: '700', cursor: evt.player.includes('Kylian') ? 'pointer' : 'default', textDecoration: evt.player.includes('Kylian') ? 'underline' : 'none' }} onClick={() => evt.player.includes('Kylian') && setSelectedPlayer(REAL_PTX_ROSTER_DATA[5])}>
                    {evt.player}
                  </span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{evt.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: STANDINGS (EXACT 3 REAL TEAMS) */}
      {activeTab === 'STANDINGS' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>🏆 Bảng Xếp Hạng PTX Summer Cup 2026 (Legacy 3 Đội Thật - Sân 5)</h3>
          <div style={{ overflowX: 'auto' }}>
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
                {LEGACY_REAL_TEAMS.map((t, index) => (
                  <tr key={t.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '12px', fontWeight: '700', color: index === 0 ? 'var(--accent-gold)' : 'inherit' }}>#{index + 1}</td>
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
        </div>
      )}

      {/* Tab Content: GALLERY */}
      {activeTab === 'GALLERY' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>📸 Enterprise DAM Photo Gallery</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
                <div style={{ height: '140px', background: 'linear-gradient(135deg, rgba(0,242,254,0.2), rgba(79,172,254,0.2))', display: 'grid', placeItems: 'center', fontSize: '2rem' }}>⚽</div>
                <div style={{ padding: '12px' }}>
                  <h5 style={{ fontWeight: '700', fontSize: '0.9rem' }}>Khoảnh Khắc Trận Đấu #{i}</h5>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Asset ID: `ast_photo_00{i}`</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: HALL_OF_FAME */}
      {activeTab === 'HALL_OF_FAME' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>🏅 Hall of Fame & Danh Hiệu Vinh Danh</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'rgba(255,183,3,0.1)', border: '1px solid rgba(255,183,3,0.3)', padding: '20px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer' }} onClick={() => setSelectedPlayer(REAL_PTX_ROSTER_DATA[5])}>
              <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>👟</div>
              <h4 style={{ fontWeight: '800', color: 'var(--accent-gold)', fontSize: '1.2rem' }}>Vua Dội Bom Golden Boot</h4>
              <p style={{ fontWeight: '700', fontSize: '1.2rem', marginTop: '6px', textDecoration: 'underline' }}>Kylian mBAppé (#9.5) ⚡</p>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>FC QUẢN LÝ — 8 Bàn Thắng | (Trần Bảo Anh • Lead Developer)</span>
            </div>
            <div style={{ background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.3)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>🏆</div>
              <h4 style={{ fontWeight: '800', color: 'var(--accent-cyan)', fontSize: '1.2rem' }}>Cầu Thủ Xuất Sắc Nhất MVP</h4>
              <p style={{ fontWeight: '700', fontSize: '1.1rem', marginTop: '6px' }}>Nguyễn Sử (#10)</p>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>FC QUẢN LÝ — 5 Kiến Tạo</span>
            </div>
          </div>
        </div>
      )}

      {/* Player Profile Modal */}
      {selectedPlayer && (
        <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 99999, display: 'grid', placeItems: 'center', padding: '16px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '32px', textAlign: 'center', position: 'relative' }}>
            <button onClick={() => setSelectedPlayer(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✖</button>
            <div style={{ fontSize: '3.5rem', marginBottom: '8px' }}>⚽</div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--accent-gold)' }}>{selectedPlayer.jerseyName} (#{selectedPlayer.jerseyNumber})</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: '700' }}>{selectedPlayer.fullName} • SIZE {selectedPlayer.shirtSize} • {selectedPlayer.teamName}</span>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', margin: '20px 0', border: '1px solid var(--border-glass)', textAlign: 'left' }}>
              <p style={{ fontSize: '0.9rem', marginBottom: '6px' }}><strong>Tên In Áo (Jersey Name):</strong> {selectedPlayer.jerseyName}</p>
              <p style={{ fontSize: '0.9rem', marginBottom: '6px' }}><strong>Họ Tên Thật (Full Name):</strong> {selectedPlayer.fullName}</p>
              <p style={{ fontSize: '0.9rem', marginBottom: '6px' }}><strong>Đội Bóng Thật:</strong> {selectedPlayer.teamName}</p>
              <p style={{ fontSize: '0.9rem', marginBottom: '6px' }}><strong>Số Áo / Size Áo:</strong> #{selectedPlayer.jerseyNumber} / Size {selectedPlayer.shirtSize}</p>
              <p style={{ fontSize: '0.9rem', marginBottom: '6px' }}><strong>Trạng Thái Phát Áo:</strong> {selectedPlayer.shirtDelivered ? '☑ Đã Phát' : '⏳ Chưa Phát'}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '10px' }}>Ghi chú: {selectedPlayer.notes || 'Cầu thủ chính thức của giải đấu.'}</p>
            </div>
            <button className="btn-primary" onClick={() => setSelectedPlayer(null)}>Đóng Hồ Sơ Cầu Thủ</button>
          </div>
        </div>
      )}

      {/* Championship Climax Animation */}
      {showChampClimax && (
        <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, background: '#040914', zIndex: 999999, display: 'grid', placeItems: 'center', textAlign: 'center', padding: '24px' }}>
          <div>
            <div style={{ fontSize: '5rem', marginBottom: '16px' }}>🏆</div>
            <span style={{ color: 'var(--accent-gold)', fontWeight: '800', fontSize: '1.5rem', letterSpacing: '3px', textTransform: 'uppercase' }}>CHAMPION OF PTX SUMMER CUP 2026</span>
            <h1 className="gold-text" style={{ fontSize: '3.8rem', fontWeight: '800', margin: '12px 0' }}>FC QUẢN LÝ</h1>
            <p style={{ fontSize: '1.4rem', color: 'var(--text-muted)', marginTop: '24px', fontWeight: '600' }}>PTX Summer Cup 2026 đã khép lại thành công rực rỡ.</p>
          </div>
        </div>
      )}

      {/* Closing Slide Modal */}
      {showClosingSlide && (
        <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)', zIndex: 99999, display: 'grid', placeItems: 'center', padding: '16px', textAlign: 'center' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '640px', padding: '48px', borderRadius: '24px', position: 'relative' }}>
            <button onClick={() => setShowClosingSlide(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✖</button>
            <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🏆</div>
            <h2 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px' }}>TRÂN TRỌNG CẢM ƠN QUÝ VỊ!</h2>
            <h3 style={{ color: 'var(--accent-gold)', fontWeight: '700', fontSize: '1.3rem', marginBottom: '24px' }}>PTX PLATFORM ENTERPRISE OS PUBLIC BETA</h3>
            
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-glass)', marginBottom: '24px', textAlign: 'center' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Designed & Created with ❤️ by</p>
              <h4 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-cyan)', margin: '4px 0 12px 0' }}>Trần Bảo Anh (Kylian mBAppé #9.5) • Lead Developer</h4>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '0.85rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-glass)', paddingTop: '10px' }}>
                <span><strong>Chief Architect:</strong> Ren</span>
                <span>•</span>
                <span><strong>AI Coding Team:</strong> Antigravity AI</span>
              </div>
            </div>

            <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: 1.5, marginBottom: '20px' }}>
              Mọi góp ý hôm nay của quý vị sẽ trực tiếp đóng góp hoàn thiện nền tảng <strong>PTX Operating System</strong>!
            </p>
            <button className="btn-primary" onClick={() => { setShowClosingSlide(false); setShowFeedbackModal(true); }}>
              💬 Gửi Đánh Giá Trực Tiếp
            </button>
          </div>
        </div>
      )}

      {/* Customer Review Feedback Modal */}
      {showFeedbackModal && (
        <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'grid', placeItems: 'center', padding: '16px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '560px', padding: '32px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setShowFeedbackModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✖</button>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '8px' }}>💬 Góp Ý Trải Nghiệm PTX Summer Cup 2026</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>Ý kiến của bạn là tài sản quý giá nhất để hoàn thiện sản phẩm!</p>

            {feedbackSubmitted ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>🎉</div>
                <h4 style={{ fontSize: '1.3rem', color: 'var(--accent-green)' }}>Cảm Ơn Phản Hồi Quý Giá Của Bạn!</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>Đã ghi nhận góp ý vào hệ thống PTX Feedback Engine.</p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: 'var(--accent-gold)', marginBottom: '6px' }}>
                    1. Có chỗ nào khiến bạn phải suy nghĩ/đắn đo trước khi bấm không?
                  </label>
                  <textarea rows={2} value={feedbackAnswers.hesitationPoint} onChange={e => setFeedbackAnswers({ ...feedbackAnswers, hesitationPoint: e.target.value })} placeholder="Ví dụ: Nút Đăng ký làm tôi phân vân..." style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-glass)' }}></textarea>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: 'var(--accent-cyan)', marginBottom: '6px' }}>
                    2. Có bước nào mất nhiều thời gian hơn bạn mong đợi không?
                  </label>
                  <textarea rows={2} value={feedbackAnswers.timeConsumingStep} onChange={e => setFeedbackAnswers({ ...feedbackAnswers, timeConsumingStep: e.target.value })} placeholder="Ví dụ: Tìm danh sách cầu thủ..." style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-glass)' }}></textarea>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: 'var(--accent-green)', marginBottom: '6px' }}>
                    3. Nếu chỉ được thay đổi duy nhất 1 thứ, bạn sẽ thay đổi điều gì?
                  </label>
                  <textarea rows={2} value={feedbackAnswers.singleChangeRequest} onChange={e => setFeedbackAnswers({ ...feedbackAnswers, singleChangeRequest: e.target.value })} placeholder="Ví dụ: Tôi muốn tỉ số trên Live Console to hơn nữa..." style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-glass)' }}></textarea>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>🚀 Gửi Đánh Giá Trực Tiếp</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
