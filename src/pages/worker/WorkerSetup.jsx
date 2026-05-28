import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { workersAPI, verificationAPI } from '../../api/endpoints';
import { useGeoLocation } from '../../hooks/useGeoLocation';

export default function WorkerSetup() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ location: '', bio: '', latitude: null, longitude: null, ward: '', subcounty: '', county: '' });
  const [skills, setSkills] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedYrs, setSelectedYrs] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [skillError, setSkillError] = useState('');
  const { coords, locating, getOnce } = useGeoLocation();
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const leafletMapRef = useRef(null);

  useEffect(() => {
    workersAPI.categories()
      .then(r => setCategories(r.data || []))
      .catch(() => {});
    getOnce();
  }, []);

  // Sync hook coords into form — deduplicate address parts
  useEffect(() => {
    if (!coords) return;
    const parts = [coords.ward, coords.subcounty, coords.county].filter(Boolean);
    const unique = [...new Set(parts)];
    const location = unique.join(', ') || coords.location;
    setForm(f => ({ ...f, latitude: coords.latitude, longitude: coords.longitude, location, ward: coords.ward, subcounty: coords.subcounty, county: coords.county }));
  }, [coords]);

  // Init Leaflet map once lat/lng is available
  useEffect(() => {
    if (!form.latitude || !form.longitude) return;
    if (typeof window === 'undefined') return;

    const init = () => {
      const L = window.L;
      if (!L || !mapRef.current) return;

      if (leafletMapRef.current) {
        leafletMapRef.current.setView([form.latitude, form.longitude], 14);
        if (markerRef.current) markerRef.current.setLatLng([form.latitude, form.longitude]);
        return;
      }

      const map = L.map(mapRef.current, { zoomControl: true, attributionControl: false })
        .setView([form.latitude, form.longitude], 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      const marker = L.marker([form.latitude, form.longitude], { draggable: true }).addTo(map);
      marker.on('dragend', async (e) => {
        const { lat, lng } = e.target.getLatLng();
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const data = await res.json();
          const a = data.address || {};
          const ward = a.village || a.suburb || a.neighbourhood || a.quarter || a.hamlet || a.city || '';
          const subcounty = a.city_district || a.county_district || a.town || a.county || '';
          const county = a.state_district || a.state || '';
          const location = [...new Set([ward, subcounty, county].filter(Boolean))].join(', ');
          setForm(f => ({ ...f, latitude: lat, longitude: lng, location, ward, subcounty, county }));
        } catch {
          setForm(f => ({ ...f, latitude: lat, longitude: lng }));
        }
      });
      leafletMapRef.current = map;
      markerRef.current = marker;
    };

    if (window.L) { init(); return; }
    // Lazy-load Leaflet CSS + JS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = init;
      document.head.appendChild(script);
    }
  }, [form.latitude, form.longitude]);


  const addSkillChip = () => {
    if (!selectedCat) return;
    if (skills.find(s => s.category_id === selectedCat)) {
      setSkillError('You already added this skill.');
      return;
    }
    setSkills([...skills, { category_id: selectedCat, experience_years: Number(selectedYrs) }]);
    setSelectedCat('');
    setSelectedYrs(1);
    setSkillError('');
  };

  const removeSkill = (id) => setSkills(skills.filter(s => s.category_id !== id));

  const getCatName = (id) => categories.find(c => String(c.id) === String(id))?.name || id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!skills.length) { setError('Please add at least one skill.'); return; }
    try {
      setLoading(true);
      setError('');
      await workersAPI.create({
        ...form,
        skills: skills.map(s => ({ ...s, experience_years: Number(s.experience_years) })),
      });
      await verificationAPI.initiate();
      navigate('/verification/upload-id');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || `Error ${err.response?.status}: Failed to save profile. Please try again.`);
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
          {/* Location */}
          <label style={s.label}>Location</label>
          <div style={s.locRow}>
            <input
              style={{ ...s.input, marginBottom: 0, flex: 1 }}
              type="text"
              placeholder={locating ? 'Detecting your location…' : 'Your location'}
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              required
            />
            <button type="button" style={s.locBtn} onClick={getOnce} disabled={locating} title="Use my current location">
              {locating ? '⏳' : '📍'}
            </button>
          </div>
          {form.latitude && (
            <p style={s.locHint}>📍 {form.latitude.toFixed(5)}, {form.longitude.toFixed(5)} — drag the pin to adjust</p>
          )}

          {/* Map preview */}
          {form.latitude && (
            <div ref={mapRef} style={s.map} />
          )}

          {/* Bio */}
          <label style={{ ...s.label, marginTop: '16px' }}>Bio</label>
          <textarea style={s.textarea} rows={3} placeholder="e.g. 5 years experience in plumbing and pipe fitting…"
            value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />

          {/* Skills */}
          <label style={{ ...s.label, marginTop: '4px' }}>Skills</label>

          {/* Chip picker */}
          <div style={s.chipPicker}>
            <select style={s.skillSelect} value={selectedCat} onChange={e => setSelectedCat(e.target.value)}>
              <option value="">Select a skill…</option>
              {categories
                .filter(c => !skills.find(s => String(s.category_id) === String(c.id)))
                .map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <div style={s.expWrap}>
              <input style={s.expInput} type="number" min="1" max="50"
                value={selectedYrs} onChange={e => setSelectedYrs(e.target.value)} />
              <span style={s.expLabel}>yrs</span>
            </div>
            <button type="button" style={s.addChipBtn} onClick={addSkillChip} disabled={!selectedCat}>
              + Add
            </button>
          </div>
          {skillError && <p style={s.skillErr}>{skillError}</p>}

          {/* Chips */}
          {skills.length > 0 && (
            <div style={s.chipsWrap}>
              {skills.map(sk => (
                <div key={sk.category_id} style={s.chip}>
                  <span>{getCatName(sk.category_id)}</span>
                  <span style={s.chipYrs}>{sk.experience_years}yr{sk.experience_years > 1 ? 's' : ''}</span>
                  <button type="button" style={s.chipRemove} onClick={() => removeSkill(sk.category_id)}>✕</button>
                </div>
              ))}
            </div>
          )}
          {!skills.length && skillError === '' && (
            <p style={s.noSkills}>No skills added yet.</p>
          )}

          <button style={{ ...s.btn, marginTop: '24px', opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? 'Saving…' : 'Continue to Verification →'}
          </button>
        </form>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', fontFamily: 'Poppins, sans-serif', padding: '24px' },
  card: { background: '#fff', borderRadius: '16px', padding: '32px 28px', width: '100%', maxWidth: '520px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  step: { fontSize: '0.78rem', color: '#148477', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' },
  icon: { fontSize: '2.2rem', marginBottom: '8px' },
  title: { fontSize: '1.4rem', fontWeight: 700, color: '#111', marginBottom: '6px' },
  sub: { color: '#666', fontSize: '0.9rem', marginBottom: '20px' },
  error: { background: '#ffebee', color: '#c62828', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.88rem' },
  label: { display: 'block', fontWeight: 600, fontSize: '0.88rem', color: '#333', marginBottom: '6px' },
  input: { width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', marginBottom: '14px', fontFamily: 'Poppins, sans-serif', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', marginBottom: '14px', resize: 'vertical', fontFamily: 'Poppins, sans-serif', boxSizing: 'border-box' },
  locRow: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' },
  locBtn: { padding: '11px 14px', background: '#f0faf9', border: '1.5px solid #148477', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', flexShrink: 0 },
  locHint: { fontSize: '0.75rem', color: '#148477', marginBottom: '8px', marginTop: '4px' },
  map: { width: '100%', height: '180px', borderRadius: '10px', marginBottom: '4px', border: '1.5px solid #e0e0e0', overflow: 'hidden' },
  chipPicker: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' },
  skillSelect: { flex: 1, padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', fontFamily: 'Poppins, sans-serif' },
  expWrap: { display: 'flex', alignItems: 'center', gap: '4px' },
  expInput: { width: '52px', padding: '10px 8px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', textAlign: 'center', fontFamily: 'Poppins, sans-serif' },
  expLabel: { fontSize: '0.82rem', color: '#888', whiteSpace: 'nowrap' },
  addChipBtn: { padding: '10px 14px', background: '#148477', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600, whiteSpace: 'nowrap', fontFamily: 'Poppins, sans-serif' },
  skillErr: { fontSize: '0.82rem', color: '#c62828', marginBottom: '8px', marginTop: '2px' },
  chipsWrap: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px', marginBottom: '4px' },
  chip: { display: 'flex', alignItems: 'center', gap: '6px', background: '#e8f5e9', border: '1.5px solid #a5d6a7', borderRadius: '20px', padding: '5px 12px', fontSize: '0.85rem', color: '#1b5e20', fontWeight: 500 },
  chipYrs: { background: '#148477', color: '#fff', borderRadius: '10px', padding: '1px 7px', fontSize: '0.75rem', fontWeight: 600 },
  chipRemove: { background: 'none', border: 'none', color: '#c62828', cursor: 'pointer', fontSize: '0.85rem', padding: '0', lineHeight: 1 },
  noSkills: { fontSize: '0.85rem', color: '#aaa', marginTop: '8px', marginBottom: '4px' },
  btn: { width: '100%', padding: '13px', background: '#148477', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' },
};
