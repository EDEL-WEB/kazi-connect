import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobsAPI } from '../../api/endpoints';

const money = (v) => v != null ? `KES ${Number(v).toLocaleString()}` : '—';

export default function ApproveWorkerRate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    jobsAPI.get(id).then(r => setJob(r.data)).catch(() => setError('Failed to load job.')).finally(() => setLoading(false));
  }, [id]);

  const approve = async () => {
    try {
      setSubmitting(true);
      await jobsAPI.approveRate(id, {});
      navigate(`/jobs/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve rate.');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div style={s.center}><div style={s.spinner} /></div>;

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate(-1)}>← Back</button>
      <div style={s.card}>
        <div style={s.iconWrap}><span style={s.icon}>💰</span></div>
        <h2 style={s.title}>Approve Worker Rate</h2>
        <p style={s.sub}>Review the worker's proposed rate before confirming.</p>
        {error && <div style={s.error}>{error}</div>}
        {job && (
          <div style={s.info}>
            <p style={s.jobName}>{job.title}</p>
            <div style={s.row}><span style={s.lbl}>Your Budget</span><span style={s.val}>{money(job.budget)}</span></div>
            <div style={s.row}><span style={s.lbl}>Worker's Rate</span><strong style={{ color: '#148477', fontSize: '1.1rem' }}>{money(job.proposed_rate)}</strong></div>
            {job.location && <div style={s.row}><span style={s.lbl}>Location</span><span style={s.val}>📍 {job.location}</span></div>}
          </div>
        )}
        <p style={s.hint}>By approving, you agree to pay the worker's proposed rate upon job completion via escrow.</p>
        <div style={s.btns}>
          <button style={s.btnGhost} onClick={() => navigate(-1)}>Decline</button>
          <button style={s.btnPrimary} onClick={approve} disabled={submitting}>
            {submitting ? 'Approving…' : '✓ Approve Rate'}
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  page:       { minHeight: '100vh', background: '#f4f6fb', padding: '32px 16px', fontFamily: 'Inter, sans-serif' },
  center:     { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  spinner:    { width: 36, height: 36, border: '3px solid #e0e0e0', borderTop: '3px solid #148477', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  back:       { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: 6 },
  card:       { background: '#fff', borderRadius: '20px', padding: '36px 32px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', maxWidth: '480px', margin: '0 auto' },
  iconWrap:   { width: 64, height: 64, background: '#e6f4f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  icon:       { fontSize: '1.8rem' },
  title:      { fontSize: '1.4rem', fontWeight: 800, color: '#111827', marginBottom: '6px', textAlign: 'center' },
  sub:        { color: '#6b7280', fontSize: '0.9rem', marginBottom: '24px', textAlign: 'center' },
  error:      { background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.875rem' },
  info:       { background: '#f8fafc', borderRadius: '12px', padding: '18px', marginBottom: '20px', border: '1px solid #eaecf0' },
  jobName:    { fontWeight: 700, color: '#111827', marginBottom: '14px', fontSize: '1rem' },
  row:        { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', marginBottom: '10px' },
  lbl:        { color: '#6b7280' },
  val:        { color: '#111827', fontWeight: 600 },
  hint:       { fontSize: '0.82rem', color: '#9ca3af', marginBottom: '24px', lineHeight: 1.6, textAlign: 'center' },
  btns:       { display: 'flex', gap: '12px' },
  btnGhost:   { flex: 1, padding: '12px', background: 'none', border: '1.5px solid #e5e7eb', color: '#6b7280', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' },
  btnPrimary: { flex: 1, padding: '12px', background: 'linear-gradient(135deg,#148477,#0d6b5e)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(20,132,119,0.3)' },
};
