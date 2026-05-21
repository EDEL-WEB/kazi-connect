import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersAPI, jobsAPI, paymentsAPI } from '../../api/endpoints';
import { useAuth } from '../../context/AuthContext';

export default function CustomerProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(user);
  const [stats, setStats] = useState({ jobs: 0, completed: 0, spent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([usersAPI.me(), jobsAPI.myJobs(), paymentsAPI.wallet()])
      .then(([u, j, w]) => {
        setProfile(u.data || user);
        const jobs = j.data?.jobs || j.data || [];
        setStats({ jobs: jobs.length, completed: jobs.filter(x => x.status === 'completed').length, spent: w.data?.total_spent ?? 0 });
      })
      .finally(() => setLoading(false));
  }, []);

  const money = (v) => v != null ? `KSh ${Number(v).toLocaleString()}` : '—';

  if (loading) return <div style={s.center}>Loading...</div>;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate('/dashboard')}>← Dashboard</button>
        <h2 style={s.title}>My Profile</h2>
      </div>
      <div style={s.card}>
        <div style={s.avatarWrap}>
          <div style={s.avatar}>{profile?.full_name?.charAt(0) || 'C'}</div>
          <div>
            <h3 style={s.name}>{profile?.full_name}</h3>
            <p style={s.email}>{profile?.email}</p>
            <span style={s.roleBadge}>Customer</span>
          </div>
        </div>
        <div style={s.statsRow}>
          {[
            { label: 'Total Jobs', value: stats.jobs },
            { label: 'Completed', value: stats.completed },
            { label: 'Total Spent', value: money(stats.spent) },
          ].map(({ label, value }) => (
            <div key={label} style={s.stat}>
              <div style={s.statValue}>{value}</div>
              <div style={s.statLabel}>{label}</div>
            </div>
          ))}
        </div>
        <div style={s.details}>
          {[
            { label: 'Phone', value: profile?.phone },
            { label: 'Country', value: profile?.country },
            { label: 'Member Since', value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-KE', { month: 'long', year: 'numeric' }) : '—' },
          ].map(({ label, value }) => (
            <div key={label} style={s.row}>
              <span style={s.rowLabel}>{label}</span>
              <span>{value || '—'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '520px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  center: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' },
  title: { fontSize: '1.4rem', fontWeight: 700, color: '#111' },
  card: { background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  avatarWrap: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  avatar: { width: '64px', height: '64px', borderRadius: '50%', background: '#1976d2', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 700, flexShrink: 0 },
  name: { fontSize: '1.1rem', fontWeight: 700, color: '#111', marginBottom: '2px' },
  email: { fontSize: '0.88rem', color: '#666', marginBottom: '6px' },
  roleBadge: { background: '#e3f2fd', color: '#1565c0', fontSize: '0.75rem', fontWeight: 700, padding: '2px 10px', borderRadius: '12px' },
  statsRow: { display: 'flex', gap: '12px', marginBottom: '24px' },
  stat: { flex: 1, background: '#f9f9f9', borderRadius: '10px', padding: '14px', textAlign: 'center' },
  statValue: { fontSize: '1.2rem', fontWeight: 800, color: '#111', marginBottom: '4px' },
  statLabel: { fontSize: '0.78rem', color: '#888' },
  details: { display: 'flex', flexDirection: 'column', gap: '10px' },
  row: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f5f5f5', fontSize: '0.9rem' },
  rowLabel: { color: '#888' },
};
