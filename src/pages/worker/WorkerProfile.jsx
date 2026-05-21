import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersAPI, verificationAPI } from '../../api/endpoints';
import { useAuth } from '../../context/AuthContext';

export default function WorkerProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(user);
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([usersAPI.me(), verificationAPI.status().catch(() => ({ data: null }))])
      .then(([u, v]) => { setProfile(u.data || user); setVerification(v.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={s.center}>Loading...</div>;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate('/worker/dashboard')}>← Dashboard</button>
        <h2 style={s.title}>My Profile</h2>
      </div>

      <div style={s.card}>
        <div style={s.avatarWrap}>
          <div style={s.avatar}>{profile?.full_name?.charAt(0) || 'W'}</div>
          <div>
            <h3 style={s.name}>{profile?.full_name}</h3>
            <p style={s.email}>{profile?.email}</p>
            <span style={s.roleBadge}>Worker</span>
          </div>
        </div>

        <div style={s.details}>
          {[
            { label: 'Phone', value: profile?.phone },
            { label: 'Country', value: profile?.country },
            { label: 'Member Since', value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-KE', { month: 'long', year: 'numeric' }) : '—' },
            { label: 'Verification', value: verification?.auto_approved ? '✅ Verified' : verification ? '⏳ In Progress' : 'Not started' },
          ].map(({ label, value }) => (
            <div key={label} style={s.row}>
              <span style={s.rowLabel}>{label}</span>
              <span style={s.rowValue}>{value || '—'}</span>
            </div>
          ))}
        </div>

        <button style={s.editBtn} onClick={() => navigate('/worker/profile/edit')}>Edit Profile</button>
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
  avatar: { width: '64px', height: '64px', borderRadius: '50%', background: '#148477', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 700, flexShrink: 0 },
  name: { fontSize: '1.1rem', fontWeight: 700, color: '#111', marginBottom: '2px' },
  email: { fontSize: '0.88rem', color: '#666', marginBottom: '6px' },
  roleBadge: { background: '#e8f5e9', color: '#2e7d32', fontSize: '0.75rem', fontWeight: 700, padding: '2px 10px', borderRadius: '12px' },
  details: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' },
  row: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f5f5f5' },
  rowLabel: { color: '#888', fontSize: '0.9rem' },
  rowValue: { color: '#222', fontWeight: 600, fontSize: '0.9rem' },
  editBtn: { width: '100%', padding: '12px', background: '#148477', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' },
};
