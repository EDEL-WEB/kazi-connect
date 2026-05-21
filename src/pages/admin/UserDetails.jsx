import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminAPI } from '../../api/endpoints';

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.allUsers({})
      .then(r => {
        const users = Array.isArray(r.data) ? r.data : r.data?.users || [];
        setUser(users.find(u => u.id === id) || null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';
  const roleColor = { customer: '#1976d2', worker: '#2e7d32', admin: '#c62828' };

  if (loading) return <div style={s.center}>Loading...</div>;
  if (!user) return <div style={s.center}><div style={s.error}>User not found.</div></div>;

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate('/admin/users')}>← Users</button>
      <div style={s.card}>
        <div style={s.avatarWrap}>
          <div style={s.avatar}>{user.full_name?.charAt(0) || 'U'}</div>
          <div>
            <h2 style={s.name}>{user.full_name}</h2>
            <span style={{ ...s.badge, background: (roleColor[user.role] || '#999') + '22', color: roleColor[user.role] || '#999' }}>{user.role}</span>
          </div>
        </div>
        <div style={s.details}>
          {[
            { label: 'Email', value: user.email },
            { label: 'Phone', value: user.phone },
            { label: 'Country', value: user.country },
            { label: 'Joined', value: fmt(user.created_at) },
            { label: 'Verified', value: user.is_verified ? '✅ Yes' : '❌ No' },
          ].map(({ label, value }) => (
            <div key={label} style={s.row}>
              <span style={s.lbl}>{label}</span>
              <span>{value || '—'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '560px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  center: { minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' },
  card: { background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  avatarWrap: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  avatar: { width: '60px', height: '60px', borderRadius: '50%', background: '#148477', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, flexShrink: 0 },
  name: { fontSize: '1.1rem', fontWeight: 700, color: '#111', marginBottom: '6px' },
  badge: { padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700, textTransform: 'capitalize' },
  details: { display: 'flex', flexDirection: 'column', gap: '10px' },
  row: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f5f5f5', fontSize: '0.9rem' },
  lbl: { color: '#888' },
  error: { background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px' },
};
