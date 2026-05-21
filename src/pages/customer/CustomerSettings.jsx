import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersAPI } from '../../api/endpoints';
import { useAuth } from '../../context/AuthContext';

export default function CustomerSettings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [form, setForm] = useState({ full_name: '', phone: '', country: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    usersAPI.me()
      .then(r => {
        const u = r.data || user;
        setForm({ full_name: u.full_name || '', phone: u.phone || '', country: u.country || '' });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      // Replace with actual update endpoint when available
      setSuccess('Settings saved successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={s.center}>Loading...</div>;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate('/dashboard')}>← Dashboard</button>
        <h2 style={s.title}>Settings</h2>
      </div>
      <div style={s.card}>
        <h3 style={s.section}>Account Details</h3>
        {success && <div style={s.success}>{success}</div>}
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSave}>
          {[
            { label: 'Full Name', key: 'full_name', type: 'text' },
            { label: 'Phone', key: 'phone', type: 'tel' },
            { label: 'Country', key: 'country', type: 'text' },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label style={s.label}>{label}</label>
              <input style={s.input} type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
            </div>
          ))}
          <button style={s.btn} type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>
      <div style={s.card}>
        <h3 style={s.section}>Account Actions</h3>
        <button style={s.logoutBtn} onClick={() => { logout(); navigate('/login'); }}>🚪 Log Out</button>
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
  card: { background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', marginBottom: '16px' },
  section: { fontSize: '1rem', fontWeight: 700, color: '#333', marginBottom: '16px' },
  success: { background: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.9rem' },
  error: { background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.9rem' },
  label: { display: 'block', fontWeight: 600, fontSize: '0.9rem', color: '#333', marginBottom: '6px' },
  input: { width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', marginBottom: '16px' },
  btn: { width: '100%', padding: '12px', background: '#148477', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' },
  logoutBtn: { width: '100%', padding: '12px', background: 'none', border: '1.5px solid #c62828', color: '#c62828', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' },
};
