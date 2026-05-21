import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { escrowAPI, categoriesAPI } from '../../api/endpoints';

export default function BookWithEscrow() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', category: '', location: '', budget: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    categoriesAPI.list().then(r => setCategories(r.data || [])).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await escrowAPI.createJob({ ...form, budget: Number(form.budget) });
      navigate('/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create escrow job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate('/dashboard')}>← Dashboard</button>
      <div style={s.card}>
        <div style={s.escrowBadge}>🔐 Escrow Protected</div>
        <h2 style={s.title}>Book with Escrow</h2>
        <p style={s.sub}>Your payment is held securely until you approve the completed work.</p>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={s.label}>Job Title</label>
          <input style={s.input} type="text" placeholder="e.g. Paint living room" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <label style={s.label}>Description</label>
          <textarea style={s.textarea} rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the work needed…" required />
          <label style={s.label}>Category</label>
          <select style={s.input} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
            <option value="">Select category</option>
            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          <label style={s.label}>Location</label>
          <input style={s.input} type="text" placeholder="e.g. Karen, Nairobi" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
          <label style={s.label}>Budget (KSh)</label>
          <input style={s.input} type="number" min="1" placeholder="e.g. 5000" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} required />
          <div style={s.infoBox}>💡 Funds will be held in escrow and released only when you confirm the job is done.</div>
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Book with Escrow'}
          </button>
        </form>
      </div>
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '520px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' },
  card: { background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  escrowBadge: { display: 'inline-block', background: '#e8f5e9', color: '#2e7d32', fontSize: '0.8rem', fontWeight: 700, padding: '4px 12px', borderRadius: '12px', marginBottom: '10px' },
  title: { fontSize: '1.4rem', fontWeight: 700, color: '#111', marginBottom: '6px' },
  sub: { color: '#666', fontSize: '0.9rem', marginBottom: '20px' },
  error: { background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.9rem' },
  label: { display: 'block', fontWeight: 600, fontSize: '0.9rem', color: '#333', marginBottom: '6px' },
  input: { width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', marginBottom: '16px' },
  textarea: { width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', marginBottom: '16px', resize: 'vertical' },
  infoBox: { background: '#f0faf9', borderRadius: '8px', padding: '12px', fontSize: '0.85rem', color: '#444', marginBottom: '16px' },
  btn: { width: '100%', padding: '12px', background: '#148477', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' },
};
