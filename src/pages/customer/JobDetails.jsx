import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobsAPI, paymentsAPI } from '../../api/endpoints';

const statusColor = { pending: '#f59e0b', accepted: '#3b82f6', in_progress: '#8b5cf6', completed: '#10b981', cancelled: '#ef4444' };

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [flash, setFlash] = useState('');

  useEffect(() => {
    jobsAPI.get(id)
      .then(r => setJob(r.data))
      .catch(() => setError('Failed to load job.'))
      .finally(() => setLoading(false));
  }, [id]);

  const showFlash = (msg) => { setFlash(msg); setTimeout(() => setFlash(''), 3000); };

  const releasePayment = async () => {
    try {
      await paymentsAPI.release(id);
      showFlash('Payment released to worker!');
      setJob(j => ({ ...j, status: 'completed' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to release payment.');
    }
  };

  const money = (v) => v != null ? `KSh ${Number(v).toLocaleString()}` : '—';
  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  if (loading) return <div style={s.center}>Loading...</div>;
  if (error && !job) return <div style={s.center}><div style={s.error}>{error}</div></div>;

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate('/jobs')}>← My Jobs</button>
      {flash && <div style={s.success}>{flash}</div>}
      {error && <div style={s.error}>{error}</div>}

      <div style={s.card}>
        <div style={s.cardTop}>
          <h2 style={s.title}>{job.title}</h2>
          <span style={{ ...s.badge, background: (statusColor[job.status] || '#999') + '22', color: statusColor[job.status] || '#999' }}>
            {job.status?.replace('_', ' ')}
          </span>
        </div>
        <p style={s.desc}>{job.description}</p>
        <div style={s.details}>
          {[
            { label: 'Location', value: job.location },
            { label: 'Budget', value: money(job.budget) },
            { label: 'Proposed Rate', value: money(job.proposed_rate) },
            { label: 'Category', value: job.category },
            { label: 'Posted', value: fmt(job.created_at) },
          ].map(({ label, value }) => (
            <div key={label} style={s.row}>
              <span style={s.rowLabel}>{label}</span>
              <span>{value || '—'}</span>
            </div>
          ))}
        </div>

        <div style={s.actions}>
          {job.status === 'accepted' && (
            <button style={s.btnBlue} onClick={() => navigate(`/jobs/${id}/approve-rate`)}>Approve Rate</button>
          )}
          {job.status === 'in_progress' && (
            <>
              <button style={s.btnGreen} onClick={releasePayment}>Release Payment</button>
              <button style={s.btnOutline} onClick={() => navigate(`/tracking/${id}`)}>Track Worker</button>
            </>
          )}
          {job.status === 'completed' && (
            <button style={s.btnBlue} onClick={() => navigate(`/reviews/create?jobId=${id}`)}>Leave Review</button>
          )}
          {['pending', 'accepted'].includes(job.status) && (
            <button style={s.btnRed} onClick={() => navigate(`/jobs/${id}/cancel`)}>Cancel Job</button>
          )}
          {job.status === 'in_progress' && (
            <button style={s.btnRed} onClick={() => navigate(`/jobs/${id}/dispute`)}>Dispute</button>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  center: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' },
  success: { background: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '8px', marginBottom: '12px', fontSize: '0.9rem' },
  error: { background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px', marginBottom: '12px', fontSize: '0.9rem' },
  card: { background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
  title: { fontSize: '1.3rem', fontWeight: 700, color: '#111', flex: 1 },
  badge: { padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'capitalize', marginLeft: '12px', whiteSpace: 'nowrap' },
  desc: { color: '#666', fontSize: '0.9rem', marginBottom: '20px', lineHeight: 1.6 },
  details: { display: 'flex', flexDirection: 'column', gap: '10px', background: '#f9f9f9', borderRadius: '10px', padding: '16px', marginBottom: '20px' },
  row: { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' },
  rowLabel: { color: '#888' },
  actions: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
  btnBlue: { padding: '10px 18px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' },
  btnGreen: { padding: '10px 18px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' },
  btnOutline: { padding: '10px 18px', background: 'none', border: '1.5px solid #148477', color: '#148477', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' },
  btnRed: { padding: '10px 18px', background: 'none', border: '1.5px solid #c62828', color: '#c62828', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' },
};
