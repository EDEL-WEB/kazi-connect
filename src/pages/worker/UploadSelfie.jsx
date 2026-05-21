import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verificationAPI } from '../../api/endpoints';

export default function UploadSelfie() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError('Please upload a selfie photo.'); return; }
    try {
      setLoading(true);
      setError('');
      const formData = new FormData();
      formData.append('selfie', file);
      const res = await verificationAPI.uploadSelfie(formData);
      const { face_match_score } = res.data;
      if (face_match_score < 0.6) {
        setError(`Face match too low (${(face_match_score * 100).toFixed(0)}%). Please retake your selfie.`);
        return;
      }
      navigate('/verification/upload-skills');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process selfie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.progress}>Step 3 of 4</div>
        <div style={s.icon}>🤳</div>
        <h2 style={s.title}>Upload Selfie</h2>
        <p style={s.sub}>Your selfie will be matched against your ID photo. Worth up to <strong>30 points</strong>.</p>

        <div style={s.infoBox}>
          <div>✅ 80%+ match — Verified (+30 pts)</div>
          <div>👤 60–79% — Manual review</div>
          <div>🚩 &lt;60% — Flagged</div>
        </div>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={s.uploadBox} onClick={() => document.getElementById('selfie-input').click()}>
            {preview
              ? <img src={preview} alt="Selfie" style={s.preview} />
              : <div style={s.placeholder}><span style={s.uploadIcon}>🤳</span><span>Tap to upload selfie</span></div>
            }
            <input id="selfie-input" type="file" accept="image/*" capture="user" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
          </div>

          {preview && (
            <button type="button" style={s.retakeBtn} onClick={() => { setFile(null); setPreview(null); }}>
              Retake
            </button>
          )}

          <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading || !file}>
            {loading ? 'Processing...' : 'Continue →'}
          </button>
        </form>

        <button style={s.back} onClick={() => navigate('/verification/verify-phone')}>← Back</button>
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
  sub: { color: '#666', fontSize: '0.9rem', marginBottom: '16px' },
  infoBox: { background: '#f0faf9', borderRadius: '8px', padding: '12px 14px', fontSize: '0.83rem', color: '#444', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '4px' },
  error: { background: '#ffebee', color: '#c62828', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.88rem' },
  uploadBox: { width: '100%', height: '220px', border: '2px dashed #148477', borderRadius: '12px', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fffe', marginBottom: '12px' },
  placeholder: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#148477', fontSize: '0.88rem', fontWeight: 500 },
  uploadIcon: { fontSize: '2.5rem' },
  preview: { width: '100%', height: '100%', objectFit: 'cover' },
  retakeBtn: { width: '100%', padding: '9px', background: 'none', border: '1.5px solid #148477', color: '#148477', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem', marginBottom: '10px', fontFamily: 'Poppins, sans-serif' },
  btn: { width: '100%', padding: '13px', background: '#148477', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', marginBottom: '12px', fontFamily: 'Poppins, sans-serif' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 500, fontFamily: 'Poppins, sans-serif' },
};
