import { Link } from 'react-router-dom';

const DIFFICULTY_MAP = {
  easy: 'badge-easy',
  medium: 'badge-medium',
  hard: 'badge-hard',
  insane: 'badge-insane',
};

export default function WriteupCard({ writeup }) {
  const {
    _id,
    id,
    title = 'Untitled',
    difficulty = 'easy',
    tools = [],
    excerpt,
    content,
    createdAt,
  } = writeup;

  const writeupId = _id || id;
  const badgeClass = DIFFICULTY_MAP[difficulty?.toLowerCase()] || 'badge-default';

  const toolList = Array.isArray(tools)
    ? tools
    : String(tools).split(',').map((t) => t.trim()).filter(Boolean);

  const preview = excerpt || (content ? content.replace(/#{1,6}\s/g, '').replace(/[*_`]/g, '').slice(0, 120) + '…' : '');

  return (
    <div className="card writeup-card">
      <div className="writeup-card__header">
        <div className="writeup-card__meta">
          <span className={`badge ${badgeClass}`}>{difficulty}</span>
          {createdAt && (
            <span className="writeup-card__date">
              {new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      </div>

      <h3 className="writeup-card__title">{title}</h3>

      {preview && <p className="writeup-card__excerpt">{preview}</p>}

      {toolList.length > 0 && (
        <div className="writeup-card__tools">
          {toolList.slice(0, 5).map((t) => (
            <span key={t} className="tag-chip cyan">{t}</span>
          ))}
          {toolList.length > 5 && (
            <span className="tag-chip">+{toolList.length - 5}</span>
          )}
        </div>
      )}

      {writeupId && (
        <Link to={`/writeups/${writeupId}`} className="writeup-card__link">
          Read Writeup →
        </Link>
      )}

      <style>{`
        .writeup-card { padding: 1.25rem; display: flex; flex-direction: column; gap: 0.625rem; }
        .writeup-card__header { display: flex; align-items: center; justify-content: space-between; }
        .writeup-card__meta { display: flex; align-items: center; gap: 0.5rem; }
        .writeup-card__date { font-size: 0.72rem; font-family: var(--font-mono); color: var(--text-muted); }
        .writeup-card__title { font-size: 1rem; font-weight: 700; color: var(--text-primary); line-height: 1.4; }
        .writeup-card__excerpt { font-size: 0.83rem; color: var(--text-secondary); line-height: 1.6; }
        .writeup-card__tools { display: flex; flex-wrap: wrap; gap: 0.35rem; }
        .writeup-card__link { display: inline-flex; align-items: center; font-size: 0.85rem; color: var(--neon-green); font-weight: 600; margin-top: 0.25rem; transition: var(--transition); text-decoration: none; }
        .writeup-card__link:hover { color: var(--neon-cyan); gap: 0.5rem; }
      `}</style>
    </div>
  );
}
