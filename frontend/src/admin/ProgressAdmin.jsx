import { useState, useEffect } from 'react';
import DataTable from './components/DataTable.jsx';
import Modal from '../components/Modal.jsx';
import { PageLoader } from '../components/LoadingSpinner.jsx';
import { getAdminProgress, createProgress, updateProgress, deleteProgress } from '../api/admin.js';

const COLORS = ['green', 'cyan', 'purple'];
const emptyForm = { label: '', value: 50, color: 'green', category: '' };

export default function ProgressAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = () => {
    setLoading(true);
    getAdminProgress()
      .then((r) => setItems(r.data?.items || r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openAdd = () => { setEditItem(null); setForm(emptyForm); setMsg(null); setModal(true); };
  const openEdit = (item) => {
    setEditItem(item);
    setForm({ label: item.label || '', value: item.value ?? 50, color: item.color || 'green', category: item.category || '' });
    setMsg(null); setModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'value' ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.label) { setMsg({ type: 'error', text: 'Label is required.' }); return; }
    setSaving(true); setMsg(null);
    try {
      if (editItem) await updateProgress(editItem._id || editItem.id, form);
      else await createProgress(form);
      setModal(false); load();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Save failed.' });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await deleteProgress(id); load(); }
    catch (err) { alert(err.response?.data?.message || 'Delete failed.'); }
  };

  const columns = [
    { key: 'label', label: 'Skill' },
    { key: 'value', label: 'Value', render: (v) => `${v}%` },
    { key: 'color', label: 'Color', render: (v) => <span className={`badge badge-${v === 'green' ? 'easy' : v === 'cyan' ? 'cyan' : 'insane'}`}>{v}</span> },
    { key: 'category', label: 'Category', render: (v) => v || '—' },
  ];

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="flex-between mb-3">
        <h1 className="admin-page-title">Progress / Skills</h1>
        <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Add Skill</button>
      </div>
      <DataTable columns={columns} data={items} onEdit={openEdit} onDelete={handleDelete} />
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editItem ? 'Edit Skill' : 'Add Skill'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Skill Label *</label>
            <input name="label" className="form-input" value={form.label} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Value: {form.value}%</label>
            <input type="range" name="value" min={0} max={100} value={form.value} onChange={handleChange} style={{ width: '100%', accentColor: 'var(--neon-green)' }} />
          </div>
          <div className="form-group">
            <label className="form-label">Color</label>
            <select name="color" className="form-select" value={form.color} onChange={handleChange}>
              {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <input name="category" className="form-input" value={form.category} onChange={handleChange} placeholder="e.g. Penetration Testing" />
          </div>
          {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
