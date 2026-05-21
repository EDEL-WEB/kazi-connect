import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { trackingAPI } from '../../api/endpoints';

export default function WorkerTracking() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const sendLocation = () => {
    if (!navigator.geolocation) { setError('Geolocation not supported.'); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          setSending(true);
          const { latitude, longitude } = pos.coords;
          await trackingAPI.update(jobId, { latitude, longitude });
          setLocation({ latitude, longitude });
          setSuccess('Location updated!');
          setTimeout(() => setSuccess(''), 3000);
        } catch {
          setError('Failed to send location.');
        } finally {
          setSending(false);
        }
      },
      () => setError('Could not get your location.')
    );
  };

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate(`/worker/jobs/${jobId}`)}>← Job Details</button>
      <div style={s.card}>
        <div style={s.icon}>📍</div>
        <h2 style={s.title}>Share Your Location</h2>
        <p style={s.sub}>Let the customer track your arrival in real time.</p>

        {error && <div style={s.error}>{error}</div>}
        {success && <div style={s.success}>{success}</div>}

        {location && (
          <div style={s.coords}>
            <div>Lat: <strong>{location.latitude.toFixed(5)}</strong></div>
            <div>Lng: <strong>{location.longitude.toFixed(5)}</strong></div>
          </div>
        )}

        <button style={s.btn} onClick={sendLocation} disabled={sending}>
          {sending ? 'Sending...' : '📡 Send Current Location'}
        </button>
      </div>
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '440px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' },
  card: { background: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', textAlign: 'center' },
  icon: { fontSize: '2.5rem', marginBottom: '12px' },
  title: { fontSize: '1.3rem', fontWeight: 700, color: '#111', marginBottom: '8px' },
  sub: { color: '#666', fontSize: '0.9rem', marginBottom: '20px' },
  error: { background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.9rem' },
  success: { background: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.9rem' },
  coords: { background: '#f9f9f9', borderRadius: '8px', padding: '12px', marginBottom: '16px', fontSize: '0.9rem', color: '#333', display: 'flex', gap: '16px', justifyContent: 'center' },
  btn: { width: '100%', padding: '13px', background: '#148477', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' },
};
