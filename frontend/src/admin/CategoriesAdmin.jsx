import { useState, useEffect } from 'react';
import DataTable from './components/DataTable.jsx';
import Modal from '../components/Modal.jsx';
import { PageLoader } from '../components/LoadingSpinner.jsx';
import { getAdminCategories, createCategory, updateCategory, deleteCategory } from '../api/admin.js';

const TYPES = ['project', 'certification', 'writeup', 'other'];

const emptyForm = { name: '', type: 'project', description: '' };

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = () => {
    setLoading(true);
    getAdminCategories()
      .then((r) => setCategories(r.data?.categories || r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openAdd = () => { setEditItem(null); setForm(emptyForm); setMsg(null); setModal(true); };
  const openEdit = (item) => {
    setEditItem(item);
    setForm({ name: item.name || '', type: item.type || 'project', description: item.description || '' });
    setMsg(null);
    setModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) { setMsg({ type: 'error', text: 'Name is required.' }); return; }
    setSaving(true);
    setMsg(null);
    try {
      if (editItem) {
        await updateCategory(editItem._id || editItem.id, form);
      } else {
        await createCategory(form);
      }
      setModal(false);
      load();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Save failed.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type', render: (v) => <span className="badge badge-default">{v}</span> },
    { key: 'description', label: 'Description', render: (v) => v || '—' },
  ];

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="flex-between mb-3">
        <h1 className="admin-page-title">Categories</h1>
        <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Add Category</button>
      </div>

      <DataTable columns={columns} data={categories} onEdit={openEdit} onDelete={handleDelete} />

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editItem ? 'Edit Category' : 'Add Category'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Name *</label>
            <input name="name" className="form-input" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select name="type" className="form-select" value={form.type} onChange={handleChange}>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <input name="description" className="form-input" value={form.description} onChange={handleChange} placeholder="Optional" />
          </div>
          {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
          <div className="modal-footer" style={{ padding: 0, border: 0 }}>
            <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
