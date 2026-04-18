import { useState } from 'react';
import { Outlet, NavLink, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const adminNav = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/admin/messages', label: 'Messages', icon: '✉' },
  { to: '/admin/projects', label: 'Projects', icon: '🔧' },
  { to: '/admin/certifications', label: 'Certifications', icon: '🏆' },
  { to: '/admin/writeups', label: 'Writeups', icon: '📝' },
  { to: '/admin/progress', label: 'Progress', icon: '📈' },
  { to: '/admin/categories', label: 'Categories', icon: '🗂' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙' },
];

export default function AdminLayout() {
  const { token, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!token) return <Navigate to="/admin/login" replace />;

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="admin-sidebar__header">
          <Link to="/" className="admin-sidebar__logo mono neon-text">[CYB3R]</Link>
          <button className="admin-sidebar__close btn btn-ghost btn-sm" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <nav className="admin-sidebar__nav">
          {adminNav.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
            >
              <span className="admin-nav-link__icon">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <Link to="/" className="admin-nav-link">
            <span className="admin-nav-link__icon">🌐</span>
            <span>View Site</span>
          </Link>
          <button onClick={logout} className="admin-nav-link admin-nav-link--logout">
            <span className="admin-nav-link__icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-topbar__menu btn btn-ghost btn-sm"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <span className="admin-topbar__title mono neon-text">Admin Panel</span>
          <button onClick={logout} className="btn btn-ghost btn-sm">Logout</button>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>

      <style>{`
        .admin-layout { display: flex; min-height: 100vh; }
        .admin-sidebar { width: 240px; background: var(--bg-secondary); border-right: 1px solid var(--border-color); display: flex; flex-direction: column; flex-shrink: 0; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
        .admin-sidebar__header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1rem; border-bottom: 1px solid var(--border-color); }
        .admin-sidebar__logo { font-size: 1rem; font-weight: 800; letter-spacing: 0.15em; text-decoration: none; }
        .admin-sidebar__close { display: none; }
        .admin-sidebar__nav { flex: 1; padding: 0.75rem 0; }
        .admin-nav-link { display: flex; align-items: center; gap: 0.75rem; padding: 0.625rem 1rem; font-size: 0.875rem; color: var(--text-secondary); transition: var(--transition); text-decoration: none; background: none; border: none; width: 100%; cursor: pointer; }
        .admin-nav-link:hover { color: var(--text-primary); background: rgba(255,255,255,0.03); }
        .admin-nav-link.active { color: var(--neon-green); background: rgba(0,255,65,0.08); border-right: 2px solid var(--neon-green); }
        .admin-nav-link__icon { font-size: 1rem; width: 1.25rem; text-align: center; }
        .admin-nav-link--logout:hover { color: #f87171; }
        .admin-sidebar__footer { border-top: 1px solid var(--border-color); padding: 0.75rem 0; }
        .admin-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .admin-topbar { display: none; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; background: var(--bg-secondary); border-bottom: 1px solid var(--border-color); position: sticky; top: 0; z-index: 10; }
        .admin-topbar__title { font-size: 0.9rem; font-weight: 700; }
        .admin-content { flex: 1; padding: 2rem; overflow-x: hidden; }
        .admin-overlay { display: none; }
        @media (max-width: 900px) {
          .admin-sidebar { position: fixed; left: -240px; top: 0; z-index: 200; transition: left 0.3s ease; height: 100vh; }
          .admin-sidebar.open { left: 0; }
          .admin-sidebar__close { display: block; }
          .admin-topbar { display: flex; }
          .admin-overlay { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 150; }
          .admin-content { padding: 1rem; }
        }
      `}</style>
    </div>
  );
}
