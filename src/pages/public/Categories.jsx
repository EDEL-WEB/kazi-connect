import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoriesAPI } from '../../api/endpoints';

const ICONS = ['🔧', '⚡', '🪚', '🎨', '🧹', '🔩', '🌿', '📺', '🔐', '🚗', '💇', '🏠'];

export default function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoriesAPI.list()
      .then(r => setCategories(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate('/')}>← Home</button>
        <h2 style={s.title}>Browse Services</h2>
        <p style={s.sub}>Find skilled professionals for any home service need.</p>
      </div>

      {loading && <div style={s.empty}>Loading categories...</div>}

      {!loading && categories.length === 0 && (
        <div style={s.grid}>
          {ICONS.map((icon, i) => (
            <div key={i} style={s.card} onClick={() => navigate('/register')}>
              <div style={s.icon}>{icon}</div>
              <div style={s.label}>Service {i + 1}</div>
            </div>
          ))}
        </div>
      )}

      <div style={s.grid}>
        {categories.map((c, i) => (
          <div key={c.id} style={s.card} onClick={() => navigate('/register')}>
            <div style={s.icon}>{ICONS[i % ICONS.length]}</div>
            <div style={s.label}>{c.name}</div>
            {c.description && <div style={s.desc}>{c.description}</div>}
          </div>
        ))}
      </div>

      <div style={s.cta}>
        <button style={s.ctaBtn} onClick={() => navigate('/register')}>Book a Service →</button>
      </div>
    </div>
  );
}

const s = {
  page: { padding: '32px 24px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  header: { textAlign: 'center', marginBottom: '36px' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '16px' },
  title: { fontSize: '2rem', fontWeight: 800, color: '#111', marginBottom: '8px' },
  sub: { color: '#666', fontSize: '1rem' },
  empty: { textAlign: 'center', color: '#666', padding: '40px 0' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' },
  card: { background: '#fff', borderRadius: '12px', padding: '24px 16px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', cursor: 'pointer', transition: 'transform 0.15s' },
  icon: { fontSize: '2rem', marginBottom: '10px' },
  label: { fontWeight: 700, color: '#111', fontSize: '0.95rem', marginBottom: '4px' },
  desc: { color: '#888', fontSize: '0.8rem' },
  cta: { textAlign: 'center' },
  ctaBtn: { padding: '13px 32px', background: '#148477', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' },
};
