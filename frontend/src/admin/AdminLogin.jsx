import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function AdminLogin() {
  const { login, token, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (token) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setSubmitting(true);
    setError('');
    const result = await login(email, password);
    if (result.success) {
      navigate('/admin/dashboard', { replace: true });
    } else {
      setError(result.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="admin-login">
      <div className="admin-login__box">
        <div className="admin-login__header">
          <div className="admin-login__logo mono neon-text">[ADMIN]</div>
          <h1 className="admin-login__title">Secure Access</h1>
          <p className="admin-login__subtitle">Authenticate to manage your portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login__form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={submitting || loading}
            style={{ marginTop: '0.5rem' }}
          >
            {submitting ? 'Authenticating...' : 'Login'}
          </button>
        </form>

        <div className="admin-login__footer mono">
          <span className="neon-text">$</span> ssh admin@portfolio
        </div>
      </div>

      <style>{`
        .admin-login { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg-primary); background-image: linear-gradient(rgba(0,255,65,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.02) 1px, transparent 1px); background-size: 40px 40px; padding: 2rem; }
        .admin-login__box { width: 100%; max-width: 420px; background: var(--bg-surface); border: 1px solid rgba(0,255,65,0.2); border-radius: var(--radius-lg); padding: 2.5rem; box-shadow: 0 0 40px rgba(0,255,65,0.05); animation: slideUp 0.4s ease; }
        .admin-login__header { text-align: center; margin-bottom: 2rem; }
        .admin-login__logo { font-size: 1.5rem; font-weight: 800; letter-spacing: 0.2em; margin-bottom: 0.75rem; animation: glowPulse 3s infinite; }
        .admin-login__title { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem; }
        .admin-login__subtitle { font-size: 0.85rem; color: var(--text-muted); }
        .admin-login__form { display: flex; flex-direction: column; gap: 1.25rem; }
        .admin-login__footer { text-align: center; padding-top: 1.5rem; margin-top: 1.5rem; border-top: 1px solid var(--border-color); font-size: 0.8rem; color: var(--text-muted); }
      `}</style>
    </div>
  );
}
