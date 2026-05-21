import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { escrowAPI } from '../../api/endpoints';

export default function EscrowStatus() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    escrowAPI.status(jobId)
      .then(r => setStatus(r.data))
      .catch(() => setError('Failed to load escrow status.'))
      .finally(() => setLoading(false));
  }, [jobId]);

  const money = (v) => v != null ? `KSh ${Number(v).toLocaleString()}` : '—';
  const statusColor = { held: '#1976d2', released: '#2e7d32', refunded: '#e65100', disputed: '#c62828' };

  if (loading) return <div style={s.center}>Loading...</div>;

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate(`/jobs/${jobId}`)}>← Job Details</button>
      <div style={s.card}>
        <div style={s.icon}>🔐</div>
        <h2 style={s.title}>Escrow Status</h2>
        {error && <div style={s.error}>{error}</div>}
        {status && (
          <>
            <div style={{ ...s.badge, background: (statusColor[status.status] || '#999') + '22', color: statusColor[status.status] || '#999' }}>
              {status.status?.toUpperCase()}
            </div>
            <div style={s.details}>
              <div style={s.row}><span style={s.lbl}>Amount Held</span><strong>{money(status.amount)}</strong></div>
              <div style={s.row}><span style={s.lbl}>Created</span><span>{status.created_at ? new Date(status.created_at).toLocaleDateString() : '—'}</span></div>
            </div>
            {status.status === 'held' && (
              <div style={s.actions}>
                <button style={s.btnGreen} onClick={() => navigate(`/payments/release/${jobId}`)}>Release Payment</button>
                <button style={s.btnRed} onClick={() => navigate(`/jobs/${jobId}/dispute`)}>Dispute</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '440px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  center: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' },
  card: { background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', textAlign: 'center' },
  icon: { fontSize: '2.5rem', marginBottom: '12px' },
  title: { fontSize: '1.3rem', fontWeight: 700, color: '#111', marginBottom: '16px' },
  error: { background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.9rem' },
  badge: { display: 'inline-block', padding: '6px 16px', borderRadius: '20px', fontWeight: 700, fontSize: '0.85rem', marginBottom: '20px' },
  details: { display: 'flex', flexDirection: 'column', gap: '10px', background: '#f9f9f9', borderRadius: '10px', padding: '16px', marginBottom: '20px', textAlign: 'left' },
  row: { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' },
  lbl: { color: '#888' },
  actions: { display: 'flex', gap: '10px' },
  btnGreen: { flex: 1, padding: '11px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' },
  btnRed: { flex: 1, padding: '11px', background: 'none', border: '1.5px solid #c62828', color: '#c62828', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' },
};
