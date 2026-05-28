import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '../../api/endpoints';

const TABS = ['all', 'pending', 'accepted', 'in_progress', 'completed', 'cancelled'];
const statusColor = { pending: '#f59e0b', accepted: '#3b82f6', in_progress: '#8b5cf6', completed: '#10b981', cancelled: '#ef4444' };

export default function CustomerJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    jobsAPI.customerJobs()
      .then(r => setJobs(r.data || []))
      .catch(() => setError('Failed to load requests.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = tab === 'all' ? jobs : jobs.filter(j => j.status === tab);
  const money = (v) => v != null ? `KES ${Number(v).toLocaleString()}` : '—';
  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate('/dashboard')}>← Dashboard</button>
        <h2 style={s.title}>My Requests</h2>
        <button style={s.newBtn} onClick={() => navigate('/jobs/create')}>+ New Request</button>
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
          <div key={j.id} style={s.card} onClick={() => navigate(`/jobs/${j.id}`)}>
            <div style={s.cardTop}>
              <h3 style={s.jobTitle}>{j.title}</h3>
              <span style={{ ...s.badge, background: (statusColor[j.status] || '#999') + '22', color: statusColor[j.status] || '#999' }}>
                {j.status?.replace('_', ' ')}
              </span>
            </div>
            <div style={s.meta}>
              <span>📍 {j.location}</span>
              <span>💰 {money(j.budget)}</span>
              <span>📅 {fmt(j.created_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  header: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' },
  title: { fontSize: '1.4rem', fontWeight: 700, color: '#111', flex: 1 },
  newBtn: { padding: '8px 16px', background: '#148477', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' },
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
};
