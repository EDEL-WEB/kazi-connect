import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI, categoriesAPI } from '../../api/endpoints';

export default function BookService() {
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
      await jobsAPI.create({ ...form, budget: Number(form.budget) });
      navigate('/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create job.');
    } finally {
      setLoading(false);
    }
  };

  const field = (label, key, type = 'text', extra = {}) => (
    <div key={key}>
      <label style={s.label}>{label}</label>
      <input style={s.input} type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required {...extra} />
    </div>
  );

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate('/dashboard')}>← Dashboard</button>
      <div style={s.card}>
        <h2 style={s.title}>Book a Service</h2>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {field('Job Title', 'title', 'text', { placeholder: 'e.g. Fix leaking pipe' })}
          <label style={s.label}>Description</label>
          <textarea style={s.textarea} rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the work needed…" required />
          <label style={s.label}>Category</label>
          <select style={s.input} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
            <option value="">Select category</option>
            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          {field('Location', 'location', 'text', { placeholder: 'e.g. Westlands, Nairobi' })}
          {field('Budget (KSh)', 'budget', 'number', { placeholder: 'e.g. 2000', min: 1 })}
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? 'Posting...' : 'Post Job'}
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
  title: { fontSize: '1.4rem', fontWeight: 700, color: '#111', marginBottom: '20px' },
  error: { background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.9rem' },
  label: { display: 'block', fontWeight: 600, fontSize: '0.9rem', color: '#333', marginBottom: '6px' },
  input: { width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', marginBottom: '16px' },
  textarea: { width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', marginBottom: '16px', resize: 'vertical' },
  btn: { width: '100%', padding: '12px', background: '#148477', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' },
};
