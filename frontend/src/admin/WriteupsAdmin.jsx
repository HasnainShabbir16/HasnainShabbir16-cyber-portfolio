import { useState, useEffect } from 'react';
import DataTable from './components/DataTable.jsx';
import Modal from '../components/Modal.jsx';
import MarkdownEditor from './components/MarkdownEditor.jsx';
import { PageLoader } from '../components/LoadingSpinner.jsx';
import {
  getAdminWriteups, createWriteup, updateWriteup, deleteWriteup,
} from '../api/admin.js';
import { getCategories } from '../api/public.js';

const DIFFICULTIES = ['easy', 'medium', 'hard', 'insane'];
const emptyForm = { title: '', difficulty: 'easy', tools: '', content: '', categoryId: '', excerpt: '' };

const DIFF_BADGE = { easy: 'badge-easy', medium: 'badge-medium', hard: 'badge-hard', insane: 'badge-insane' };

export default function WriteupsAdmin() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([getAdminWriteups(), getCategories('writeup')])
      .then(([wRes, cRes]) => {
        setItems(wRes.data?.writeups || wRes.data || []);
        setCategories(cRes.data?.categories || cRes.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openAdd = () => { setEditItem(null); setForm(emptyForm); setMsg(null); setModal(true); };
  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      title: item.title || '',
      difficulty: item.difficulty || 'easy',
      tools: Array.isArray(item.tools) ? item.tools.join(', ') : item.tools || '',
      content: item.content || '',
      categoryId: item.category?._id || item.category?.id || item.categoryId || '',
      excerpt: item.excerpt || '',
    });
    setMsg(null); setModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) { setMsg({ type: 'error', text: 'Title is required.' }); return; }
    setSaving(true); setMsg(null);
    const payload = {
      ...form,
      tools: form.tools.split(',').map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (editItem) await updateWriteup(editItem._id || editItem.id, payload);
      else await createWriteup(payload);
      setModal(false); load();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Save failed.' });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await deleteWriteup(id); load(); }
    catch (err) { alert(err.response?.data?.message || 'Delete failed.'); }
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'difficulty', label: 'Difficulty', render: (v) => <span className={`badge ${DIFF_BADGE[v] || 'badge-default'}`}>{v}</span> },
    { key: 'tools', label: 'Tools', render: (v) => (Array.isArray(v) ? v.slice(0, 3).join(', ') : String(v || '—').slice(0, 40)) },
    { key: 'createdAt', label: 'Created', render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
  ];

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="flex-between mb-3">
        <h1 className="admin-page-title">Writeups</h1>
        <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Add Writeup</button>
      </div>
      <DataTable columns={columns} data={items} onEdit={openEdit} onDelete={handleDelete} />
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editItem ? 'Edit Writeup' : 'Add Writeup'} size="xl">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input name="title" className="form-input" value={form.title} onChange={handleChange} required />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Difficulty</label>
              <select name="difficulty" className="form-select" value={form.difficulty} onChange={handleChange}>
                {DIFFICULTIES.map((d) => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select name="categoryId" className="form-select" value={form.categoryId} onChange={handleChange}>
                <option value="">No category</option>
                {categories.map((c) => <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Tools (comma-separated)</label>
            <input name="tools" className="form-input" value={form.tools} onChange={handleChange} placeholder="nmap, burpsuite, gobuster" />
          </div>
          <div className="form-group">
            <label className="form-label">Excerpt</label>
            <input name="excerpt" className="form-input" value={form.excerpt} onChange={handleChange} placeholder="Short summary..." />
          </div>
          <MarkdownEditor
            label="Content (Markdown)"
            name="content"
            value={form.content}
            onChange={handleChange}
          />
          {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Writeup'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
