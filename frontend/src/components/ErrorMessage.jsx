export default function ErrorMessage({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="error-msg">
      <div className="error-msg__icon">⚠</div>
      <h3 className="error-msg__title">Error</h3>
      <p className="error-msg__text">{message}</p>
      {onRetry && (
        <button className="btn btn-outline btn-sm" onClick={onRetry}>
          Retry
        </button>
      )}
      <style>{`
        .error-msg { text-align: center; padding: 3rem 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }
        .error-msg__icon { font-size: 2.5rem; }
        .error-msg__title { font-size: 1.1rem; font-weight: 700; color: #f87171; }
        .error-msg__text { font-size: 0.875rem; color: var(--text-muted); max-width: 400px; }
      `}</style>
    </div>
  );
}
