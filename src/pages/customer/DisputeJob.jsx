import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { escrowAPI } from '../../api/endpoints';

export default function DisputeJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDispute = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await escrowAPI.dispute(id);
      navigate(`/jobs/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to raise dispute.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate(`/jobs/${id}`)}>← Back</button>
      <div style={s.card}>
        <div style={s.icon}>🛡️</div>
        <h2 style={s.title}>Raise a Dispute</h2>
        <p style={s.sub}>Our support team will review your case and mediate a resolution within 24–48 hours.</p>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleDispute}>
          <label style={s.label}>Reason for Dispute</label>
          <textarea style={s.textarea} rows={4} value={reason} onChange={e => setReason(e.target.value)} placeholder="Describe the issue in detail…" required />
          <button style={s.btn} type="submit" disabled={loading || !reason.trim()}>
            {loading ? 'Submitting...' : 'Submit Dispute'}
          </button>
        </form>
      </div>
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '480px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' },
  card: { background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', textAlign: 'center' },
  icon: { fontSize: '2.5rem', marginBottom: '12px' },
  title: { fontSize: '1.3rem', fontWeight: 700, color: '#111', marginBottom: '8px' },
  sub: { color: '#666', fontSize: '0.9rem', marginBottom: '20px' },
  error: { background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.9rem', textAlign: 'left' },
  label: { display: 'block', fontWeight: 600, fontSize: '0.9rem', color: '#333', marginBottom: '6px', textAlign: 'left' },
  textarea: { width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', marginBottom: '16px', resize: 'vertical' },
  btn: { width: '100%', padding: '12px', background: '#c62828', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' },
};
