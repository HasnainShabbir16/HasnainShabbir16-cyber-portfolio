export default function AdminForm({ fields, values, onChange, errors = {} }) {
  return (
    <div className="admin-form">
      {fields.map((field) => {
        const { name, label, type = 'text', placeholder = '', required, options, hint } = field;
        return (
          <div key={name} className="form-group">
            <label className="form-label">
              {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
            </label>

            {type === 'textarea' ? (
              <textarea
                name={name}
                className="form-textarea"
                placeholder={placeholder}
                value={values[name] || ''}
                onChange={onChange}
                rows={4}
              />
            ) : type === 'select' ? (
              <select
                name={name}
                className="form-select"
                value={values[name] || ''}
                onChange={onChange}
              >
                <option value="">Select {label}</option>
                {(options || []).map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : type === 'checkbox' ? (
              <label className="admin-form-checkbox">
                <input
                  type="checkbox"
                  name={name}
                  checked={!!values[name]}
                  onChange={onChange}
                />
                <span>{placeholder || label}</span>
              </label>
            ) : (
              <input
                type={type}
                name={name}
                className="form-input"
                placeholder={placeholder}
                value={values[name] || ''}
                onChange={onChange}
                required={required}
              />
            )}

            {hint && <p className="form-hint">{hint}</p>}
            {errors[name] && <p className="form-error">{errors[name]}</p>}
          </div>
        );
      })}

      <style>{`
        .admin-form { display: flex; flex-direction: column; gap: 1.25rem; }
        .admin-form-checkbox { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
        .admin-form-checkbox input { width: 16px; height: 16px; accent-color: var(--neon-green); cursor: pointer; }
      `}</style>
    </div>
  );
}
