import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { paymentsAPI } from '../../api/endpoints';

export default function RefundPayment() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRefund = async () => {
    try {
      setLoading(true);
      await paymentsAPI.refund(jobId);
      navigate('/wallet');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process refund.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate(`/jobs/${jobId}`)}>← Back</button>
      <div style={s.card}>
        <div style={s.icon}>↩️</div>
        <h2 style={s.title}>Request Refund</h2>
        <p style={s.sub}>The escrow funds will be returned to your wallet. This is typically processed after a dispute is resolved in your favour.</p>
        {error && <div style={s.error}>{error}</div>}
        <div style={s.btns}>
          <button style={s.btnGhost} onClick={() => navigate(`/jobs/${jobId}`)}>Cancel</button>
          <button style={s.btnBlue} onClick={handleRefund} disabled={loading}>{loading ? 'Processing...' : 'Request Refund'}</button>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '440px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' },
  card: { background: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', textAlign: 'center' },
  icon: { fontSize: '2.5rem', marginBottom: '12px' },
  title: { fontSize: '1.3rem', fontWeight: 700, color: '#111', marginBottom: '8px' },
  sub: { color: '#666', fontSize: '0.9rem', marginBottom: '24px' },
  error: { background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.9rem' },
  btns: { display: 'flex', gap: '10px' },
  btnGhost: { flex: 1, padding: '11px', background: 'none', border: '1.5px solid #e0e0e0', color: '#555', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' },
  btnBlue: { flex: 1, padding: '11px', background: '#1565c0', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' },
};
