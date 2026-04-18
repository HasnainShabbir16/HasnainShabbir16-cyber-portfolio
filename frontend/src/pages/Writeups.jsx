import { useState, useEffect } from 'react';
import WriteupCard from '../components/WriteupCard.jsx';
import { PageLoader } from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { getWriteups } from '../api/public.js';

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard', 'Insane'];

export default function Writeups() {
  const [writeups, setWriteups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [difficulty, setDifficulty] = useState('All');

  useEffect(() => {
    getWriteups()
      .then((r) => setWriteups(r.data?.writeups || r.data || []))
      .catch((err) => setError(err.message || 'Failed to load writeups'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = difficulty === 'All'
    ? writeups
    : writeups.filter((w) => w.difficulty?.toLowerCase() === difficulty.toLowerCase());

  if (loading) return <PageLoader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>CTF <span className="neon-text">Writeups</span></h1>
          <p>Detailed walkthroughs of CTF challenges and security labs.</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '4rem' }}>
        {/* Difficulty filter */}
        <div className="tabs">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              className={`tab-btn${difficulty === d ? ' active' : ''}`}
              onClick={() => setDifficulty(d)}
            >
              {d}
              {d !== 'All' && (
                <span style={{ marginLeft: '0.4rem', opacity: 0.6 }}>
                  ({writeups.filter((w) => w.difficulty?.toLowerCase() === d.toLowerCase()).length})
                </span>
              )}
            </button>
          ))}
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', fontFamily: 'var(--font-mono)' }}>
          {filtered.length} writeup{filtered.length !== 1 ? 's' : ''} found
        </p>

        {filtered.length === 0 ? (
          <div className="text-center" style={{ padding: '4rem 0', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</p>
            <p>No writeups available.</p>
          </div>
        ) : (
          <div className="grid-auto">
            {filtered.map((w) => (
              <WriteupCard key={w._id || w.id} writeup={w} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
