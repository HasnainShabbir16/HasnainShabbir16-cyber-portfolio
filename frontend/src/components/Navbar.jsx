import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const navLinks = [
  { to: '/', label: 'Home', exact: true },
  { to: '/about', label: 'About' },
  { to: '/certifications', label: 'Certs' },
  { to: '/projects', label: 'Projects' },
  { to: '/writeups', label: 'Labs' },
  { to: '/progress', label: 'Progress' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { token } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-bracket">[</span>
          <span className="neon-text">H4SN41N</span>
          <span className="navbar__logo-bracket">]</span>
        </Link>

        {/* Desktop links */}
        <ul className="navbar__links">
          {navLinks.map(({ to, label, exact }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={exact}
                className={({ isActive }) =>
                  `navbar__link${isActive ? ' navbar__link--active' : ''}`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
          {token && (
            <li>
              <Link to="/admin/dashboard" className="navbar__link navbar__link--admin">
                Admin
              </Link>
            </li>
          )}
        </ul>

        {/* Hamburger */}
        <button
          className={`navbar__hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen((p) => !p)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="navbar__mobile-menu">
          <ul>
            {navLinks.map(({ to, label, exact }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={exact}
                  className={({ isActive }) =>
                    `navbar__mobile-link${isActive ? ' active' : ''}`
                  }
                >
                  <span className="neon-text">›</span> {label}
                </NavLink>
              </li>
            ))}
            {token && (
              <li>
                <Link to="/admin/dashboard" className="navbar__mobile-link">
                  <span className="neon-text">›</span> Admin
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}

      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(10, 14, 26, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid transparent;
          transition: var(--transition);
        }
        .navbar--scrolled {
          border-bottom-color: rgba(0,255,65,0.15);
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        }
        .navbar__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
        }
        .navbar__logo {
          font-family: var(--font-mono);
          font-size: 1.2rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-decoration: none;
        }
        .navbar__logo-bracket { color: var(--neon-cyan); }
        .navbar__links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          list-style: none;
        }
        .navbar__link {
          padding: 0.4rem 0.875rem;
          border-radius: var(--radius);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: var(--transition);
          text-decoration: none;
          position: relative;
        }
        .navbar__link::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background: var(--neon-green);
          transition: width 0.3s ease;
          border-radius: 2px;
        }
        .navbar__link:hover { color: var(--text-primary); }
        .navbar__link:hover::after { width: 60%; }
        .navbar__link--active { color: var(--neon-green); }
        .navbar__link--active::after { width: 60%; }
        .navbar__link--admin {
          background: rgba(0,255,65,0.08);
          border: 1px solid rgba(0,255,65,0.2);
          color: var(--neon-green);
        }
        .navbar__hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }
        .navbar__hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          background: var(--neon-green);
          border-radius: 2px;
          transition: var(--transition);
        }
        .navbar__hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .navbar__hamburger.open span:nth-child(2) { opacity: 0; }
        .navbar__hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
        .navbar__mobile-menu {
          background: rgba(10,14,26,0.98);
          border-top: 1px solid var(--border-color);
          padding: 1rem 0;
          animation: slideUp 0.2s ease;
        }
        .navbar__mobile-link {
          display: block;
          padding: 0.75rem 1.5rem;
          font-size: 0.9rem;
          color: var(--text-secondary);
          transition: var(--transition);
          text-decoration: none;
          font-family: var(--font-mono);
        }
        .navbar__mobile-link:hover,
        .navbar__mobile-link.active { color: var(--neon-green); background: rgba(0,255,65,0.05); }
        @media (max-width: 768px) {
          .navbar__links { display: none; }
          .navbar__hamburger { display: flex; }
        }
      `}</style>
    </nav>
  );
}
