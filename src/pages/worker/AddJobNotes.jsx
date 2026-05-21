import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobUpdatesAPI } from '../../api/endpoints';

export default function AddJobNotes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await jobUpdatesAPI.addNote(id, { note });
      navigate(`/worker/jobs/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add note.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate(`/worker/jobs/${id}`)}>← Back</button>
      <div style={s.card}>
        <h2 style={s.title}>Add Job Note</h2>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={s.label}>Note</label>
          <textarea
            style={s.textarea}
            rows={5}
            placeholder="Add a note about this job…"
            value={note}
            onChange={e => setNote(e.target.value)}
            required
          />
          <button style={s.btn} type="submit" disabled={loading || !note.trim()}>
            {loading ? 'Saving...' : 'Save Note'}
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
  textarea: { width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', marginBottom: '16px', resize: 'vertical' },
  btn: { width: '100%', padding: '12px', background: '#148477', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' },
};
