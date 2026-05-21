import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobsAPI } from '../../api/endpoints';

export default function CancelJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCancel = async () => {
    try {
      setLoading(true);
      await jobsAPI.updateStatus(id, { status: 'cancelled', reason });
      navigate('/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate(`/jobs/${id}`)}>← Back</button>
      <div style={s.card}>
        <div style={s.icon}>⚠️</div>
        <h2 style={s.title}>Cancel Job</h2>
        <p style={s.sub}>Are you sure you want to cancel this job? This action cannot be undone.</p>
        {error && <div style={s.error}>{error}</div>}
        <label style={s.label}>Reason (optional)</label>
        <textarea style={s.textarea} rows={3} value={reason} onChange={e => setReason(e.target.value)} placeholder="Why are you cancelling?" />
        <div style={s.btns}>
          <button style={s.btnGhost} onClick={() => navigate(`/jobs/${id}`)}>Keep Job</button>
          <button style={s.btnRed} onClick={handleCancel} disabled={loading}>{loading ? 'Cancelling...' : 'Cancel Job'}</button>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '440px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' },
  card: { background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', textAlign: 'center' },
  icon: { fontSize: '2.5rem', marginBottom: '12px' },
  title: { fontSize: '1.3rem', fontWeight: 700, color: '#111', marginBottom: '8px' },
  sub: { color: '#666', fontSize: '0.9rem', marginBottom: '20px' },
  error: { background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.9rem', textAlign: 'left' },
  label: { display: 'block', fontWeight: 600, fontSize: '0.9rem', color: '#333', marginBottom: '6px', textAlign: 'left' },
  textarea: { width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', marginBottom: '20px', resize: 'vertical' },
  btns: { display: 'flex', gap: '10px' },
  btnGhost: { flex: 1, padding: '11px', background: 'none', border: '1.5px solid #e0e0e0', color: '#555', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' },
  btnRed: { flex: 1, padding: '11px', background: '#c62828', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' },
};
