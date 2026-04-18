import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="notfound">
      <div className="notfound__code neon-text mono">404</div>
      <h1 className="notfound__title">Page Not Found</h1>
      <p className="notfound__desc">
        The resource you're looking for doesn't exist or has been moved.
      </p>
      <div className="notfound__terminal mono">
        <span className="neon-text">$</span> cd{' '}
        <span style={{ color: 'var(--neon-cyan)' }}>/home/hasnain</span>
        <br />
        <span className="neon-text">$</span>{' '}
        <span style={{ color: 'var(--text-muted)' }}>Error: path not found</span>
      </div>
      <Link to="/" className="btn btn-primary">
        ← Return Home
      </Link>

      <style>{`
        .notfound { min-height: 80vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2rem; gap: 1.5rem; }
        .notfound__code { font-size: clamp(5rem, 15vw, 10rem); font-weight: 900; line-height: 1; animation: glowPulse 3s ease infinite; }
        .notfound__title { font-size: 1.75rem; font-weight: 700; color: var(--text-primary); }
        .notfound__desc { color: var(--text-secondary); max-width: 400px; }
        .notfound__terminal { background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 1rem 1.5rem; font-size: 0.875rem; text-align: left; line-height: 1.8; margin: 0.5rem 0; }
      `}</style>
    </div>
  );
}
