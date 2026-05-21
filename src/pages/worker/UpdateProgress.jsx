import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobUpdatesAPI } from '../../api/endpoints';

export default function UpdateProgress() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(50);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await jobUpdatesAPI.updateProgress(id, { progress });
      if (note.trim()) await jobUpdatesAPI.addNote(id, { note });
      navigate(`/worker/jobs/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update progress.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate(`/worker/jobs/${id}`)}>← Back</button>
      <div style={s.card}>
        <h2 style={s.title}>Update Progress</h2>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={s.label}>Progress: <strong>{progress}%</strong></label>
          <input type="range" min={0} max={100} value={progress} onChange={e => setProgress(Number(e.target.value))} style={s.range} />
          <div style={s.progressBar}><div style={{ ...s.progressFill, width: `${progress}%` }} /></div>

          <label style={{ ...s.label, marginTop: '20px' }}>Note (optional)</label>
          <textarea
            style={s.textarea}
            rows={3}
            placeholder="Describe what you've done so far…"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Progress'}
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
  range: { width: '100%', marginBottom: '8px', accentColor: '#148477' },
  progressBar: { height: '8px', background: '#e0e0e0', borderRadius: '4px', marginBottom: '4px', overflow: 'hidden' },
  progressFill: { height: '100%', background: '#148477', borderRadius: '4px', transition: 'width 0.2s' },
  textarea: { width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', marginBottom: '16px', resize: 'vertical' },
  btn: { width: '100%', padding: '12px', background: '#148477', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' },
};
