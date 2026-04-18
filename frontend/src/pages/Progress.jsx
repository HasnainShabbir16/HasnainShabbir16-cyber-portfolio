import { useState, useEffect } from 'react';
import ProgressBar from '../components/ProgressBar.jsx';
import { PageLoader } from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { getProgress } from '../api/public.js';

const DEFAULT_CATEGORIES = [
  {
    name: 'Penetration Testing',
    items: [
      { label: 'Network Pentesting', value: 85, color: 'green' },
      { label: 'Web App Testing', value: 80, color: 'cyan' },
      { label: 'Active Directory', value: 70, color: 'purple' },
    ],
  },
  {
    name: 'CTF Skills',
    items: [
      { label: 'Web Exploitation', value: 88, color: 'green' },
      { label: 'Binary Exploitation', value: 60, color: 'cyan' },
      { label: 'Reverse Engineering', value: 65, color: 'purple' },
      { label: 'Forensics', value: 75, color: 'green' },
      { label: 'Cryptography', value: 70, color: 'cyan' },
    ],
  },
  {
    name: 'Programming',
    items: [
      { label: 'Python', value: 82, color: 'green' },
      { label: 'Bash Scripting', value: 78, color: 'cyan' },
      { label: 'JavaScript', value: 65, color: 'purple' },
      { label: 'C/C++', value: 50, color: 'green' },
    ],
  },
];

export default function Progress() {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProgress()
      .then((r) => setProgressData(r.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const categories = progressData?.categories || DEFAULT_CATEGORIES;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Learning <span className="neon-text">Progress</span></h1>
          <p>Tracking my growth across cybersecurity disciplines.</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '4rem' }}>
        {error && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            Note: Using default data (API unavailable)
          </p>
        )}

        {/* Overall stats */}
        <section className="section-sm">
          <div className="progress-overview">
            {[
              { label: 'Overall Score', value: progressData?.overallScore || '72%', color: 'var(--neon-green)' },
              { label: 'Skills Tracked', value: categories.reduce((a, c) => a + (c.items?.length || 0), 0), color: 'var(--neon-cyan)' },
              { label: 'Completed Goals', value: progressData?.completedGoals || '8', color: 'var(--neon-purple)' },
            ].map(({ label, value, color }) => (
              <div key={label} className="card text-center">
                <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color, marginBottom: '0.5rem' }}>
                  {value}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Progress by category */}
        {categories.map((cat) => (
          <section key={cat.name} className="section-sm">
            <h2 className="section-title">{cat.name}</h2>
            <div className="progress-grid">
              {(cat.items || []).map((item) => (
                <ProgressBar
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  color={item.color}
                />
              ))}
            </div>
          </section>
        ))}

        {/* Certifications roadmap */}
        {progressData?.roadmap && progressData.roadmap.length > 0 && (
          <section className="section-sm">
            <h2 className="section-title">Certification Roadmap</h2>
            <div className="progress-roadmap">
              {progressData.roadmap.map((item, i) => (
                <div key={i} className={`roadmap-item${item.completed ? ' completed' : ''}`}>
                  <div className="roadmap-item__dot" />
                  <div className="roadmap-item__content">
                    <h4>{item.name}</h4>
                    {item.description && <p>{item.description}</p>}
                  </div>
                  {item.completed && <span className="badge badge-easy">✓ Done</span>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <style>{`
        .progress-overview { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
        .progress-grid { max-width: 700px; }
        .progress-roadmap { display: flex; flex-direction: column; gap: 0; max-width: 600px; }
        .roadmap-item { display: flex; align-items: flex-start; gap: 1rem; padding: 1rem 0; border-left: 2px solid var(--border-color); padding-left: 1.5rem; margin-left: 8px; position: relative; }
        .roadmap-item.completed { border-left-color: var(--neon-green); }
        .roadmap-item__dot { position: absolute; left: -9px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; border-radius: 50%; background: var(--bg-surface); border: 2px solid var(--border-color); }
        .roadmap-item.completed .roadmap-item__dot { background: var(--neon-green); border-color: var(--neon-green); box-shadow: 0 0 8px rgba(0,255,65,0.4); }
        .roadmap-item__content { flex: 1; }
        .roadmap-item__content h4 { font-size: 0.95rem; color: var(--text-primary); margin-bottom: 0.25rem; }
        .roadmap-item__content p { font-size: 0.82rem; color: var(--text-muted); }
        @media (max-width: 768px) { .progress-overview { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
