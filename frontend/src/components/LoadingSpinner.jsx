export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizes = { sm: 20, md: 36, lg: 56 };
  const px = sizes[size] || sizes.md;

  return (
    <div className="loading-spinner">
      <div
        className="loading-spinner__ring"
        style={{ width: px, height: px }}
      />
      {text && <p className="loading-spinner__text">{text}</p>}
      <style>{`
        .loading-spinner { display: flex; flex-direction: column; align-items: center; gap: 0.875rem; padding: 2rem; }
        .loading-spinner__ring {
          border: 2px solid var(--border-color);
          border-top-color: var(--neon-green);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        .loading-spinner__text { font-size: 0.85rem; color: var(--text-muted); font-family: var(--font-mono); }
      `}</style>
    </div>
  );
}

export function PageLoader() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <LoadingSpinner size="lg" text="Loading..." />
    </div>
  );
}
