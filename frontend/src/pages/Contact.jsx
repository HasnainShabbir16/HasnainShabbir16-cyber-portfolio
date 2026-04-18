import { useState, useEffect } from 'react';
import { submitContact, getSiteSettings } from '../api/public.js';

export default function Contact() {
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null); // 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    getSiteSettings().then((r) => setSettings(r.data)).catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setErrorMsg('Please fill in all required fields.');
      setStatus('error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrorMsg('Please enter a valid email address.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    try {
      await submitContact(form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to send message. Please try again.');
      setStatus('error');
    }
  };

  const socials = [
    { label: 'GitHub', icon: '⌨', url: settings?.githubUrl },
    { label: 'LinkedIn', icon: '🔗', url: settings?.linkedinUrl },
    { label: 'Twitter', icon: '🐦', url: settings?.twitterUrl },
    { label: 'HackTheBox', icon: '📦', url: settings?.hacktheboxUrl },
    { label: 'TryHackMe', icon: '🎯', url: settings?.tryhackmeUrl },
  ].filter((s) => s.url);

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Get In <span className="neon-text">Touch</span></h1>
          <p>Have a question, project idea, or collaboration in mind? Let's connect.</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '5rem' }}>
        <div className="contact-layout">
          {/* Form */}
          <div>
            <h2 className="section-title">Send a Message</h2>
            <form className="card contact-form" onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input
                    name="name"
                    className="form-input"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    name="email"
                    type="email"
                    className="form-input"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  name="subject"
                  className="form-input"
                  placeholder="What's this about?"
                  value={form.subject}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea
                  name="message"
                  className="form-textarea"
                  placeholder="Your message..."
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  required
                  style={{ minHeight: '160px' }}
                />
              </div>

              {status === 'success' && (
                <div className="alert alert-success">
                  ✓ Message sent successfully! I'll get back to you soon.
                </div>
              )}
              {status === 'error' && (
                <div className="alert alert-error">⚠ {errorMsg}</div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Info sidebar */}
          <div>
            <h2 className="section-title">Contact Info</h2>

            <div className="card contact-info-card">
              {settings?.email && (
                <div className="contact-info-row">
                  <span className="contact-info-icon">✉</span>
                  <div>
                    <div className="contact-info-label">Email</div>
                    <a href={`mailto:${settings.email}`} className="contact-info-value">
                      {settings.email}
                    </a>
                  </div>
                </div>
              )}
              {settings?.location && (
                <div className="contact-info-row">
                  <span className="contact-info-icon">📍</span>
                  <div>
                    <div className="contact-info-label">Location</div>
                    <span className="contact-info-value">{settings.location}</span>
                  </div>
                </div>
              )}
              <div className="contact-info-row">
                <span className="contact-info-icon">⏰</span>
                <div>
                  <div className="contact-info-label">Response Time</div>
                  <span className="contact-info-value">Within 24–48 hours</span>
                </div>
              </div>
            </div>

            {socials.length > 0 && (
              <>
                <h3 className="section-title" style={{ fontSize: '1.2rem', marginTop: '2rem' }}>Follow Me</h3>
                <div className="contact-socials">
                  {socials.map(({ label, icon, url }) => (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-social-btn"
                    >
                      <span>{icon}</span>
                      <span>{label}</span>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .contact-layout { display: grid; grid-template-columns: 1.6fr 1fr; gap: 3rem; align-items: start; }
        .contact-form { display: flex; flex-direction: column; gap: 1.25rem; }
        .contact-info-card { display: flex; flex-direction: column; gap: 1.25rem; }
        .contact-info-row { display: flex; align-items: flex-start; gap: 0.875rem; }
        .contact-info-icon { font-size: 1.25rem; width: 2rem; text-align: center; flex-shrink: 0; padding-top: 2px; }
        .contact-info-label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 0.2rem; }
        .contact-info-value { font-size: 0.9rem; color: var(--text-primary); }
        a.contact-info-value:hover { color: var(--neon-green); }
        .contact-socials { display: flex; flex-direction: column; gap: 0.625rem; }
        .contact-social-btn { display: flex; align-items: center; gap: 0.75rem; padding: 0.625rem 1rem; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius); font-size: 0.875rem; color: var(--text-secondary); transition: var(--transition); text-decoration: none; }
        .contact-social-btn:hover { border-color: rgba(0,255,65,0.3); color: var(--neon-green); background: rgba(0,255,65,0.05); }
        @media (max-width: 768px) { .contact-layout { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
