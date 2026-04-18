import { useState, useEffect } from 'react';
import CertCard from '../components/CertCard.jsx';
import { PageLoader } from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { getCertifications, getCategories } from '../api/public.js';

export default function Certifications() {
  const [certifications, setCertifications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [certRes, catRes] = await Promise.all([
          getCertifications(),
          getCategories('certification'),
        ]);
        setCertifications(certRes.data?.certifications || certRes.data || []);
        setCategories(catRes.data?.categories || catRes.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load certifications');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = activeCategory === 'all'
    ? certifications
    : certifications.filter((c) => {
        const catId = c.category?._id || c.category?.id || c.categoryId;
        return String(catId) === String(activeCategory);
      });

  if (loading) return <PageLoader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Certifications <span className="neon-text">&amp; Badges</span></h1>
          <p>Professional certifications and achievements in cybersecurity.</p>
        </div>
      </div>

      <div className="container">
        {/* Category Tabs */}
        {categories.length > 0 && (
          <div className="tabs">
            <button
              className={`tab-btn${activeCategory === 'all' ? ' active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All ({certifications.length})
            </button>
            {categories.map((cat) => {
              const count = certifications.filter((c) => {
                const catId = c.category?._id || c.category?.id || c.categoryId;
                return String(catId) === String(cat._id || cat.id);
              }).length;
              return (
                <button
                  key={cat._id || cat.id}
                  className={`tab-btn${activeCategory === String(cat._id || cat.id) ? ' active' : ''}`}
                  onClick={() => setActiveCategory(String(cat._id || cat.id))}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center" style={{ padding: '4rem 0', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</p>
            <p>No certifications found.</p>
          </div>
        ) : (
          <div className="grid-auto" style={{ paddingBottom: '4rem' }}>
            {filtered.map((cert) => (
              <CertCard key={cert._id || cert.id} cert={cert} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
