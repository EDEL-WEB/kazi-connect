import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workersAPI, verificationAPI } from '../../api/endpoints';

export default function WorkerSetup() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    hourly_rate: '',
    location: '',
    bio: '',
    latitude: null,
    longitude: null,
  });
  const [skills, setSkills] = useState([{ category_id: '', experience_years: 1 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    workersAPI.categories()
      .then(r => setCategories(r.data || []))
      .catch(() => {});
  }, []);

  const getLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm(f => ({ ...f, latitude: pos.coords.latitude, longitude: pos.coords.longitude }));
        setLocating(false);
      },
      () => setLocating(false)
    );
  };

  const addSkill = () => setSkills([...skills, { category_id: '', experience_years: 1 }]);
  const removeSkill = (i) => setSkills(skills.filter((_, idx) => idx !== i));
  const updateSkill = (i, key, val) => setSkills(skills.map((s, idx) => idx === i ? { ...s, [key]: val } : s));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validSkills = skills.filter(s => s.category_id);
    if (!validSkills.length) { setError('Please add at least one skill.'); return; }
    try {
      setLoading(true);
      setError('');
      await workersAPI.create({
        ...form,
        hourly_rate: Number(form.hourly_rate),
        skills: validSkills.map(s => ({ ...s, experience_years: Number(s.experience_years) })),
      });
      await verificationAPI.initiate();
      navigate('/verification/upload-id');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.step}>Step 1 of 2 — Profile Setup</div>
        <div style={s.icon}>👷</div>
        <h2 style={s.title}>Set Up Your Worker Profile</h2>
        <p style={s.sub}>Tell customers about your skills and experience.</p>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Hourly Rate */}
          <label style={s.label}>Hourly Rate (KSh)</label>
          <input style={s.input} type="number" min="1" placeholder="e.g. 500"
            value={form.hourly_rate} onChange={e => setForm({ ...form, hourly_rate: e.target.value })} required />

          {/* Location */}
          <label style={s.label}>Location</label>
          <div style={s.locRow}>
            <input style={{ ...s.input, marginBottom: 0, flex: 1 }} type="text" placeholder="e.g. Nairobi CBD"
              value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
            <button type="button" style={s.locBtn} onClick={getLocation} disabled={locating}>
              {locating ? '...' : '📍'}
            </button>
          </div>
          {form.latitude && (
            <p style={s.locHint}>📍 GPS: {form.latitude.toFixed(4)}, {form.longitude.toFixed(4)}</p>
          )}

          {/* Bio */}
          <label style={{ ...s.label, marginTop: '14px' }}>Bio</label>
          <textarea style={s.textarea} rows={3} placeholder="e.g. 5 years experience in plumbing and pipe fitting..."
            value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />

          {/* Skills */}
          <label style={{ ...s.label, marginTop: '14px' }}>Skills</label>
          {skills.map((skill, i) => (
            <div key={i} style={s.skillRow}>
              <select style={s.skillSelect} value={skill.category_id}
                onChange={e => updateSkill(i, 'category_id', e.target.value)} required>
                <option value="">Select skill</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <div style={s.expWrap}>
                <input style={s.expInput} type="number" min="1" max="50" placeholder="Yrs"
                  value={skill.experience_years} onChange={e => updateSkill(i, 'experience_years', e.target.value)} />
                <span style={s.expLabel}>yrs</span>
              </div>
              {skills.length > 1 && (
                <button type="button" style={s.removeSkill} onClick={() => removeSkill(i)}>✕</button>
              )}
            </div>
          ))}
          <button type="button" style={s.addSkillBtn} onClick={addSkill}>+ Add another skill</button>

          <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Continue to Verification →'}
          </button>
        </form>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', fontFamily: 'Poppins, sans-serif', padding: '24px' },
  card: { background: '#fff', borderRadius: '16px', padding: '32px 28px', width: '100%', maxWidth: '500px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  step: { fontSize: '0.78rem', color: '#148477', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' },
  icon: { fontSize: '2.2rem', marginBottom: '8px' },
  title: { fontSize: '1.4rem', fontWeight: 700, color: '#111', marginBottom: '6px' },
  sub: { color: '#666', fontSize: '0.9rem', marginBottom: '20px' },
  error: { background: '#ffebee', color: '#c62828', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.88rem' },
  label: { display: 'block', fontWeight: 600, fontSize: '0.88rem', color: '#333', marginBottom: '6px' },
  input: { width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', marginBottom: '14px', fontFamily: 'Poppins, sans-serif' },
  textarea: { width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', marginBottom: '14px', resize: 'vertical', fontFamily: 'Poppins, sans-serif' },
  locRow: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' },
  locBtn: { padding: '11px 14px', background: '#f0faf9', border: '1.5px solid #148477', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' },
  locHint: { fontSize: '0.78rem', color: '#148477', marginBottom: '14px', marginTop: '4px' },
  skillRow: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' },
  skillSelect: { flex: 1, padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', fontFamily: 'Poppins, sans-serif' },
  expWrap: { display: 'flex', alignItems: 'center', gap: '4px' },
  expInput: { width: '56px', padding: '10px 8px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', textAlign: 'center', fontFamily: 'Poppins, sans-serif' },
  expLabel: { fontSize: '0.82rem', color: '#888', whiteSpace: 'nowrap' },
  removeSkill: { background: 'none', border: 'none', color: '#c62828', cursor: 'pointer', fontSize: '1rem', padding: '4px' },
  addSkillBtn: { width: '100%', background: 'none', border: '1.5px dashed #148477', color: '#148477', borderRadius: '8px', padding: '9px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 500, marginBottom: '20px', fontFamily: 'Poppins, sans-serif' },
  btn: { width: '100%', padding: '13px', background: '#148477', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' },
};
