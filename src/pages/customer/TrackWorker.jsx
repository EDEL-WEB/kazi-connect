import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { trackingAPI } from '../../api/endpoints';

function loadLeaflet(cb) {
  if (window.L) return cb();
  if (!document.getElementById('leaflet-css')) {
    const link = document.createElement('link');
    link.id = 'leaflet-css'; link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
  }
  if (!document.getElementById('leaflet-js')) {
    const script = document.createElement('script');
    script.id = 'leaflet-js';
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = cb;
    document.head.appendChild(script);
  }
}

export default function TrackWorker() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markerRef = useRef(null);

  const fetchLocation = () => {
    setLoading(true);
    setError('');
    trackingAPI.getLocation(jobId)
      .then(r => setLocation(r.data))
      .catch(err => {
        if (err?.response?.status !== 404) setError('Could not reach server.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLocation();
    const interval = setInterval(fetchLocation, 15000);
    return () => clearInterval(interval);
  }, [jobId]);

  useEffect(() => {
    if (!location) return;
    const lat = Number(location.latitude);
    const lng = Number(location.longitude);

    const init = () => {
      const L = window.L;
      if (!L || !mapRef.current) return;
      if (leafletMapRef.current) {
        leafletMapRef.current.setView([lat, lng], 16);
        markerRef.current?.setLatLng([lat, lng]);
        return;
      }
      const map = L.map(mapRef.current, { zoomControl: true, attributionControl: false }).setView([lat, lng], 16);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      markerRef.current = L.marker([lat, lng]).addTo(map);
      leafletMapRef.current = map;
    };

    loadLeaflet(init);
    if (window.L) init();
  }, [location]);

  const fmt = (d) => d ? new Date(d).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }) : '—';

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate(`/jobs/${jobId}`)}>← Job Details</button>
      <div style={s.card}>
        <div style={s.icon}>📍</div>
        <h2 style={s.title}>Track Worker</h2>
        <p style={s.sub}>Location updates every 15 seconds.</p>

        {loading && <div style={s.info}>Fetching location...</div>}
        {error && !location && <div style={s.error}>{error}</div>}

        {location && (
          <>
            <div ref={mapRef} style={s.map} />
            <div style={s.locationCard}>
              <div style={s.coords}>
                <span>📍 {Number(location.latitude).toFixed(5)}, {Number(location.longitude).toFixed(5)}</span>
              </div>
              <div style={s.updated}>Last updated: {fmt(location.updated_at)}</div>
            </div>
          </>
        )}

        {!location && !loading && !error && <div style={s.info}>Waiting for worker location...</div>}

        <button style={s.btn} onClick={fetchLocation}>🔄 Refresh</button>
      </div>
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '460px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' },
  card: { background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', textAlign: 'center' },
  icon: { fontSize: '2.5rem', marginBottom: '12px' },
  title: { fontSize: '1.3rem', fontWeight: 700, color: '#111', marginBottom: '6px' },
  sub: { color: '#888', fontSize: '0.85rem', marginBottom: '20px' },
  info: { color: '#666', fontSize: '0.9rem', marginBottom: '12px' },
  error: { background: '#fff3e0', color: '#e65100', padding: '10px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.9rem' },
  map: { width: '100%', height: '220px', borderRadius: '10px', marginBottom: '12px', border: '1.5px solid #e0e0e0', overflow: 'hidden' },
  locationCard: { background: '#f0faf9', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', textAlign: 'left' },
  coords: { fontSize: '0.88rem', color: '#333', marginBottom: '4px' },
  updated: { fontSize: '0.8rem', color: '#888' },
  btn: { width: '100%', padding: '11px', background: 'none', border: '1.5px solid #148477', color: '#148477', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' },
};
