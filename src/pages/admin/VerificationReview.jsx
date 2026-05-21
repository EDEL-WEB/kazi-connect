import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { verificationAPI } from '../../api/endpoints';

export default function VerificationReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReview = async (approved) => {
    try {
      setLoading(true);
      await verificationAPI.adminReview(id, { approved, notes });
      navigate('/admin/verifications');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate('/admin/verifications')}>← Verifications</button>
      <div style={s.card}>
        <h2 style={s.title}>Review Verification</h2>
        <p style={s.sub}>Verification ID: <strong>{id}</strong></p>
        {error && <div style={s.error}>{error}</div>}
        <label style={s.label}>Admin Notes</label>
        <textarea style={s.textarea} rows={4} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add notes about this verification decision…" />
        <div style={s.btns}>
          <button style={s.btnRed} onClick={() => handleReview(false)} disabled={loading}>❌ Reject</button>
          <button style={s.btnGreen} onClick={() => handleReview(true)} disabled={loading}>✅ Approve</button>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '520px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' },
  card: { background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  title: { fontSize: '1.3rem', fontWeight: 700, color: '#111', marginBottom: '6px' },
  sub: { color: '#666', fontSize: '0.9rem', marginBottom: '20px' },
  error: { background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.9rem' },
  label: { display: 'block', fontWeight: 600, fontSize: '0.9rem', color: '#333', marginBottom: '6px' },
  textarea: { width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', marginBottom: '20px', resize: 'vertical' },
  btns: { display: 'flex', gap: '12px' },
  btnRed: { flex: 1, padding: '12px', background: '#c62828', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' },
  btnGreen: { flex: 1, padding: '12px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' },
};
