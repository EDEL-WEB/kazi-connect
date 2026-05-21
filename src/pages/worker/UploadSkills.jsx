import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verificationAPI } from '../../api/endpoints';

export default function UploadSkills() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selected].slice(0, 5));
  };

  const removeFile = (i) => setFiles(files.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.length) { setError('Please upload at least one document.'); return; }
    try {
      setLoading(true);
      setError('');
      const formData = new FormData();
      files.forEach(f => formData.append('documents', f));
      await verificationAPI.uploadSkills(formData);
      navigate('/verification/status');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload documents.');
    } finally {
      setLoading(false);
    }
  };

  const pts = files.length >= 3 ? 25 : files.length >= 1 ? 15 : 0;
  const ptsColor = files.length >= 3 ? '#2e7d32' : files.length >= 1 ? '#e65100' : '#999';

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.progress}>Step 4 of 4</div>
        <div style={s.icon}>📄</div>
        <h2 style={s.title}>Skill Documents</h2>
        <p style={s.sub}>Upload certificates or portfolio files. Worth up to <strong>25 points</strong>.</p>

        <div style={s.infoBox}>
          <div>📄 3+ documents — 25 pts</div>
          <div>📄 1–2 documents — 15 pts</div>
          <div>📄 0 documents — 0 pts</div>
        </div>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={s.uploadBox} onClick={() => document.getElementById('skills-input').click()}>
            <div style={s.placeholder}>
              <span style={s.uploadIcon}>📎</span>
              <span>Tap to add documents</span>
              <span style={{ fontSize: '0.78rem', color: '#888' }}>PDF, JPG, PNG (max 5 files)</span>
            </div>
            <input id="skills-input" type="file" accept=".pdf,image/*" multiple style={{ display: 'none' }} onChange={handleFiles} />
          </div>

          {files.length > 0 && (
            <div style={s.fileList}>
              {files.map((f, i) => (
                <div key={i} style={s.fileItem}>
                  <span style={s.fileIcon}>{f.type.includes('pdf') ? '📄' : '🖼️'}</span>
                  <span style={s.fileName}>{f.name}</span>
                  <button type="button" style={s.removeBtn} onClick={() => removeFile(i)}>✕</button>
                </div>
              ))}
            </div>
          )}

          <div style={{ ...s.scorePreview, color: ptsColor }}>
            {files.length} file{files.length !== 1 ? 's' : ''} — <strong>{pts} pts</strong>
          </div>

          <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? 'Uploading...' : 'Finish & View Status →'}
          </button>
        </form>

        <button style={s.back} onClick={() => navigate('/verification/upload-selfie')}>← Back</button>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', fontFamily: 'Poppins, sans-serif', padding: '24px' },
  card: { background: '#fff', borderRadius: '16px', padding: '32px 28px', width: '100%', maxWidth: '480px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  progress: { fontSize: '0.78rem', color: '#148477', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' },
  icon: { fontSize: '2.2rem', marginBottom: '8px' },
  title: { fontSize: '1.4rem', fontWeight: 700, color: '#111', marginBottom: '6px' },
  sub: { color: '#666', fontSize: '0.9rem', marginBottom: '16px' },
  infoBox: { background: '#f0faf9', borderRadius: '8px', padding: '12px 14px', fontSize: '0.83rem', color: '#444', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '4px' },
  error: { background: '#ffebee', color: '#c62828', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.88rem' },
  uploadBox: { width: '100%', height: '110px', border: '2px dashed #148477', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fffe', marginBottom: '12px' },
  placeholder: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#148477', fontSize: '0.88rem', fontWeight: 500 },
  uploadIcon: { fontSize: '2rem' },
  fileList: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' },
  fileItem: { display: 'flex', alignItems: 'center', gap: '10px', background: '#f9f9f9', borderRadius: '8px', padding: '10px 12px' },
  fileIcon: { fontSize: '1.2rem', flexShrink: 0 },
  fileName: { flex: 1, fontSize: '0.85rem', color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  removeBtn: { background: 'none', border: 'none', color: '#c62828', cursor: 'pointer', fontSize: '0.9rem', flexShrink: 0 },
  scorePreview: { fontSize: '0.88rem', marginBottom: '14px', padding: '8px 12px', background: '#fafafa', borderRadius: '8px' },
  btn: { width: '100%', padding: '13px', background: '#148477', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', marginBottom: '12px', fontFamily: 'Poppins, sans-serif' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 500, fontFamily: 'Poppins, sans-serif' },
};
