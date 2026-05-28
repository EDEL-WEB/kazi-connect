import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobsAPI } from '../../api/endpoints';

export default function AcceptJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [rate, setRate] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    jobsAPI.get(id)
      .then(r => setJob(r.data))
      .catch(() => setError('Failed to load job.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await jobsAPI.accept(id, { proposed_rate: Number(rate) });
      navigate(`/worker/tracking/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept job.');
    } finally {
      setSubmitting(false);
    }
  };

  const money = (v) => v != null ? `KSh ${Number(v).toLocaleString()}` : '—';
  const net = rate ? money(Number(rate) * 0.85) : '—';

  if (loading) return <div style={s.center}>Loading...</div>;

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate('/worker/jobs/available')}>← Back</button>

      <div style={s.card}>
        <h2 style={s.title}>Accept Job</h2>

        {error && <div style={s.error}>{error}</div>}

        {job && (
          <div style={s.jobInfo}>
            <h3 style={s.jobTitle}>{job.title}</h3>
            <p style={s.desc}>{job.description}</p>
            <div style={s.meta}>
              <span>📍 {job.location}</span>
              <span>💰 Customer budget: {money(job.budget)}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={s.label}>Your Proposed Rate (KSh)</label>
          <input
            style={s.input}
            type="number"
            min="1"
            placeholder="e.g. 1500"
            value={rate}
            onChange={e => setRate(e.target.value)}
            required
          />
          <p style={s.hint}>You receive 85% after 15% platform commission: <strong>{net}</strong></p>
          <button style={s.btn} type="submit" disabled={submitting || !rate}>
            {submitting ? 'Accepting...' : 'Accept & Propose Rate'}
          </button>
        </form>
      </div>
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '520px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  center: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' },
  card: { background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  title: { fontSize: '1.4rem', fontWeight: 700, color: '#111', marginBottom: '20px' },
  error: { background: '#ffebee', color: '#c62828', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' },
  jobInfo: { background: '#f9f9f9', borderRadius: '10px', padding: '16px', marginBottom: '20px' },
  jobTitle: { fontSize: '1rem', fontWeight: 700, color: '#111', marginBottom: '6px' },
  desc: { color: '#666', fontSize: '0.88rem', marginBottom: '10px' },
  meta: { display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '0.85rem', color: '#555' },
  label: { display: 'block', fontWeight: 600, fontSize: '0.9rem', color: '#333', marginBottom: '6px' },
  input: { width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem', outline: 'none', marginBottom: '8px' },
  hint: { fontSize: '0.85rem', color: '#666', marginBottom: '16px' },
  btn: { width: '100%', padding: '12px', background: '#148477', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' },
};
