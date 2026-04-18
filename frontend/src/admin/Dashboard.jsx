import { useState, useEffect } from 'react';
import { getDashboardStats } from '../api/admin.js';
import { PageLoader } from '../components/LoadingSpinner.jsx';

const STAT_CONFIG = [
  { key: 'messages', label: 'Messages', icon: '✉', color: 'var(--neon-green)' },
  { key: 'projects', label: 'Projects', icon: '🔧', color: 'var(--neon-cyan)' },
  { key: 'certifications', label: 'Certifications', icon: '🏆', color: 'var(--neon-purple)' },
  { key: 'writeups', label: 'Writeups', icon: '📝', color: 'var(--neon-green)' },
  { key: 'unreadMessages', label: 'Unread', icon: '🔔', color: '#f59e0b' },
  { key: 'progressItems', label: 'Skills', icon: '📈', color: 'var(--neon-cyan)' },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((r) => setStats(r.data))
      .catch(() => setStats({}))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div>
      <h1 className="admin-page-title">Dashboard</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
        Welcome back. Here's your portfolio overview.
      </p>

      <div className="dashboard-stats">
        {STAT_CONFIG.map(({ key, label, icon, color }) => (
          <div key={key} className="card dashboard-stat-card">
            <div className="dashboard-stat-card__icon" style={{ color }}>{icon}</div>
            <div className="dashboard-stat-card__value" style={{ color }}>
              {stats?.[key] ?? 0}
            </div>
            <div className="dashboard-stat-card__label">{label}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-quick-links">
        <h2 className="section-title" style={{ fontSize: '1.2rem' }}>Quick Actions</h2>
        <div className="grid-auto">
          {[
            { label: 'Add Project', link: '/admin/projects', desc: 'Publish a new project', icon: '🔧' },
            { label: 'Write Writeup', link: '/admin/writeups', desc: 'Add a new CTF writeup', icon: '📝' },
            { label: 'View Messages', link: '/admin/messages', desc: 'Check contact messages', icon: '✉' },
            { label: 'Update Settings', link: '/admin/settings', desc: 'Edit site information', icon: '⚙' },
          ].map(({ label, link, desc, icon }) => (
            <a key={link} href={link} className="card dashboard-quick-card">
              <div className="dashboard-quick-card__icon">{icon}</div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{label}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{desc}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        .admin-page-title { font-size: 1.75rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem; }
        .dashboard-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-bottom: 2.5rem; }
        .dashboard-stat-card { text-align: center; padding: 1.5rem; }
        .dashboard-stat-card__icon { font-size: 1.75rem; margin-bottom: 0.5rem; }
        .dashboard-stat-card__value { font-size: 2.5rem; font-weight: 800; font-family: var(--font-mono); margin-bottom: 0.25rem; }
        .dashboard-stat-card__label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); }
        .dashboard-quick-links { margin-top: 2rem; }
        .dashboard-quick-card { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.25rem; text-decoration: none; }
        .dashboard-quick-card__icon { font-size: 1.5rem; }
        @media (max-width: 768px) { .dashboard-stats { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .dashboard-stats { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
