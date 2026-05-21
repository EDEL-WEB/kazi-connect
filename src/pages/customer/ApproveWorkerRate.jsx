import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobsAPI } from '../../api/endpoints';

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
    } finally {
      setSubmitting(false);
    }
  };

  const money = (v) => v != null ? `KSh ${Number(v).toLocaleString()}` : '—';

  if (loading) return <div style={s.center}>Loading...</div>;

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate(`/jobs/${id}`)}>← Back</button>
      <div style={s.card}>
        <h2 style={s.title}>Approve Worker Rate</h2>
        {error && <div style={s.error}>{error}</div>}
        {job && (
          <div style={s.info}>
            <p style={s.jobName}>{job.title}</p>
            <div style={s.row}><span style={s.lbl}>Your Budget</span><span>{money(job.budget)}</span></div>
            <div style={s.row}><span style={s.lbl}>Worker's Rate</span><strong style={{ color: '#148477' }}>{money(job.proposed_rate)}</strong></div>
          </div>
        )}
        <p style={s.hint}>By approving, you agree to pay the worker's proposed rate upon job completion.</p>
        <div style={s.btns}>
          <button style={s.btnGhost} onClick={() => navigate(`/jobs/${id}`)}>Decline</button>
          <button style={s.btnGreen} onClick={approve} disabled={submitting}>{submitting ? 'Approving...' : 'Approve Rate'}</button>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '480px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  center: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' },
  card: { background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  title: { fontSize: '1.3rem', fontWeight: 700, color: '#111', marginBottom: '20px' },
  error: { background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.9rem' },
  info: { background: '#f9f9f9', borderRadius: '10px', padding: '16px', marginBottom: '16px' },
  jobName: { fontWeight: 700, color: '#111', marginBottom: '12px' },
  row: { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px' },
  lbl: { color: '#888' },
  hint: { fontSize: '0.85rem', color: '#666', marginBottom: '20px' },
  btns: { display: 'flex', gap: '10px' },
  btnGhost: { flex: 1, padding: '11px', background: 'none', border: '1.5px solid #e0e0e0', color: '#555', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' },
  btnGreen: { flex: 1, padding: '11px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' },
};
