import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DEFAULT_TITLES = [
  'Cybersecurity Enthusiast',
  'Ethical Hacker',
  'CTF Player',
  'Security Researcher',
  'Penetration Tester',
];

export default function HeroSection({ settings }) {
  const heroName = settings?.heroName || 'H4SN41N';
  const heroSubtitle = settings?.heroSubtitle || '';
  const titles = settings?.heroTitles?.length ? settings.heroTitles : DEFAULT_TITLES;

  const [displayed, setDisplayed] = useState('');
  const [titleIndex, setTitleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = titles[titleIndex];
    const speed = deleting ? 50 : 90;

    const timer = setTimeout(() => {
      if (!deleting) {
        if (charIndex < current.length) {
          setDisplayed(current.slice(0, charIndex + 1));
          setCharIndex((c) => c + 1);
        } else {
          setTimeout(() => setDeleting(true), 1800);
        }
      } else {
        if (charIndex > 0) {
          setDisplayed(current.slice(0, charIndex - 1));
          setCharIndex((c) => c - 1);
        } else {
          setDeleting(false);
          setTitleIndex((i) => (i + 1) % titles.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [charIndex, deleting, titleIndex, titles]);

  return (
    <section className="hero">
      {/* Grid background */}
      <div className="hero__grid" aria-hidden="true" />

      <div className="container hero__content">
        <div className="hero__terminal-bar" aria-hidden="true">
          <span className="hero__dot red" />
          <span className="hero__dot yellow" />
          <span className="hero__dot green" />
          <span className="hero__terminal-title">terminal — bash</span>
        </div>

        <div className="hero__text" style={{ animation: 'slideUp 0.8s ease forwards' }}>
          <p className="hero__greeting mono" style={{ animationDelay: '0.1s' }}>
            <span className="neon-text">$</span> whoami
          </p>

          <h1 className="hero__name" style={{ animationDelay: '0.2s' }}>
            {heroName}
          </h1>

          <div className="hero__typing-line">
            <span className="neon-text mono">~</span>&nbsp;
            <span className="hero__typing-text">{displayed}</span>
            <span className="hero__cursor" aria-hidden="true">|</span>
          </div>

          {heroSubtitle && (
            <p className="hero__subtitle">{heroSubtitle}</p>
          )}

          <div className="hero__badges">
            {['Kali Linux', 'Burp Suite', 'Metasploit', 'Wireshark', 'Python'].map((tool) => (
              <span key={tool} className="tag-chip">{tool}</span>
            ))}
          </div>

          <div className="hero__cta">
            <Link to="/projects" className="btn btn-primary btn-lg">
              View Projects
            </Link>
            <Link to="/certifications" className="btn btn-outline btn-lg">
              Certifications
            </Link>
            <Link to="/contact" className="btn btn-ghost btn-lg">
              Contact Me
            </Link>
          </div>

          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-value neon-text">50+</span>
              <span className="hero__stat-label">CTF Solves</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-value neon-text-cyan">10+</span>
              <span className="hero__stat-label">Certifications</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-value neon-text-purple">20+</span>
              <span className="hero__stat-label">Projects</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero__scroll-indicator" aria-hidden="true">
        <span>scroll</span>
        <div className="hero__scroll-arrow" />
      </div>

      <style>{`
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 6rem 0 4rem;
        }
        .hero__grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,255,65,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,65,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }
        .hero__grid::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 50%, transparent 30%, var(--bg-primary) 80%);
        }
        .hero__content { position: relative; z-index: 1; max-width: 800px; }
        .hero__terminal-bar {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius) var(--radius) 0 0;
          padding: 0.5rem 0.875rem;
          width: fit-content;
          margin-bottom: 0;
        }
        .hero__dot {
          width: 10px; height: 10px;
          border-radius: 50%;
        }
        .hero__dot.red { background: #ef4444; }
        .hero__dot.yellow { background: #f59e0b; }
        .hero__dot.green { background: var(--neon-green); }
        .hero__terminal-title {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-muted);
          margin-left: 0.5rem;
        }
        .hero__text {
          background: rgba(17,24,39,0.7);
          border: 1px solid rgba(0,255,65,0.15);
          border-radius: 0 var(--radius-lg) var(--radius-lg);
          padding: 2rem 2.5rem 2.5rem;
          backdrop-filter: blur(4px);
        }
        .hero__greeting {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }
        .hero__name {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900;
          font-family: var(--font-mono);
          color: var(--text-primary);
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin-bottom: 1rem;
        }
        .hero__typing-line {
          font-size: clamp(1.1rem, 2.5vw, 1.5rem);
          font-family: var(--font-mono);
          color: var(--text-secondary);
          margin-bottom: 1rem;
          min-height: 2.5rem;
          display: flex;
          align-items: center;
        }
        .hero__typing-text {
          color: var(--neon-cyan);
          text-shadow: 0 0 8px rgba(0,212,255,0.4);
        }
        .hero__cursor {
          color: var(--neon-green);
          animation: blink 1s step-end infinite;
          font-weight: 100;
          margin-left: 1px;
        }
        .hero__subtitle {
          color: var(--text-secondary);
          font-size: 1rem;
          margin-bottom: 1.25rem;
          line-height: 1.7;
          max-width: 560px;
        }
        .hero__badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.75rem;
        }
        .hero__cta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.875rem;
          margin-bottom: 2rem;
        }
        .hero__stats {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-color);
        }
        .hero__stat { display: flex; flex-direction: column; gap: 0.2rem; }
        .hero__stat-value {
          font-family: var(--font-mono);
          font-size: 1.5rem;
          font-weight: 800;
        }
        .hero__stat-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .hero__stat-divider {
          width: 1px;
          height: 40px;
          background: var(--border-color);
        }
        .hero__scroll-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.7rem;
          font-family: var(--font-mono);
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          animation: fadeIn 2s ease 1s both;
        }
        .hero__scroll-arrow {
          width: 1px;
          height: 24px;
          background: linear-gradient(var(--neon-green), transparent);
          animation: scanline 1.5s ease-in-out infinite;
        }
        @media (max-width: 768px) {
          .hero { padding: 5rem 0 4rem; min-height: auto; }
          .hero__text { padding: 1.5rem; }
          .hero__cta { gap: 0.625rem; }
          .hero__cta .btn-lg { padding: 0.625rem 1.25rem; font-size: 0.875rem; }
          .hero__stats { gap: 1rem; }
          .hero__stat-value { font-size: 1.2rem; }
          .hero__scroll-indicator { display: none; }
        }
      `}</style>
    </section>
  );
}
