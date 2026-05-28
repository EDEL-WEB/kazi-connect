import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersAPI, workersAPI, categoriesAPI } from '../../api/endpoints';
import { useAuth } from '../../context/AuthContext';
import { useGeoLocation } from '../../hooks/useGeoLocation';

export default function EditWorkerProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({ full_name: '', phone: '', location: '', latitude: null, longitude: null });
  const [categories, setCategories] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]); // array of category_ids
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSkills, setSavingSkills] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { coords, locating, getOnce } = useGeoLocation();

  useEffect(() => {
    Promise.all([usersAPI.me(), workersAPI.me(), categoriesAPI.list()])
      .then(([uRes, wRes, cRes]) => {
        const u = uRes.data || user;
        setForm({ full_name: u.full_name || '', phone: u.phone || '', location: u.location || '', latitude: u.latitude || null, longitude: u.longitude || null });
        const workerSkills = wRes.data?.skills || [];
        setSelectedSkills(workerSkills.map(s => s.category_id || s));
        setCategories(cRes.data || []);
      })
      .catch(() => setError('Failed to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!coords) return;
    setForm(f => ({ ...f, latitude: coords.latitude, longitude: coords.longitude, location: coords.location || f.location }));
  }, [coords]);

  const toggleSkill = (catId) => {
    setSelectedSkills(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await workersAPI.updateLocation({ location: form.location, latitude: form.latitude, longitude: form.longitude });
      setSuccess('Profile updated.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSkills = async () => {
    if (selectedSkills.length === 0) { setError('Select at least one skill.'); return; }
    setSavingSkills(true);
    setError('');
    try {
      await workersAPI.updateSkills({ skills: selectedSkills.map(id => ({ category_id: id, experience_years: 1 })) });
      setSuccess('Skills updated.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update skills.');
    } finally {
      setSavingSkills(false);
    }
  };

  if (loading) return <div style={s.center}>Loading...</div>;

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate('/worker/profile')}>← Profile</button>
      <div style={s.card}>
        <h2 style={s.title}>Edit Profile</h2>
        {error && <div style={s.error}>{error}</div>}
        {success && <div style={s.success}>{success}</div>}

        <form onSubmit={handleSaveProfile}>
          <label style={s.label}>Full Name</label>
          <input style={s.input} value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />

          <label style={s.label}>Phone</label>
          <input style={s.input} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />

          <label style={s.label}>Location</label>
          <div style={s.locRow}>
            <input style={{ ...s.input, marginBottom: 0, flex: 1 }} value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              placeholder="Tap 📍 or type your location" />
            <button type="button" style={s.locBtn} onClick={getOnce} disabled={locating}>
              {locating ? '⏳' : '📍'}
            </button>
          </div>
          {form.latitude && <p style={s.locHint}>📡 {form.latitude.toFixed(5)}, {form.longitude.toFixed(5)}</p>}

          <button style={s.btn} type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>

        <div style={s.divider} />

        <h3 style={s.subtitle}>My Skills</h3>
        <p style={s.hint}>Select all categories you can work in.</p>
        <div style={s.skillsGrid}>
          {categories.map(c => {
            const active = selectedSkills.includes(c.id);
            return (
              <button key={c.id} type="button"
                style={{ ...s.skillChip, ...(active ? s.skillChipActive : {}) }}
                onClick={() => toggleSkill(c.id)}>
                {c.icon || '🛠'} {c.name}
              </button>
            );
          })}
        </div>
        <button style={s.btn} onClick={handleSaveSkills} disabled={savingSkills}>
          {savingSkills ? 'Saving Skills...' : 'Save Skills'}
        </button>
      </div>
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '480px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  center: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' },
  card: { background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  title: { fontSize: '1.3rem', fontWeight: 700, color: '#111', marginBottom: '20px' },
  subtitle: { fontSize: '1rem', fontWeight: 700, color: '#111', marginBottom: '6px' },
  hint: { fontSize: '0.83rem', color: '#888', marginBottom: '14px' },
  error: { background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.9rem' },
  success: { background: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.9rem' },
  label: { display: 'block', fontWeight: 600, fontSize: '0.9rem', color: '#333', marginBottom: '6px' },
  input: { width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', marginBottom: '16px', boxSizing: 'border-box' },
  locRow: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' },
  locBtn: { padding: '11px 14px', background: '#f0faf9', border: '1.5px solid #148477', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', flexShrink: 0 },
  locHint: { fontSize: '0.75rem', color: '#148477', marginBottom: '14px' },
  btn: { width: '100%', padding: '12px', background: '#148477', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem', marginTop: '8px' },
  divider: { borderTop: '1px solid #f0f0f0', margin: '24px 0' },
  skillsGrid: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' },
  skillChip: { padding: '8px 14px', borderRadius: '20px', border: '1.5px solid #e0e0e0', background: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, color: '#555' },
  skillChipActive: { background: '#148477', color: '#fff', borderColor: '#148477' },
};
