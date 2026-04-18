import { useState, useEffect } from 'react';
import DataTable from './components/DataTable.jsx';
import Modal from '../components/Modal.jsx';
import { PageLoader } from '../components/LoadingSpinner.jsx';
import { getMessages, markMessageRead, deleteMessage } from '../api/admin.js';

export default function MessagesAdmin() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = () => {
    setLoading(true);
    getMessages()
      .then((r) => setMessages(r.data?.messages || r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleView = async (msg) => {
    setSelected(msg);
    if (!msg.read) {
      try {
        await markMessageRead(msg._id || msg.id);
        setMessages((msgs) => msgs.map((m) => m._id === msg._id ? { ...m, read: true } : m));
      } catch {}
    }
  };

  const handleDelete = async (id) => {
    try { await deleteMessage(id); load(); }
    catch (err) { alert(err.response?.data?.message || 'Delete failed.'); }
  };

  const columns = [
    {
      key: 'read',
      label: '',
      render: (v) => v ? null : <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--neon-green)', display: 'inline-block', boxShadow: '0 0 6px rgba(0,255,65,0.5)' }} />,
    },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'subject', label: 'Subject', render: (v) => v || '—' },
    { key: 'createdAt', label: 'Date', render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
  ];

  if (loading) return <PageLoader />;

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <div className="flex-between mb-3">
        <div>
          <h1 className="admin-page-title">Messages</h1>
          {unread > 0 && (
            <span className="badge badge-easy" style={{ marginTop: '0.25rem' }}>{unread} unread</span>
          )}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={messages}
        onEdit={handleView}
        onDelete={handleDelete}
      />

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Message">
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="messages-detail-row">
              <span className="messages-detail-label">From</span>
              <span>{selected.name} ({selected.email})</span>
            </div>
            {selected.subject && (
              <div className="messages-detail-row">
                <span className="messages-detail-label">Subject</span>
                <span>{selected.subject}</span>
              </div>
            )}
            <div className="messages-detail-row">
              <span className="messages-detail-label">Date</span>
              <span>{selected.createdAt ? new Date(selected.createdAt).toLocaleString() : '—'}</span>
            </div>
            <div>
              <span className="messages-detail-label">Message</span>
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', padding: '1rem', marginTop: '0.5rem', color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>
                {selected.message}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <a href={`mailto:${selected.email}`} className="btn btn-outline btn-sm">Reply via Email</a>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        )}
      </Modal>

      <style>{`
        .messages-detail-row { display: flex; gap: 1rem; align-items: flex-start; }
        .messages-detail-label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); font-family: var(--font-mono); min-width: 70px; padding-top: 2px; }
      `}</style>
    </div>
  );
}
