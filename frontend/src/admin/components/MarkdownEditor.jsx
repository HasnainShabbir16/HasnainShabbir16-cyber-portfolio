import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

export default function MarkdownEditor({ value, onChange, label = 'Content', name = 'content' }) {
  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview'

  return (
    <div className="md-editor">
      <div className="form-label" style={{ marginBottom: '0.4rem' }}>{label}</div>

      <div className="md-editor__header">
        <button
          type="button"
          className={`tab-btn${activeTab === 'write' ? ' active' : ''}`}
          onClick={() => setActiveTab('write')}
        >
          Write
        </button>
        <button
          type="button"
          className={`tab-btn${activeTab === 'preview' ? ' active' : ''}`}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button>
        <button
          type="button"
          className={`tab-btn${activeTab === 'split' ? ' active' : ''}`}
          onClick={() => setActiveTab('split')}
        >
          Split
        </button>
      </div>

      <div className={`md-editor__panes${activeTab === 'split' ? ' md-editor__panes--split' : ''}`}>
        {(activeTab === 'write' || activeTab === 'split') && (
          <textarea
            name={name}
            className="form-textarea md-editor__textarea"
            value={value || ''}
            onChange={onChange}
            placeholder="Write your markdown here..."
          />
        )}
        {(activeTab === 'preview' || activeTab === 'split') && (
          <div className="md-editor__preview markdown-content">
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {value}
              </ReactMarkdown>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Nothing to preview yet.</p>
            )}
          </div>
        )}
      </div>

      <style>{`
        .md-editor { display: flex; flex-direction: column; }
        .md-editor__header { display: flex; border-bottom: 1px solid var(--border-color); margin-bottom: 0; }
        .md-editor__header .tab-btn { border-radius: var(--radius) var(--radius) 0 0; }
        .md-editor__panes { display: flex; gap: 0; }
        .md-editor__panes--split { gap: 1rem; }
        .md-editor__textarea { border-radius: 0 0 var(--radius) var(--radius); flex: 1; min-height: 350px; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.7; }
        .md-editor__panes--split .md-editor__textarea { border-radius: 0 0 0 var(--radius); }
        .md-editor__preview { flex: 1; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 0 0 var(--radius) var(--radius); padding: 1rem; min-height: 350px; overflow-y: auto; font-size: 0.875rem; }
        .md-editor__panes--split .md-editor__preview { border-radius: 0 0 var(--radius) 0; }
        @media (max-width: 768px) {
          .md-editor__panes--split { flex-direction: column; }
          .md-editor__panes--split .md-editor__textarea,
          .md-editor__panes--split .md-editor__preview { border-radius: 0 0 var(--radius) var(--radius); }
        }
      `}</style>
    </div>
  );
}
