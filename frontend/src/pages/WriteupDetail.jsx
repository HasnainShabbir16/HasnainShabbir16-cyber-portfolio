import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { PageLoader } from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { getWriteup } from '../api/public.js';

const DIFFICULTY_MAP = {
  easy: 'badge-easy',
  medium: 'badge-medium',
  hard: 'badge-hard',
  insane: 'badge-insane',
};

export default function WriteupDetail() {
  const { id } = useParams();
  const [writeup, setWriteup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getWriteup(id)
      .then((r) => setWriteup(r.data?.writeup || r.data))
      .catch((err) => setError(err.response?.status === 404 ? 'Writeup not found' : err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoader />;
  if (error) return (
    <div className="container" style={{ paddingTop: '4rem' }}>
      <ErrorMessage message={error} />
      <div className="text-center mt-3">
        <Link to="/writeups" className="btn btn-outline">← Back to Writeups</Link>
      </div>
    </div>
  );
  if (!writeup) return null;

  const { title, difficulty, tools = [], content = '', createdAt, category } = writeup;
  const badgeClass = DIFFICULTY_MAP[difficulty?.toLowerCase()] || 'badge-default';
  const toolList = Array.isArray(tools)
    ? tools
    : String(tools).split(',').map((t) => t.trim()).filter(Boolean);

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <Link to="/writeups" className="writeup-detail__back">← Back to Writeups</Link>
          <div className="writeup-detail__meta">
            <span className={`badge ${badgeClass}`}>{difficulty}</span>
            {category?.name && <span className="badge badge-default">{category.name}</span>}
            {createdAt && (
              <span className="writeup-detail__date">
                {new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            )}
          </div>
          <h1 style={{ marginTop: '0.75rem' }}>{title}</h1>
          {toolList.length > 0 && (
            <div className="flex-wrap" style={{ marginTop: '0.875rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Tools:</span>
              {toolList.map((t) => (
                <span key={t} className="tag-chip cyan">{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '5rem' }}>
        <div className="writeup-detail__content markdown-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {content}
          </ReactMarkdown>
        </div>

        <div className="writeup-detail__footer">
          <Link to="/writeups" className="btn btn-outline">← Back to Writeups</Link>
        </div>
      </div>

      <style>{`
        .writeup-detail__back { display: inline-flex; align-items: center; color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1rem; transition: var(--transition); text-decoration: none; }
        .writeup-detail__back:hover { color: var(--neon-green); }
        .writeup-detail__meta { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
        .writeup-detail__date { font-size: 0.8rem; font-family: var(--font-mono); color: var(--text-muted); }
        .writeup-detail__content { max-width: 800px; padding: 2rem 0; }
        .writeup-detail__footer { padding-top: 2rem; border-top: 1px solid var(--border-color); margin-top: 2rem; }
      `}</style>
    </div>
  );
}
