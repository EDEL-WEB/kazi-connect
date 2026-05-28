import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoriesAPI } from '../../api/endpoints';

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
        <p style={s.sub}>Find skilled professionals for any job across Kenya.</p>
      </div>

      {loading && (
        <div style={s.skeletonGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={s.skeleton} />
          ))}
        </div>
      )}

      {!loading && (
        <div style={s.grid}>
          {categories.map(c => {
            // description format: "Parent Name · From KES min – max"
            const [parent, priceHint] = (c.description || '').split(' · ');
            return (
              <div key={c.id} style={s.card} onClick={() => navigate('/register')}>
                <div style={s.iconWrap}>{c.icon || '🔧'}</div>
                <div style={s.cardBody}>
                  <div style={s.name}>{c.name}</div>
                  {parent && <div style={s.parent}>{parent}</div>}
                  {priceHint && <div style={s.price}>{priceHint}</div>}
                </div>
                <div style={s.arrow}>→</div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && categories.length === 0 && (
        <p style={s.empty}>No categories available yet.</p>
      )}

      <div style={s.cta}>
        <p style={s.ctaText}>Ready to get started?</p>
        <button style={s.ctaBtn} onClick={() => navigate('/register')}>Book a Service →</button>
        <button style={s.workerBtn} onClick={() => navigate('/register?role=worker')}>Join as a Worker →</button>
      </div>
    </div>
  );
}

const s = {
  page: { padding: '32px 24px', maxWidth: '860px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  header: { textAlign: 'center', marginBottom: '36px' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '16px' },
  title: { fontSize: '2rem', fontWeight: 800, color: '#111', marginBottom: '8px' },
  sub: { color: '#666', fontSize: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px', marginBottom: '40px' },
  card: { display: 'flex', alignItems: 'center', gap: '14px', background: '#fff', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', cursor: 'pointer', border: '1.5px solid transparent', transition: 'border-color 0.15s' },
  iconWrap: { fontSize: '2rem', flexShrink: 0, width: '48px', height: '48px', background: '#f0faf9', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardBody: { flex: 1, minWidth: 0 },
  name: { fontWeight: 700, color: '#111', fontSize: '0.95rem', marginBottom: '2px' },
  parent: { fontSize: '0.78rem', color: '#888', marginBottom: '2px' },
  price: { fontSize: '0.78rem', color: '#148477', fontWeight: 600 },
  arrow: { color: '#ccc', fontSize: '1rem', flexShrink: 0 },
  skeletonGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px', marginBottom: '40px' },
  skeleton: { height: '80px', background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', borderRadius: '12px', animation: 'shimmer 1.2s infinite' },
  empty: { textAlign: 'center', color: '#aaa', padding: '40px 0' },
  cta: { textAlign: 'center', padding: '32px 0' },
  ctaText: { color: '#666', marginBottom: '16px', fontSize: '1rem' },
  ctaBtn: { padding: '13px 32px', background: '#148477', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', marginRight: '12px' },
  workerBtn: { padding: '13px 32px', background: 'none', color: '#148477', border: '2px solid #148477', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' },
};
