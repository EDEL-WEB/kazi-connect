import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoriesAPI } from '../../api/endpoints';

export default function ManageCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoriesAPI.list()
      .then(r => setCategories(r.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h2 style={s.title}>Categories</h2>
        <button style={s.newBtn} onClick={() => navigate('/admin/categories/new')}>+ New Category</button>
      </div>
      {loading && <div style={s.empty}>Loading...</div>}
      {!loading && categories.length === 0 && <div style={s.empty}>No categories yet.</div>}
      <div style={s.grid}>
        {categories.map(c => (
          <div key={c.id} style={s.card}>
            <h3 style={s.catName}>{c.name}</h3>
            {c.description && <p style={s.catDesc}>{c.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  page: { padding: '24px', fontFamily: 'Poppins, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '1.4rem', fontWeight: 700, color: '#111' },
  newBtn: { padding: '9px 18px', background: '#148477', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' },
  empty: { textAlign: 'center', color: '#666', padding: '40px 0' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' },
  card: { background: '#fff', borderRadius: '10px', padding: '18px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
  catName: { fontSize: '1rem', fontWeight: 700, color: '#111', marginBottom: '4px' },
  catDesc: { color: '#666', fontSize: '0.85rem' },
};
