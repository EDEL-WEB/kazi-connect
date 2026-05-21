import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reviewsAPI } from '../../api/endpoints';
import { useAuth } from '../../context/AuthContext';

export default function CustomerReviews() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    reviewsAPI.getWorkerReviews(user?.id)
      .then(r => setReviews(Array.isArray(r.data) ? r.data : r.data?.reviews || []))
      .catch(() => setError('Failed to load reviews.'))
      .finally(() => setLoading(false));
  }, []);

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate('/dashboard')}>← Dashboard</button>
        <h2 style={s.title}>My Reviews</h2>
      </div>
      {error && <div style={s.error}>{error}</div>}
      {loading && <div style={s.empty}>Loading...</div>}
      {!loading && reviews.length === 0 && <div style={s.empty}>No reviews yet.</div>}
      <div style={s.list}>
        {reviews.map((r, i) => (
          <div key={i} style={s.card}>
            <div style={s.cardTop}>
              <div style={s.stars}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
              <span style={s.date}>{fmt(r.created_at)}</span>
            </div>
            <p style={s.comment}>{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '700px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' },
  title: { fontSize: '1.4rem', fontWeight: 700, color: '#111' },
  error: { background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px', marginBottom: '16px' },
  empty: { textAlign: 'center', color: '#666', padding: '60px 0' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  card: { background: '#fff', borderRadius: '12px', padding: '18px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  stars: { color: '#f59e0b', fontSize: '1.1rem', letterSpacing: '2px' },
  date: { fontSize: '0.82rem', color: '#888' },
  comment: { color: '#444', fontSize: '0.9rem', lineHeight: 1.6 },
};
