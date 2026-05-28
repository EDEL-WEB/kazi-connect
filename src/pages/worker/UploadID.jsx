import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verificationAPI } from '../../api/endpoints';

export default function UploadID() {
  const navigate = useNavigate();
  const [idNumber, setIdNumber] = useState('');
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showStatusLink, setShowStatusLink] = useState(false);

  const handleFile = (side, file) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    if (side === 'front') { setFrontFile(file); setFrontPreview(preview); }
    else { setBackFile(file); setBackPreview(preview); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!frontFile || !backFile) { setError('Please upload both front and back photos.'); return; }
    try {
      setLoading(true);
      setError('');
      setShowStatusLink(false);

      // Upload files via FormData
      const formData = new FormData();
      formData.append('national_id_number', idNumber);
      formData.append('front_photo', frontFile);
      formData.append('back_photo', backFile);

      const res = await verificationAPI.uploadId(formData);
      if (res.data.flagged) {
        setError('This ID number is already registered. If this is your ID, go to verification status to check your progress.');
        setShowStatusLink(true);
        return;
        return;
      }
      navigate('/verification/verify-phone');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to upload ID.';
      setError(msg);
      if (err.response?.status === 400 && msg.toLowerCase().includes('already registered')) {
        setShowStatusLink(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.progress}>Step 1 of 4</div>
        <div style={s.icon}>🪪</div>
        <h2 style={s.title}>Upload National ID</h2>
        <p style={s.sub}>Upload your national ID photos. Worth <strong>25 points</strong>.</p>

        {error && (
          <div style={s.error}>
            ⚠️ {error}
            {showStatusLink && (
              <div style={{ marginTop: '8px' }}>
                <button style={s.statusLink} onClick={() => navigate('/verification/status')}>
                  Check verification status →
                </button>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={s.label}>National ID Number</label>
          <input
            style={s.input}
            type="text"
            placeholder="e.g. 12345678"
            value={idNumber}
            onChange={e => setIdNumber(e.target.value)}
            required
          />

          <label style={s.label}>Front Photo</label>
          <div style={s.uploadBox} onClick={() => document.getElementById('front-input').click()}>
            {frontPreview
              ? <img src={frontPreview} alt="Front" style={s.preview} />
              : <div style={s.uploadPlaceholder}><span style={s.uploadIcon}>📷</span><span>Tap to upload front</span></div>
            }
            <input id="front-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile('front', e.target.files[0])} />
          </div>

          <label style={{ ...s.label, marginTop: '16px' }}>Back Photo</label>
          <div style={s.uploadBox} onClick={() => document.getElementById('back-input').click()}>
            {backPreview
              ? <img src={backPreview} alt="Back" style={s.preview} />
              : <div style={s.uploadPlaceholder}><span style={s.uploadIcon}>📷</span><span>Tap to upload back</span></div>
            }
            <input id="back-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile('back', e.target.files[0])} />
          </div>

          <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? 'Uploading...' : 'Continue →'}
          </button>
        </form>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', fontFamily: 'Poppins, sans-serif', padding: '24px' },
  card: { background: '#fff', borderRadius: '16px', padding: '32px 28px', width: '100%', maxWidth: '440px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  progress: { fontSize: '0.78rem', color: '#148477', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' },
  icon: { fontSize: '2.2rem', marginBottom: '8px' },
  title: { fontSize: '1.4rem', fontWeight: 700, color: '#111', marginBottom: '6px' },
  sub: { color: '#666', fontSize: '0.9rem', marginBottom: '20px' },
  error: { background: '#ffebee', color: '#c62828', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.88rem' },
  label: { display: 'block', fontWeight: 600, fontSize: '0.88rem', color: '#333', marginBottom: '8px' },
  input: { width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', marginBottom: '16px', fontFamily: 'Poppins, sans-serif' },
  uploadBox: { width: '100%', height: '140px', border: '2px dashed #148477', borderRadius: '12px', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fffe' },
  uploadPlaceholder: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#148477', fontSize: '0.88rem', fontWeight: 500 },
  uploadIcon: { fontSize: '2rem' },
  preview: { width: '100%', height: '100%', objectFit: 'cover' },
  btn: { width: '100%', padding: '13px', background: '#148477', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', marginTop: '20px', fontFamily: 'Poppins, sans-serif' },
  statusLink: { background: 'none', border: 'none', color: '#c62828', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'underline', padding: 0 },
};
