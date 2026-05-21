import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { workersAPI, reviewsAPI } from '../../api/endpoints';

export default function PublicWorkerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([workersAPI.getProfile(id), reviewsAPI.getWorkerReviews(id)])
      .then(([w, r]) => {
        setWorker(w.data);
        setReviews(Array.isArray(r.data) ? r.data : r.data?.reviews || []);
      })
      .catch(() => setError('Failed to load profile.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={s.center}>Loading...</div>;
  if (error) return <div style={s.center}><div style={s.error}>{error}</div></div>;

  const avgRating = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate(-1)}>← Back</button>
      <div style={s.card}>
        <div style={s.avatarWrap}>
          <div style={s.avatar}>{worker?.full_name?.charAt(0) || 'W'}</div>
          <div>
            <h2 style={s.name}>{worker?.full_name}</h2>
            {worker?.verified && <span style={s.verified}>✓ Verified</span>}
            {avgRating && <div style={s.rating}>★ {avgRating} <span style={s.reviewCount}>({reviews.length} reviews)</span></div>}
          </div>
        </div>

        {worker?.skills?.length > 0 && (
          <div style={s.skills}>
            {worker.skills.map((sk, i) => <span key={i} style={s.skill}>{sk}</span>)}
          </div>
        )}

        <button style={s.bookBtn} onClick={() => navigate('/register')}>Book This Worker</button>
      </div>

      {reviews.length > 0 && (
        <div style={s.reviewsSection}>
          <h3 style={s.reviewsTitle}>Reviews</h3>
          {reviews.map((r, i) => (
            <div key={i} style={s.review}>
              <div style={s.reviewTop}>
                <span style={s.stars}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                <span style={s.reviewDate}>{r.created_at ? new Date(r.created_at).toLocaleDateString() : ''}</span>
              </div>
              <p style={s.reviewText}>{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  center: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' },
  card: { background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', marginBottom: '16px' },
  avatarWrap: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' },
  avatar: { width: '72px', height: '72px', borderRadius: '50%', background: '#148477', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 700, flexShrink: 0 },
  name: { fontSize: '1.2rem', fontWeight: 700, color: '#111', marginBottom: '4px' },
  verified: { background: '#e8f5e9', color: '#2e7d32', fontSize: '0.78rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', marginBottom: '4px', display: 'inline-block' },
  rating: { color: '#f59e0b', fontWeight: 700, fontSize: '0.95rem', marginTop: '4px' },
  reviewCount: { color: '#888', fontWeight: 400, fontSize: '0.85rem' },
  skills: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' },
  skill: { background: '#f0faf9', color: '#148477', padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600 },
  bookBtn: { width: '100%', padding: '12px', background: '#148477', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' },
  error: { background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px' },
  reviewsSection: { background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  reviewsTitle: { fontSize: '1rem', fontWeight: 700, color: '#333', marginBottom: '16px' },
  review: { borderBottom: '1px solid #f5f5f5', paddingBottom: '14px', marginBottom: '14px' },
  reviewTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' },
  stars: { color: '#f59e0b', fontSize: '1rem' },
  reviewDate: { color: '#aaa', fontSize: '0.8rem' },
  reviewText: { color: '#444', fontSize: '0.9rem', lineHeight: 1.5 },
};
