import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { escrowAPI } from '../../api/endpoints';

const money = (v) => v != null ? `KES ${Number(v).toLocaleString()}` : '—';
const statusMeta = {
  held:     { color: '#1976d2', bg: '#dbeafe', icon: '🔐', label: 'Held in Escrow' },
  released: { color: '#148477', bg: '#e6f4f2', icon: '✅', label: 'Released' },
  refunded: { color: '#d97706', bg: '#fef3c7', icon: '↩️', label: 'Refunded' },
  disputed: { color: '#dc2626', bg: '#fee2e2', icon: '⚠️', label: 'Disputed' },
};

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

  if (loading) return <div style={s.center}><div style={s.spinner} /></div>;

  const meta = statusMeta[status?.status] || statusMeta.held;

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate(-1)}>← Job Details</button>
      <div style={s.card}>
        <div style={{ ...s.iconWrap, background: meta.bg }}>
          <span style={s.icon}>{meta.icon}</span>
        </div>
        <h2 style={s.title}>Escrow Status</h2>
        {error && <div style={s.error}>{error}</div>}
        {status && (
          <>
            <div style={{ ...s.badge, background: meta.bg, color: meta.color }}>{meta.label}</div>
            <div style={s.details}>
              <div style={s.row}><span style={s.lbl}>Amount Held</span><strong style={{ color: '#111827' }}>{money(status.amount)}</strong></div>
              <div style={s.row}><span style={s.lbl}>Created</span><span style={s.val}>{status.created_at ? new Date(status.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</span></div>
            </div>
            {status.status === 'held' && (
              <div style={s.actions}>
                <button style={s.btnPrimary} onClick={() => navigate(`/payments/release/${jobId}`)}>💸 Release Payment</button>
                <button style={s.btnDanger} onClick={() => navigate(`/jobs/${jobId}/dispute`)}>⚠️ Dispute</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const s = {
  page:       { minHeight: '100vh', background: '#f4f6fb', padding: '32px 16px', fontFamily: 'Inter, sans-serif' },
  center:     { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  spinner:    { width: 36, height: 36, border: '3px solid #e0e0e0', borderTop: '3px solid #148477', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  back:       { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '20px' },
  card:       { background: '#fff', borderRadius: '20px', padding: '36px 32px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', maxWidth: '440px', margin: '0 auto', textAlign: 'center' },
  iconWrap:   { width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  icon:       { fontSize: '1.8rem' },
  title:      { fontSize: '1.4rem', fontWeight: 800, color: '#111827', marginBottom: '16px' },
  error:      { background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.875rem' },
  badge:      { display: 'inline-block', padding: '6px 18px', borderRadius: '20px', fontWeight: 700, fontSize: '0.85rem', marginBottom: '20px' },
  details:    { background: '#f8fafc', borderRadius: '12px', padding: '18px', marginBottom: '20px', textAlign: 'left', border: '1px solid #eaecf0' },
  row:        { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', marginBottom: '10px' },
  lbl:        { color: '#6b7280' },
  val:        { color: '#111827', fontWeight: 600 },
  actions:    { display: 'flex', gap: '12px' },
  btnPrimary: { flex: 1, padding: '12px', background: 'linear-gradient(135deg,#148477,#0d6b5e)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', boxShadow: '0 4px 12px rgba(20,132,119,0.3)' },
  btnDanger:  { flex: 1, padding: '12px', background: 'none', border: '1.5px solid #dc2626', color: '#dc2626', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' },
};
