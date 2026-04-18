import { useState, useEffect } from 'react';
import { getAdminSettings, updateSettings } from '../api/admin.js';
import ImageUpload from './components/ImageUpload.jsx';
import { PageLoader } from '../components/LoadingSpinner.jsx';

const FIELDS = [
  { name: 'heroName', label: 'Hero Name', placeholder: 'H4SN41N' },
  { name: 'heroSubtitle', label: 'Hero Subtitle', placeholder: 'Cybersecurity Enthusiast' },
  { name: 'aboutText', label: 'About Text', type: 'textarea', placeholder: 'Short bio...' },
  { name: 'email', label: 'Contact Email', type: 'email', placeholder: 'you@example.com' },
  { name: 'location', label: 'Location', placeholder: 'Karachi, Pakistan' },
  { name: 'githubUrl', label: 'GitHub URL', placeholder: 'https://github.com/...' },
  { name: 'linkedinUrl', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/...' },
  { name: 'twitterUrl', label: 'Twitter/X URL', placeholder: 'https://x.com/...' },
  { name: 'hacktheboxUrl', label: 'HackTheBox URL', placeholder: 'https://app.hackthebox.com/...' },
  { name: 'tryhackmeUrl', label: 'TryHackMe URL', placeholder: 'https://tryhackme.com/p/...' },
];

export default function SettingsAdmin() {
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    getAdminSettings()
      .then((r) => setValues(r.data?.settings || r.data || {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((v) => ({ ...v, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await updateSettings(values);
      setMsg({ type: 'success', text: 'Settings saved successfully.' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to save settings.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <h1 className="admin-page-title">Site Settings</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 700 }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <ImageUpload
            label="Profile Image"
            currentUrl={values.profileImage}
            onUpload={(url) => setValues((v) => ({ ...v, profileImage: url }))}
          />
          {FIELDS.map(({ name, label, type, placeholder }) => (
            <div key={name} className="form-group">
              <label className="form-label">{label}</label>
              {type === 'textarea' ? (
                <textarea
                  name={name}
                  className="form-textarea"
                  placeholder={placeholder}
                  value={values[name] || ''}
                  onChange={handleChange}
                />
              ) : (
                <input
                  type={type || 'text'}
                  name={name}
                  className="form-input"
                  placeholder={placeholder}
                  value={values[name] || ''}
                  onChange={handleChange}
                />
              )}
            </div>
          ))}
        </div>

        {msg && (
          <div className={`alert alert-${msg.type} mb-2`}>{msg.text}</div>
        )}

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
