import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobsAPI, jobUpdatesAPI } from '../../api/endpoints';

export default function WorkerJobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [flash, setFlash] = useState('');

  useEffect(() => {
    jobsAPI.get(id)
      .then(r => setJob(r.data))
      .catch(() => setError('Failed to load job.'))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status) => {
    try {
      setUpdating(true);
      await jobsAPI.updateStatus(id, { status });
      setJob(j => ({ ...j, status }));
      setFlash(`Status updated to ${status.replace('_', ' ')}`);
      setTimeout(() => setFlash(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  const money = (v) => v != null ? `KSh ${Number(v).toLocaleString()}` : '—';
  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const statusColor = { pending: '#f59e0b', accepted: '#3b82f6', in_progress: '#8b5cf6', completed: '#10b981', cancelled: '#ef4444' };

  if (loading) return <div style={s.center}>Loading...</div>;
  if (error) return <div style={s.center}><div style={s.error}>{error}</div></div>;

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate('/worker/jobs')}>← My Jobs</button>

      {flash && <div style={s.success}>{flash}</div>}

      <div style={s.card}>
        <div style={s.cardTop}>
          <h2 style={s.title}>{job.title}</h2>
          <span style={{ ...s.badge, background: (statusColor[job.status] || '#999') + '22', color: statusColor[job.status] || '#999' }}>
            {job.status?.replace('_', ' ')}
          </span>
        </div>

        <p style={s.desc}>{job.description}</p>

        <div style={s.details}>
          <div style={s.row}><span style={s.label}>Location</span><span>{job.location}</span></div>
          <div style={s.row}><span style={s.label}>Budget</span><span>{money(job.budget)}</span></div>
          <div style={s.row}><span style={s.label}>Your Rate</span><span>{money(job.proposed_rate)}</span></div>
          <div style={s.row}><span style={s.label}>Posted</span><span>{fmt(job.created_at)}</span></div>
        </div>

        <div style={s.actions}>
        {job.status === 'accepted' && job.rate_status !== 'approved' && (
            <div style={s.waiting}>⏳ Waiting for customer to approve your rate before you can start.</div>
          )}
          {job.status === 'accepted' && job.rate_status === 'approved' && (
            <button style={s.btnBlue} onClick={() => updateStatus('in_progress')} disabled={updating}>
              Start Job
            </button>
          )}
          {job.status === 'in_progress' && (
            <button style={s.btnGreen} onClick={() => updateStatus('completed')} disabled={updating}>
              Mark Complete
            </button>
          )}
          <button style={s.btnOutline} onClick={() => navigate(`/worker/jobs/${id}/progress`)}>Update Progress</button>
          <button style={s.btnOutline} onClick={() => navigate(`/worker/jobs/${id}/notes`)}>Add Note</button>
          <button style={s.btnOutline} onClick={() => navigate(`/worker/jobs/${id}/photos`)}>Upload Photos</button>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  center: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' },
  success: { background: '#e8f5e9', color: '#2e7d32', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' },
  error: { background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px' },
  card: { background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
  title: { fontSize: '1.3rem', fontWeight: 700, color: '#111', flex: 1 },
  badge: { padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'capitalize', marginLeft: '12px', whiteSpace: 'nowrap' },
  desc: { color: '#666', fontSize: '0.9rem', marginBottom: '20px', lineHeight: 1.6 },
  details: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', background: '#f9f9f9', borderRadius: '10px', padding: '16px' },
  row: { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' },
  label: { color: '#888', fontWeight: 500 },
  actions: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
  waiting: { background: '#fff8e1', color: '#f57f17', padding: '12px 14px', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '10px', fontWeight: 500 },
  btnBlue: { padding: '10px 18px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' },
  btnGreen: { padding: '10px 18px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' },
  btnOutline: { padding: '10px 18px', background: 'none', border: '1.5px solid #148477', color: '#148477', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' },
};
