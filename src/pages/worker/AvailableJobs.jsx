import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '../../api/endpoints';

export default function AvailableJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    jobsAPI.availableJobs()
      .then(r => setJobs(r.data?.jobs || r.data || []))
      .catch(() => setError('Failed to load jobs.'))
      .finally(() => setLoading(false));
  }, []);

  const money = (v) => v != null ? `KSh ${Number(v).toLocaleString()}` : '—';
  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }) : '—';

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate('/worker/dashboard')}>← Dashboard</button>
        <h2 style={s.title}>Available Jobs</h2>
      </div>

      {error && <div style={s.error}>{error}</div>}
      {loading && <div style={s.empty}>Loading...</div>}

      {!loading && jobs.length === 0 && (
        <div style={s.empty}>📭 No job offers yet. You'll be notified when a customer selects you.</div>
      )}

      <div style={s.grid}>
        {jobs.map(j => (
          <div key={j.id} style={s.card}>
            <div style={s.cardTop}>
              <h3 style={s.jobTitle}>{j.title}</h3>
              <span style={s.newBadge}>New</span>
            </div>
            <p style={s.desc}>{j.description?.substring(0, 120)}{j.description?.length > 120 ? '…' : ''}</p>
            <div style={s.meta}>
              <span>📍 {j.location}</span>
              <span>💰 {money(j.budget)}</span>
              {j.distance_km != null && <span>🚶 {j.distance_km} km away</span>}
              <span>📅 {fmt(j.created_at)}</span>
            </div>
            <button style={s.btn} onClick={() => navigate(`/worker/jobs/${j.id}/accept`)}>
              Accept & Propose Rate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' },
  title: { fontSize: '1.4rem', fontWeight: 700, color: '#111' },
  error: { background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px', marginBottom: '16px' },
  empty: { textAlign: 'center', color: '#666', padding: '60px 0', fontSize: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' },
  card: { background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' },
  jobTitle: { fontSize: '1rem', fontWeight: 700, color: '#111', flex: 1 },
  newBadge: { background: '#e8f5e9', color: '#2e7d32', fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '12px', marginLeft: '8px' },
  desc: { color: '#666', fontSize: '0.88rem', marginBottom: '12px', lineHeight: 1.5 },
  meta: { display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '0.82rem', color: '#555', marginBottom: '14px' },
  btn: { width: '100%', padding: '10px', background: '#148477', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' },
};
