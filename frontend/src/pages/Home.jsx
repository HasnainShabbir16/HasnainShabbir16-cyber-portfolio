import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import CertCard from '../components/CertCard.jsx';
import WriteupCard from '../components/WriteupCard.jsx';
import { getSiteSettings, getProjects, getCertifications, getWriteups } from '../api/public.js';

export default function Home() {
  const [settings, setSettings] = useState(null);
  const [projects, setProjects] = useState([]);
  const [certs, setCerts] = useState([]);
  const [writeups, setWriteups] = useState([]);

  useEffect(() => {
    getSiteSettings().then((r) => setSettings(r.data)).catch(() => {});
    getProjects({ featured: true, limit: 3 }).then((r) => setProjects(r.data?.projects || r.data || [])).catch(() => {});
    getCertifications({ limit: 3 }).then((r) => setCerts(r.data?.certifications || r.data || [])).catch(() => {});
    getWriteups({ limit: 3 }).then((r) => setWriteups(r.data?.writeups || r.data || [])).catch(() => {});
  }, []);

  return (
    <div>
      <HeroSection settings={settings} />

      {/* About Preview */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="home-about">
            <div className="home-about__text" style={{ animation: 'slideInLeft 0.6s ease forwards' }}>
              <h2 className="section-title">About Me</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
                {settings?.aboutText || 'Passionate cybersecurity professional focused on ethical hacking, CTF challenges, and building secure systems. Dedicated to continuous learning in the rapidly evolving security landscape.'}
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                With hands-on experience in penetration testing, vulnerability assessment, and security research, I strive to make the digital world a safer place.
              </p>
              <Link to="/about" className="btn btn-outline">Learn More →</Link>
            </div>
            <div className="home-about__stats">
              {[
                { label: 'CTF Solves', value: '50+', color: 'var(--neon-green)' },
                { label: 'Certifications', value: '10+', color: 'var(--neon-cyan)' },
                { label: 'Projects', value: '20+', color: 'var(--neon-purple)' },
                { label: 'Writeups', value: '30+', color: 'var(--neon-green)' },
              ].map(({ label, value, color }) => (
                <div key={label} className="home-stat-card">
                  <span className="home-stat-card__value" style={{ color }}>{value}</span>
                  <span className="home-stat-card__label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {projects.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="flex-between mb-3">
              <h2 className="section-title" style={{ marginBottom: 0 }}>Featured Projects</h2>
              <Link to="/projects" className="btn btn-ghost btn-sm">View All →</Link>
            </div>
            <div className="grid-auto">
              {projects.slice(0, 3).map((p) => (
                <ProjectCard key={p._id || p.id} project={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Writeups */}
      {writeups.length > 0 && (
        <section className="section" style={{ background: 'var(--bg-secondary)' }}>
          <div className="container">
            <div className="flex-between mb-3">
              <h2 className="section-title" style={{ marginBottom: 0 }}>Recent Writeups</h2>
              <Link to="/writeups" className="btn btn-ghost btn-sm">View All →</Link>
            </div>
            <div className="grid-auto">
              {writeups.slice(0, 3).map((w) => (
                <WriteupCard key={w._id || w.id} writeup={w} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Certifications teaser */}
      {certs.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="flex-between mb-3">
              <h2 className="section-title" style={{ marginBottom: 0 }}>Certifications</h2>
              <Link to="/certifications" className="btn btn-ghost btn-sm">View All →</Link>
            </div>
            <div className="grid-auto">
              {certs.slice(0, 3).map((c) => (
                <CertCard key={c._id || c.id} cert={c} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container text-center">
          <h2 className="section-title center">Let's Work Together</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: 500, margin: '0 auto 2rem' }}>
            Have a security project or collaboration in mind? I'd love to connect.
          </p>
          <div className="flex" style={{ justifyContent: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <Link to="/contact" className="btn btn-primary btn-lg">Get In Touch</Link>
            <Link to="/projects" className="btn btn-outline btn-lg">View My Work</Link>
          </div>
        </div>
      </section>

      <style>{`
        .home-about { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start; }
        .home-about__stats { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .home-stat-card { background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.5rem; text-align: center; transition: var(--transition); }
        .home-stat-card:hover { border-color: rgba(0,255,65,0.3); transform: translateY(-2px); }
        .home-stat-card__value { display: block; font-size: 2rem; font-weight: 800; font-family: var(--font-mono); margin-bottom: 0.4rem; }
        .home-stat-card__label { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
        @media (max-width: 768px) {
          .home-about { grid-template-columns: 1fr; gap: 2rem; }
        }
      `}</style>
    </div>
  );
}
