import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobsAPI, paymentsAPI } from '../../api/endpoints';

const statusColor = { pending: '#f59e0b', accepted: '#3b82f6', in_progress: '#8b5cf6', completed: '#10b981', cancelled: '#ef4444' };

function WorkerCard({ worker, navigate }) {
  if (!worker) return null;
  return (
    <div style={s.workerCard}>
      <div style={s.workerTop}>
        <div style={s.workerAvatar}>{worker.full_name?.charAt(0) || 'W'}</div>
        <div>
          <div style={s.workerName}>{worker.full_name}</div>
          {worker.verified && <span style={s.verified}>✓ Verified</span>}
          {worker.phone && <div style={s.workerPhone}>📞 {worker.phone}</div>}
        </div>
      </div>
      {worker.skills?.length > 0 && (
        <div style={s.skills}>
          {worker.skills.map((sk, i) => <span key={i} style={s.skill}>{sk}</span>)}
        </div>
      )}
      <button style={s.profileBtn} onClick={() => navigate(`/workers/${worker.id}`)}>View Full Profile →</button>
    </div>
  );
}

function MatchedWorkerCard({ worker, onSelect, selecting }) {
  return (
    <div style={s.matchCard}>
      <div style={s.workerTop}>
        <div style={s.workerAvatar}>{worker.full_name?.charAt(0) || 'W'}</div>
        <div style={{ flex: 1 }}>
          <div style={s.workerName}>{worker.full_name}</div>
          {worker.verified && <span style={s.verified}>✓ Verified</span>}
          <div style={s.matchMeta}>
            {worker.rating > 0 && <span>★ {Number(worker.rating).toFixed(1)}</span>}
            {worker.location && <span>📍 {worker.location}</span>}
            {worker.hourly_rate > 0 && <span>💰 KSh {Number(worker.hourly_rate).toLocaleString()}/hr</span>}
          </div>
          {worker.skills?.length > 0 && (
            <div style={s.skills}>
              {worker.skills.map((sk, i) => <span key={i} style={s.skill}>{sk}</span>)}
            </div>
          )}
        </div>
      </div>
      <button style={s.selectBtn} onClick={() => onSelect(worker.worker_id)} disabled={selecting}>
        {selecting ? 'Selecting...' : 'Select This Worker'}
      </button>
    </div>
  );
}

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [matchedWorkers, setMatchedWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [flash, setFlash] = useState('');
  const [selecting, setSelecting] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    jobsAPI.get(id)
      .then(r => {
        setJob(r.data);
        setMatchedWorkers(r.data.matched_workers || []);
      })
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

  const selectWorker = async (workerId) => {
    setSelecting(workerId);
    try {
      await jobsAPI.assignWorker(id, workerId);
      showFlash('Worker selected and notified! They will accept and propose a rate.');
      setMatchedWorkers([]);
      setJob(j => ({ ...j, assigned_worker_id: workerId }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to select worker.');
    } finally {
      setSelecting(null);
    }
  };

  const deleteJob = async () => {
    if (!window.confirm('Delete this job permanently?')) return;
    setDeleting(true);
    try {
      await jobsAPI.delete(id);
      navigate('/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete job.');
      setDeleting(false);
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
            { label: 'Posted', value: fmt(job.created_at) },
          ].map(({ label, value }) => (
            <div key={label} style={s.row}>
              <span style={s.rowLabel}>{label}</span>
              <span>{value || '—'}</span>
            </div>
          ))}
        </div>

        {/* Assigned worker (after customer selects) */}
        {job.worker && (
          <>
            <div style={s.sectionLabel}>Assigned Worker</div>
            <WorkerCard worker={job.worker} navigate={navigate} />
          </>
        )}

        {/* Matched workers — only shown when job is pending and no worker assigned yet */}
        {job.status === 'pending' && !job.assigned_worker_id && matchedWorkers.length > 0 && (
          <>
            <div style={s.sectionLabel}>Suggested Workers Near You</div>
            <p style={s.sectionHint}>Select a worker to notify them about your job.</p>
            {matchedWorkers.map(w => (
              <MatchedWorkerCard key={w.worker_id} worker={w}
                onSelect={selectWorker} selecting={selecting === w.worker_id} />
            ))}
          </>
        )}

        {job.status === 'pending' && !job.assigned_worker_id && matchedWorkers.length === 0 && (
          <div style={s.noWorkers}>⏳ Looking for available workers in your area...</div>
        )}

        {job.status === 'pending' && job.assigned_worker_id && !job.worker && (
          <div style={s.waiting}>✅ Worker notified — waiting for them to accept and propose a rate.</div>
        )}

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
          {['completed', 'cancelled'].includes(job.status) && (
            <button style={{ ...s.btnRed, opacity: deleting ? 0.6 : 1 }} onClick={deleteJob} disabled={deleting}>
              {deleting ? 'Deleting...' : '🗑 Delete Job'}
            </button>
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
  sectionLabel: { fontSize: '0.78rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', marginTop: '4px' },
  sectionHint: { fontSize: '0.82rem', color: '#666', marginBottom: '12px' },
  workerCard: { background: '#f0faf9', borderRadius: '10px', padding: '16px', marginBottom: '20px', border: '1px solid #c8e6e3' },
  matchCard: { background: '#f9f9f9', borderRadius: '10px', padding: '16px', marginBottom: '12px', border: '1px solid #e0e0e0' },
  workerTop: { display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' },
  workerAvatar: { width: '48px', height: '48px', borderRadius: '50%', background: '#148477', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 700, flexShrink: 0 },
  workerName: { fontWeight: 700, color: '#111', fontSize: '0.95rem' },
  verified: { background: '#e8f5e9', color: '#2e7d32', fontSize: '0.72rem', fontWeight: 700, padding: '2px 7px', borderRadius: '10px', display: 'inline-block', marginTop: '2px' },
  workerPhone: { fontSize: '0.82rem', color: '#555', marginTop: '3px' },
  matchMeta: { display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '0.8rem', color: '#555', marginTop: '4px', marginBottom: '6px' },
  skills: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' },
  skill: { background: '#fff', color: '#148477', padding: '3px 10px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 600, border: '1px solid #c8e6e3' },
  profileBtn: { background: 'none', border: 'none', color: '#148477', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', padding: 0 },
  selectBtn: { width: '100%', padding: '10px', background: '#148477', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', marginTop: '8px' },
  noWorkers: { background: '#fff8e1', color: '#f57f17', padding: '12px', borderRadius: '8px', fontSize: '0.88rem', marginBottom: '16px' },
  waiting: { background: '#e8f5e9', color: '#2e7d32', padding: '12px', borderRadius: '8px', fontSize: '0.88rem', marginBottom: '16px' },
  actions: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' },
  btnBlue: { padding: '10px 18px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' },
  btnGreen: { padding: '10px 18px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' },
  btnOutline: { padding: '10px 18px', background: 'none', border: '1.5px solid #148477', color: '#148477', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' },
  btnRed: { padding: '10px 18px', background: 'none', border: '1.5px solid #c62828', color: '#c62828', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' },
};
