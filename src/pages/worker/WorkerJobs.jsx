import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '../../api/endpoints';

const TABS = ['all', 'accepted', 'in_progress', 'completed', 'cancelled'];
const STATUS_COLOR = { pending: '#f59e0b', accepted: '#3b82f6', in_progress: '#8b5cf6', completed: '#10b981', cancelled: '#ef4444' };

export default function WorkerJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    jobsAPI.myJobs()
      .then(r => setJobs(r.data?.jobs || r.data || []))
      .catch(() => setError('Failed to load jobs.'))
      .finally(() => setLoading(false));
  }, []);

  const [updating, setUpdating] = useState(null);

  const filtered = tab === 'all' ? jobs : jobs.filter(j => j.status === tab);
  const money = (v) => v != null ? `KSh ${Number(v).toLocaleString()}` : '—';
  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  const updateStatus = async (e, jobId, status) => {
    e.stopPropagation();
    setUpdating(jobId);
    try {
      await jobsAPI.updateStatus(jobId, { status });
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status } : j));
    } catch {}
    setUpdating(null);
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate('/worker/dashboard')}>← Dashboard</button>
        <h2 style={s.title}>My Jobs</h2>
      </div>

      <div style={s.tabs}>
        {TABS.map(t => (
          <button key={t} style={{ ...s.tab, ...(tab === t ? s.tabActive : {}) }} onClick={() => setTab(t)}>
            {t.replace('_', ' ')}
          </button>
        ))}
      </div>

      {error && <div style={s.error}>{error}</div>}
      {loading && <div style={s.empty}>Loading...</div>}
      {!loading && filtered.length === 0 && <div style={s.empty}>No jobs found.</div>}

      <div style={s.list}>
        {filtered.map(j => (
          <div key={j.id} style={s.card} onClick={() => navigate(`/worker/jobs/${j.id}`)}>
            <div style={s.cardTop}>
              <h3 style={s.jobTitle}>{j.title}</h3>
              <span style={{ ...s.badge, background: (STATUS_COLOR[j.status] || '#999') + '22', color: STATUS_COLOR[j.status] || '#999' }}>
                {j.status?.replace('_', ' ')}
              </span>
            </div>
            <div style={s.meta}>
              <span>📍 {j.location}</span>
              <span>💰 {money(j.proposed_rate || j.budget)}</span>
              <span>📅 {fmt(j.created_at)}</span>
            </div>
            {(j.status === 'accepted' || j.status === 'in_progress') && (
              <div style={s.actions} onClick={e => e.stopPropagation()}>
                {j.status === 'accepted' && (
                  <button style={s.btnBlue} disabled={updating === j.id}
                    onClick={e => updateStatus(e, j.id, 'in_progress')}>
                    {updating === j.id ? '...' : '▶ Start'}
                  </button>
                )}
                {j.status === 'in_progress' && (
                  <button style={s.btnGreen} disabled={updating === j.id}
                    onClick={e => updateStatus(e, j.id, 'completed')}>
                    {updating === j.id ? '...' : '✓ Complete'}
                  </button>
                )}
                <button style={s.btnOutline} onClick={e => { e.stopPropagation(); navigate(`/worker/jobs/${j.id}/progress`); }}>Progress</button>
                <button style={s.btnOutline} onClick={e => { e.stopPropagation(); navigate(`/worker/tracking/${j.id}`); }}>📡 Track</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' },
  title: { fontSize: '1.4rem', fontWeight: 700, color: '#111' },
  tabs: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' },
  tab: { padding: '6px 14px', borderRadius: '20px', border: '1.5px solid #e0e0e0', background: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, textTransform: 'capitalize', color: '#555' },
  tabActive: { background: '#148477', color: '#fff', borderColor: '#148477' },
  error: { background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px', marginBottom: '16px' },
  empty: { textAlign: 'center', color: '#666', padding: '60px 0' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  card: { background: '#fff', borderRadius: '12px', padding: '18px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', cursor: 'pointer' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  jobTitle: { fontSize: '1rem', fontWeight: 700, color: '#111' },
  badge: { padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700, textTransform: 'capitalize' },
  meta: { display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.83rem', color: '#555' },
  actions: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f0f0f0' },
  btnBlue: { padding: '7px 14px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: '7px', fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' },
  btnGreen: { padding: '7px 14px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '7px', fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' },
  btnOutline: { padding: '7px 14px', background: 'none', border: '1.5px solid #148477', color: '#148477', borderRadius: '7px', fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' },
};
