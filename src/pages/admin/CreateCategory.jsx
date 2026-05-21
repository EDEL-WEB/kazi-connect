import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoriesAPI } from '../../api/endpoints';

export default function CreateCategory() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await categoriesAPI.create(form);
      navigate('/admin/categories');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate('/admin/categories')}>← Categories</button>
      <div style={s.card}>
        <h2 style={s.title}>New Category</h2>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={s.label}>Name</label>
          <input style={s.input} type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Plumbing" required />
          <label style={s.label}>Description</label>
          <textarea style={s.textarea} rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description…" />
          <button style={s.btn} type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Category'}</button>
        </form>
      </div>
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '480px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' },
  card: { background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  title: { fontSize: '1.3rem', fontWeight: 700, color: '#111', marginBottom: '20px' },
  error: { background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.9rem' },
  label: { display: 'block', fontWeight: 600, fontSize: '0.9rem', color: '#333', marginBottom: '6px' },
  input: { width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', marginBottom: '16px' },
  textarea: { width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', marginBottom: '16px', resize: 'vertical' },
  btn: { width: '100%', padding: '12px', background: '#148477', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' },
};
