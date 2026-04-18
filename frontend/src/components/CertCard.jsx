export default function CertCard({ cert }) {
  const {
    title = 'Untitled',
    issuer = '',
    issueDate,
    credentialUrl,
    image,
    description,
  } = cert;

  return (
    <div className="card cert-card">
      <div className="cert-card__inner">
        {image ? (
          <img src={image} alt={title} className="cert-card__img" />
        ) : (
          <div className="cert-card__img-placeholder">
            <span>🏆</span>
          </div>
        )}

        <div className="cert-card__body">
          <h3 className="cert-card__title">{title}</h3>
          {issuer && <p className="cert-card__issuer">{issuer}</p>}
          {description && <p className="cert-card__desc">{description}</p>}

          <div className="cert-card__footer">
            {issueDate && (
              <span className="cert-card__date">
                {new Date(issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
              </span>
            )}
            {credentialUrl && (
              <a
                href={credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
              >
                Verify ↗
              </a>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .cert-card { padding: 1.25rem; }
        .cert-card__inner { display: flex; gap: 1rem; align-items: flex-start; }
        .cert-card__img { width: 72px; height: 72px; border-radius: var(--radius); object-fit: contain; background: var(--bg-secondary); border: 1px solid var(--border-color); flex-shrink: 0; }
        .cert-card__img-placeholder { width: 72px; height: 72px; border-radius: var(--radius); background: rgba(0,255,65,0.08); border: 1px solid rgba(0,255,65,0.2); display: flex; align-items: center; justify-content: center; font-size: 1.75rem; flex-shrink: 0; }
        .cert-card__body { flex: 1; min-width: 0; }
        .cert-card__title { font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem; }
        .cert-card__issuer { font-size: 0.8rem; color: var(--neon-cyan); font-family: var(--font-mono); margin-bottom: 0.4rem; }
        .cert-card__desc { font-size: 0.8rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 0.75rem; }
        .cert-card__footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; }
        .cert-card__date { font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-muted); }
      `}</style>
    </div>
  );
}
