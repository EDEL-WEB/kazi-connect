import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { escrowAPI } from '../../api/endpoints';

export default function ResolveDispute() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [resolution, setResolution] = useState('release');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResolve = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await escrowAPI.resolveDispute(jobId, { resolution, notes });
      navigate('/admin/disputes');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resolve dispute.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate('/admin/disputes')}>← Disputes</button>
      <div style={s.card}>
        <h2 style={s.title}>Resolve Dispute</h2>
        <p style={s.sub}>Job ID: <strong>{jobId}</strong></p>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleResolve}>
          <label style={s.label}>Resolution</label>
          <select style={s.select} value={resolution} onChange={e => setResolution(e.target.value)}>
            <option value="release">Release payment to worker</option>
            <option value="refund">Refund payment to customer</option>
            <option value="split">Split payment</option>
          </select>
          <label style={s.label}>Notes</label>
          <textarea style={s.textarea} rows={4} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Explain the resolution decision…" required />
          <button style={s.btn} type="submit" disabled={loading}>{loading ? 'Resolving...' : 'Submit Resolution'}</button>
        </form>
      </div>
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '520px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' },
  card: { background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  title: { fontSize: '1.3rem', fontWeight: 700, color: '#111', marginBottom: '6px' },
  sub: { color: '#666', fontSize: '0.9rem', marginBottom: '20px' },
  error: { background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.9rem' },
  label: { display: 'block', fontWeight: 600, fontSize: '0.9rem', color: '#333', marginBottom: '6px' },
  select: { width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', marginBottom: '16px' },
  textarea: { width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', marginBottom: '16px', resize: 'vertical' },
  btn: { width: '100%', padding: '12px', background: '#e65100', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' },
};
