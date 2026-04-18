export default function DataTable({ columns, data, onEdit, onDelete }) {
  if (!data || data.length === 0) {
    return (
      <div className="data-table-empty">
        <p>No records found.</p>
      </div>
    );
  }

  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {(onEdit || onDelete) && <th style={{ textAlign: 'right' }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={row._id || row.id || rowIdx}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '—')}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  {onEdit && (
                    <button
                      className="btn btn-outline btn-sm"
                      style={{ marginRight: '0.4rem' }}
                      onClick={() => onEdit(row)}
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this item?')) {
                          onDelete(row._id || row.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .data-table-wrap { overflow-x: auto; border-radius: var(--radius-lg); border: 1px solid var(--border-color); }
        .data-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
        .data-table th { background: var(--bg-secondary); padding: 0.75rem 1rem; text-align: left; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); border-bottom: 1px solid var(--border-color); white-space: nowrap; }
        .data-table td { padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-color); color: var(--text-secondary); vertical-align: middle; }
        .data-table tr:last-child td { border-bottom: none; }
        .data-table tr:hover td { background: rgba(255,255,255,0.02); }
        .data-table-empty { text-align: center; padding: 3rem; color: var(--text-muted); font-size: 0.875rem; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px solid var(--border-color); }
      `}</style>
    </div>
  );
}
