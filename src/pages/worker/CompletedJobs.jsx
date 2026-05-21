import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '../../api/endpoints';

export default function CompletedJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    jobsAPI.myJobs()
      .then(r => setJobs((r.data?.jobs || r.data || []).filter(j => j.status === 'completed')))
      .catch(() => setError('Failed to load jobs.'))
      .finally(() => setLoading(false));
  }, []);

  const money = (v) => v != null ? `KSh ${Number(v).toLocaleString()}` : '—';
  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate('/worker/dashboard')}>← Dashboard</button>
        <h2 style={s.title}>Completed Jobs</h2>
      </div>
      {error && <div style={s.error}>{error}</div>}
      {loading && <div style={s.empty}>Loading...</div>}
      {!loading && jobs.length === 0 && <div style={s.empty}>✅ No completed jobs yet.</div>}
      <div style={s.list}>
        {jobs.map(j => (
          <div key={j.id} style={s.card} onClick={() => navigate(`/worker/jobs/${j.id}`)}>
            <div style={s.cardTop}>
              <h3 style={s.jobTitle}>{j.title}</h3>
              <span style={s.badge}>✅ Completed</span>
            </div>
            <div style={s.meta}>
              <span>📍 {j.location}</span>
              <span>💰 {money(j.proposed_rate || j.budget)}</span>
              <span>📅 {fmt(j.updated_at || j.created_at)}</span>
            </div>
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
  error: { background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px', marginBottom: '16px' },
  empty: { textAlign: 'center', color: '#666', padding: '60px 0' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  card: { background: '#fff', borderRadius: '12px', padding: '18px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', cursor: 'pointer' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  jobTitle: { fontSize: '1rem', fontWeight: 700, color: '#111' },
  badge: { background: '#e8f5e9', color: '#2e7d32', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 },
  meta: { display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.83rem', color: '#555' },
};
