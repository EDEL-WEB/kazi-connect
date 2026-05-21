import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobsAPI } from '../../api/endpoints';

const STATUSES = ['in_progress', 'completed', 'cancelled'];

export default function UpdateJobStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('in_progress');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await jobsAPI.updateStatus(id, { status });
      navigate(`/worker/jobs/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate(`/worker/jobs/${id}`)}>← Back</button>
      <div style={s.card}>
        <h2 style={s.title}>Update Job Status</h2>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={s.label}>New Status</label>
          <select style={s.select} value={status} onChange={e => setStatus(e.target.value)}>
            {STATUSES.map(st => (
              <option key={st} value={st}>{st.replace('_', ' ')}</option>
            ))}
          </select>
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Status'}
          </button>
        </form>
      </div>
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '440px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' },
  card: { background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  title: { fontSize: '1.3rem', fontWeight: 700, color: '#111', marginBottom: '20px' },
  error: { background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.9rem' },
  label: { display: 'block', fontWeight: 600, fontSize: '0.9rem', color: '#333', marginBottom: '6px' },
  select: { width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.95rem', marginBottom: '16px', outline: 'none', textTransform: 'capitalize' },
  btn: { width: '100%', padding: '12px', background: '#148477', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' },
};
