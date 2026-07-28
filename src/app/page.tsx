'use client';

import React, { useState } from 'react';

export default function PublicBetaDemoPage() {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'MATCHES' | 'STANDINGS' | 'GALLERY'>('OVERVIEW');
  const [matchScore, setMatchScore] = useState({ home: 2, away: 1 });
  const [events, setEvents] = useState([
    { minute: 14, type: 'GOAL_SCORED', player: 'Nguyễn Văn Huy (#10)', team: 'FC Về Nhì', details: 'Sút xa đẹp mắt 25m' },
    { minute: 32, type: 'YELLOW_CARD', player: 'Trần Tuấn Anh (#6)', team: 'FC Rồng Vàng', details: 'Phạm lỗi nguy hiểm' },
    { minute: 68, type: 'GOAL_SCORED', player: 'Phạm Minh Đức (#9)', team: 'FC Về Nhì', details: 'Đánh đầu cận thành' }
  ]);

  const handleSimulateGoal = () => {
    setMatchScore(prev => ({ ...prev, home: prev.home + 1 }));
    setEvents(prev => [
      { minute: 75, type: 'GOAL_SCORED', player: 'Nguyễn Văn Huy (#10)', team: 'FC Về Nhì', details: 'Đệm bóng cận thành (Hattrick!)' },
      ...prev
    ]);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Header Bar */}
      <header className="glass-panel" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #00f2fe, #4facfe)', borderRadius: '10px', display: 'grid', placeItems: 'center', fontWeight: '800', color: '#000' }}>PTX</div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '800' }}>PTX PLATFORM</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enterprise Tournament Management v1.0</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className="badge-beta">🚀 PUBLIC BETA PREVIEW</span>
          <button className="btn-primary" onClick={() => alert('Gửi phản hồi cho Ban Tổ Chức!')}>💬 Gửi Phản Hồi Beta</button>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="glass-panel" style={{ padding: '32px', marginBottom: '24px', position: 'relative', overflow: 'hidden', minHeight: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, opacity: 0.2, backgroundImage: 'radial-gradient(#00f2fe 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span style={{ color: 'var(--accent-cyan)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem' }}>Giải Bóng Đá Thường Niên</span>
          <h2 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1.2, margin: '8px 0 12px 0' }}>PTX SUMMER CUP 2026</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', fontSize: '1rem' }}>
            Nền tảng quản lý giải đấu hiện đại với Live Match Console realtime, lập lịch thi đấu tự động và Enterprise Digital Asset Management.
          </p>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        {(['OVERVIEW', 'MATCHES', 'STANDINGS', 'GALLERY'] as const).map(tab => (
          <button
            key={tab}
            className="glass-panel"
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 20px',
              border: activeTab === tab ? '1px solid var(--accent-cyan)' : '1px solid var(--border-glass)',
              background: activeTab === tab ? 'rgba(0, 242, 254, 0.15)' : 'var(--bg-card)',
              color: activeTab === tab ? 'var(--accent-cyan)' : 'var(--text-muted)',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {tab === 'OVERVIEW' ? '🌐 Tong Quan' : tab === 'MATCHES' ? '⚡ Match Console Live' : tab === 'STANDINGS' ? '🏆 Bang Xep Hang' : '📸 DAM Gallery'}
          </button>
        ))}
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left Column: Live Match Console Showcase */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="live-indicator"></span>
                <span style={{ fontWeight: '800', color: 'var(--accent-red)' }}>LIVE MATCH CONSOLE</span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', background: 'rgba(255, 255, 255, 0.05)', padding: '4px 12px', borderRadius: '8px' }}>Phút 72&apos;</span>
            </div>

            {/* Live Scoreboard */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '16px', background: 'rgba(0,0,0,0.3)', padding: '24px', borderRadius: '12px', marginBottom: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '4px' }}>🛡️</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>FC Về Nhì</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Chủ nhà</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '3rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                  {matchScore.home} - {matchScore.away}
                </span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '4px' }}>🐉</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>FC Rồng Vàng</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Đội khách</span>
              </div>
            </div>

            {/* Interactive Simulation Action */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn-primary" onClick={handleSimulateGoal}>⚽ Simulate Realtime Goal Event</button>
            </div>
          </div>

          {/* Realtime Event Stream */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📜 Realtime Event Stream (MatchEventBus)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {events.map((evt, idx) => (
                <div key={idx} style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', borderLeft: evt.type === 'GOAL_SCORED' ? '4px solid var(--accent-green)' : '4px solid var(--accent-gold)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)', marginRight: '12px' }}>{evt.minute}&apos;</span>
                    <span style={{ fontWeight: '700' }}>{evt.player}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '8px' }}>({evt.details})</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)' }}>{evt.team}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Tournament Details & Sponsors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Tournament Overview Stats */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>📊 Operational Metrics</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Lập lịch Round Robin:</span>
                <span style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>2.1 ms</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Broadcast Event Bus:</span>
                <span style={{ fontWeight: '700', color: 'var(--accent-green)' }}>&lt; 0.1 ms</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Media Asset Resolver:</span>
                <span style={{ fontWeight: '700', color: 'var(--accent-gold)' }}>0.15 ms</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Broken Image Rate:</span>
                <span style={{ fontWeight: '700', color: 'var(--accent-green)' }}>0% Clean</span>
              </div>
            </div>
          </div>

          {/* Title Sponsors */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>🤝 Title Sponsors</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--accent-gold)' }}>VINAMILK</div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>TITLE SPONSOR</span>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--accent-cyan)' }}>VIETTEL</div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>MEDIA PARTNER</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
