import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { reviewsAPI } from '../../api/endpoints';

export default function ReviewWorker() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await reviewsAPI.create({ job_id: jobId, rating, comment });
      navigate('/reviews');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate(jobId ? `/jobs/${jobId}` : '/jobs')}>← Back</button>
      <div style={s.card}>
        <h2 style={s.title}>Leave a Review</h2>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={s.label}>Rating</label>
          <div style={s.stars}>
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} type="button" style={{ ...s.star, color: n <= rating ? '#f59e0b' : '#e0e0e0' }} onClick={() => setRating(n)}>★</button>
            ))}
          </div>
          <label style={s.label}>Comment</label>
          <textarea style={s.textarea} rows={4} value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your experience with this worker…" required />
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
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
  label: { display: 'block', fontWeight: 600, fontSize: '0.9rem', color: '#333', marginBottom: '8px' },
  stars: { display: 'flex', gap: '4px', marginBottom: '20px' },
  star: { background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer', padding: '0 2px', transition: 'color 0.1s' },
  textarea: { width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', marginBottom: '16px', resize: 'vertical' },
  btn: { width: '100%', padding: '12px', background: '#148477', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' },
};
