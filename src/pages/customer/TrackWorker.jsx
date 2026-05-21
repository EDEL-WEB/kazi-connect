import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { trackingAPI } from '../../api/endpoints';

export default function TrackWorker() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLocation = () => {
    setLoading(true);
    trackingAPI.getLocation(jobId)
      .then(r => setLocation(r.data))
      .catch(() => setError('Location not available yet.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLocation();
    const interval = setInterval(fetchLocation, 15000);
    return () => clearInterval(interval);
  }, [jobId]);

  const fmt = (d) => d ? new Date(d).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }) : '—';

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate(`/jobs/${jobId}`)}>← Job Details</button>
      <div style={s.card}>
        <div style={s.icon}>📍</div>
        <h2 style={s.title}>Track Worker</h2>
        <p style={s.sub}>Location updates every 15 seconds.</p>

        {loading && <div style={s.info}>Fetching location...</div>}
        {error && <div style={s.error}>{error}</div>}

        {location && !error && (
          <div style={s.locationCard}>
            <div style={s.coords}>
              <div>🌐 Lat: <strong>{Number(location.latitude).toFixed(5)}</strong></div>
              <div>🌐 Lng: <strong>{Number(location.longitude).toFixed(5)}</strong></div>
            </div>
            <div style={s.updated}>Last updated: {fmt(location.updated_at)}</div>
          </div>
        )}

        <button style={s.btn} onClick={fetchLocation}>🔄 Refresh</button>
      </div>
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '440px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' },
  card: { background: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', textAlign: 'center' },
  icon: { fontSize: '2.5rem', marginBottom: '12px' },
  title: { fontSize: '1.3rem', fontWeight: 700, color: '#111', marginBottom: '6px' },
  sub: { color: '#888', fontSize: '0.85rem', marginBottom: '20px' },
  info: { color: '#666', fontSize: '0.9rem', marginBottom: '12px' },
  error: { background: '#fff3e0', color: '#e65100', padding: '10px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.9rem' },
  locationCard: { background: '#f0faf9', borderRadius: '10px', padding: '16px', marginBottom: '16px' },
  coords: { display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem', color: '#333', marginBottom: '8px' },
  updated: { fontSize: '0.8rem', color: '#888' },
  btn: { width: '100%', padding: '11px', background: 'none', border: '1.5px solid #148477', color: '#148477', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' },
};
