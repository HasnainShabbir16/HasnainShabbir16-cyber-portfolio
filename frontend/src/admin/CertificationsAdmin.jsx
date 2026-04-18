import { useState, useEffect } from 'react';
import DataTable from './components/DataTable.jsx';
import Modal from '../components/Modal.jsx';
import ImageUpload from './components/ImageUpload.jsx';
import { PageLoader } from '../components/LoadingSpinner.jsx';
import {
  getAdminCertifications, createCertification, updateCertification, deleteCertification,
} from '../api/admin.js';
import { getCategories } from '../api/public.js';

const emptyForm = { title: '', issuer: '', issueDate: '', credentialUrl: '', description: '', categoryId: '', image: '' };

export default function CertificationsAdmin() {
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
    Promise.all([getAdminCertifications(), getCategories('certification')])
      .then(([iRes, cRes]) => {
        setItems(iRes.data?.certifications || iRes.data || []);
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
      title: item.title || '', issuer: item.issuer || '',
      issueDate: item.issueDate ? item.issueDate.split('T')[0] : '',
      credentialUrl: item.credentialUrl || '', description: item.description || '',
      categoryId: item.category?._id || item.category?.id || item.categoryId || '',
      image: item.image || '',
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
    try {
      if (editItem) await updateCertification(editItem._id || editItem.id, form);
      else await createCertification(form);
      setModal(false); load();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Save failed.' });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await deleteCertification(id); load(); }
    catch (err) { alert(err.response?.data?.message || 'Delete failed.'); }
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'issuer', label: 'Issuer', render: (v) => v || '—' },
    { key: 'issueDate', label: 'Date', render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
  ];

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="flex-between mb-3">
        <h1 className="admin-page-title">Certifications</h1>
        <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Add Cert</button>
      </div>
      <DataTable columns={columns} data={items} onEdit={openEdit} onDelete={handleDelete} />
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editItem ? 'Edit Cert' : 'Add Cert'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input name="title" className="form-input" value={form.title} onChange={handleChange} required />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Issuer</label>
              <input name="issuer" className="form-input" value={form.issuer} onChange={handleChange} placeholder="e.g. CompTIA" />
            </div>
            <div className="form-group">
              <label className="form-label">Issue Date</label>
              <input type="date" name="issueDate" className="form-input" value={form.issueDate} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Credential URL</label>
            <input name="credentialUrl" className="form-input" value={form.credentialUrl} onChange={handleChange} placeholder="https://..." />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea name="description" className="form-textarea" value={form.description} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select name="categoryId" className="form-select" value={form.categoryId} onChange={handleChange}>
              <option value="">No category</option>
              {categories.map((c) => <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>)}
            </select>
          </div>
          <ImageUpload label="Badge/Certificate Image" currentUrl={form.image} onUpload={(url) => setForm((f) => ({ ...f, image: url }))} />
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
