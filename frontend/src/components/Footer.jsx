import { Link } from 'react-router-dom';

const socialLinks = [
  { label: 'GitHub', href: '#', icon: '⌨' },
  { label: 'LinkedIn', href: '#', icon: '🔗' },
  { label: 'Twitter', href: '#', icon: '🐦' },
  { label: 'HackTheBox', href: '#', icon: '📦' },
  { label: 'TryHackMe', href: '#', icon: '🎯' },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">
              <span style={{ color: 'var(--neon-cyan)' }}>[</span>
              <span className="neon-text">H4SN41N</span>
              <span style={{ color: 'var(--neon-cyan)' }}>]</span>
            </div>
            <p className="footer__tagline">
              Cybersecurity Enthusiast · Ethical Hacker · CTF Player
            </p>
          </div>

          <div className="footer__links-col">
            <h4 className="footer__col-title">Navigation</h4>
            <ul>
              {['/about', '/projects', '/writeups', '/certifications', '/progress', '/contact'].map((p) => (
                <li key={p}>
                  <Link to={p} className="footer__link">
                    {p.replace('/', '').replace(/^\w/, (c) => c.toUpperCase())}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__links-col">
            <h4 className="footer__col-title">Connect</h4>
            <ul>
              {socialLinks.map(({ label, href, icon }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="footer__link">
                    <span>{icon}</span> {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span className="footer__copy">
            © {year} <span className="neon-text">H4SN41N</span>. Built with React + ❤️
          </span>
          <span className="footer__status">
            <span className="footer__dot" />
            Systems Online
          </span>
        </div>
      </div>

      <style>{`
        .footer {
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-color);
          padding: 3rem 0 1.5rem;
          margin-top: auto;
        }
        .footer__grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2.5rem;
        }
        .footer__logo {
          font-family: var(--font-mono);
          font-size: 1.3rem;
          font-weight: 800;
          margin-bottom: 0.75rem;
        }
        .footer__tagline {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.6;
        }
        .footer__col-title {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--neon-cyan);
          margin-bottom: 0.875rem;
          font-family: var(--font-mono);
        }
        .footer__links-col ul { display: flex; flex-direction: column; gap: 0.4rem; }
        .footer__link {
          font-size: 0.85rem;
          color: var(--text-muted);
          transition: var(--transition);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .footer__link:hover { color: var(--neon-green); }
        .footer__bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-color);
          font-size: 0.82rem;
          color: var(--text-muted);
        }
        .footer__status { display: flex; align-items: center; gap: 0.4rem; }
        .footer__dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--neon-green);
          animation: glowPulse 2s infinite;
        }
        .footer__copy { font-family: var(--font-mono); }
        @media (max-width: 768px) {
          .footer__grid { grid-template-columns: 1fr 1fr; }
          .footer__brand { grid-column: 1 / -1; }
          .footer__bottom { flex-direction: column; gap: 0.5rem; text-align: center; }
        }
        @media (max-width: 480px) {
          .footer__grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </footer>
  );
}
