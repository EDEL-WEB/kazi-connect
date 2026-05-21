import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobUpdatesAPI } from '../../api/endpoints';

export default function UploadPhotos() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [urls, setUrls] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateUrl = (i, val) => setUrls(urls.map((u, idx) => idx === i ? val : u));
  const addUrl = () => setUrls([...urls, '']);
  const removeUrl = (i) => setUrls(urls.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valid = urls.filter(u => u.trim());
    if (!valid.length) { setError('Add at least one photo URL.'); return; }
    try {
      setLoading(true);
      await jobUpdatesAPI.uploadPhotos(id, { photo_urls: valid });
      navigate(`/worker/jobs/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload photos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate(`/worker/jobs/${id}`)}>← Back</button>
      <div style={s.card}>
        <h2 style={s.title}>Upload Job Photos</h2>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {urls.map((url, i) => (
            <div key={i} style={s.row}>
              <input
                style={s.input}
                type="url"
                placeholder={`https://storage.com/photo${i + 1}.jpg`}
                value={url}
                onChange={e => updateUrl(i, e.target.value)}
              />
              {urls.length > 1 && (
                <button type="button" style={s.removeBtn} onClick={() => removeUrl(i)}>✕</button>
              )}
            </div>
          ))}
          <button type="button" style={s.addBtn} onClick={addUrl}>+ Add photo</button>
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Photos'}
          </button>
        </form>
      </div>
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '480px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' },
  card: { background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  title: { fontSize: '1.3rem', fontWeight: 700, color: '#111', marginBottom: '20px' },
  error: { background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.9rem' },
  row: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' },
  input: { flex: 1, padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' },
  removeBtn: { background: 'none', border: 'none', color: '#c62828', cursor: 'pointer', fontSize: '1rem' },
  addBtn: { width: '100%', background: 'none', border: '1.5px dashed #148477', color: '#148477', borderRadius: '8px', padding: '9px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, marginBottom: '16px' },
  btn: { width: '100%', padding: '12px', background: '#148477', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' },
};
