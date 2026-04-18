import { useState, useRef } from 'react';
import { uploadImage } from '../../api/admin.js';

/** Allow only safe image URL schemes to prevent XSS via javascript: URIs */
function sanitizeImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('data:image/')) return url;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') return url;
  } catch {
    // relative paths are fine
    if (/^\/[\w\-./]/.test(url)) return url;
  }
  return '';
}

export default function ImageUpload({ currentUrl, onUpload, label = 'Image' }) {
  const [preview, setPreview] = useState(sanitizeImageUrl(currentUrl));
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Local preview
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    setError('');
    try {
      const res = await uploadImage(file);
      const url = sanitizeImageUrl(res.data?.url || res.data?.imageUrl || '');
      setPreview(url || preview);
      onUpload(url);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload">
      <label className="form-label">{label}</label>

      {preview && (
        <div className="image-upload__preview">
          <img src={preview} alt="Preview" />
        </div>
      )}

      <div className="image-upload__actions">
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : preview ? 'Change Image' : 'Upload Image'}
        </button>
        {preview && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => { setPreview(''); onUpload(''); }}
          >
            Remove
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          style={{ display: 'none' }}
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <style>{`
        .image-upload { display: flex; flex-direction: column; gap: 0.625rem; }
        .image-upload__preview { width: 120px; height: 120px; border-radius: var(--radius); overflow: hidden; border: 1px solid var(--border-color); background: var(--bg-secondary); }
        .image-upload__preview img { width: 100%; height: 100%; object-fit: cover; }
        .image-upload__actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
      `}</style>
    </div>
  );
}
