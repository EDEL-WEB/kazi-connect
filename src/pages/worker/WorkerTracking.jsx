import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { trackingAPI } from '../../api/endpoints';
import { useGeoLocation } from '../../hooks/useGeoLocation';

export default function WorkerTracking() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { coords, watching, startWatch, stopWatch } = useGeoLocation();
  const [error, setError] = useState('');
  const [lastSent, setLastSent] = useState(null);
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markerRef = useRef(null);

  // Auto-start tracking on mount
  useEffect(() => {
    handleStart();
    return () => stopWatch();
  }, [jobId]);

  // Init / update Leaflet map when coords change
  useEffect(() => {
    if (!coords) return;
    const { latitude: lat, longitude: lng } = coords;

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

    if (window.L) { init(); return; }
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
      script.onload = init;
      document.head.appendChild(script);
    }
  }, [coords]);

  function handleStart() {
    setError('');
    startWatch(async (c) => {
      try {
        await trackingAPI.update(jobId, { latitude: c.latitude, longitude: c.longitude });
        setLastSent(new Date());
      } catch {
        setError('Failed to send location update.');
      }
    });
  }

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => { stopWatch(); navigate(`/worker/jobs/${jobId}`); }}>← Job Details</button>
      <div style={s.card}>
        <div style={s.icon}>📡</div>
        <h2 style={s.title}>Live Location Sharing</h2>
        <p style={s.sub}>Your location is shared with the customer in real time.</p>

        {error && <div style={s.error}>{error}</div>}

        {/* Map */}
        {coords && <div ref={mapRef} style={s.map} />}

        {/* Coords + address */}
        {coords && (
          <div style={s.infoBox}>
            <div style={s.coordRow}>
              <span>📍 {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}</span>
            </div>
            {(coords.ward || coords.subcounty || coords.county) && (
              <div style={s.addrRow}>
                {[coords.ward, coords.subcounty, coords.county].filter(Boolean).join(' · ')}
              </div>
            )}
            {lastSent && (
              <div style={s.lastSent}>Last sent: {lastSent.toLocaleTimeString()}</div>
            )}
          </div>
        )}

        {watching
          ? <p style={s.liveIndicator}>🟢 Live — updating every GPS fix</p>
          : <p style={s.liveIndicator}>⏳ Acquiring GPS...</p>
        }
        <button style={{ ...s.btn, background: '#c62828' }} onClick={() => { stopWatch(); navigate('/worker/jobs'); }}>⏹ Stop &amp; Go to Jobs</button>
      </div>
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '460px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' },
  card: { background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', textAlign: 'center' },
  icon: { fontSize: '2.2rem', marginBottom: '10px' },
  title: { fontSize: '1.3rem', fontWeight: 700, color: '#111', marginBottom: '6px' },
  sub: { color: '#666', fontSize: '0.9rem', marginBottom: '16px' },
  error: { background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.9rem' },
  map: { width: '100%', height: '200px', borderRadius: '10px', marginBottom: '12px', border: '1.5px solid #e0e0e0', overflow: 'hidden' },
  infoBox: { background: '#f9f9f9', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', textAlign: 'left' },
  coordRow: { fontSize: '0.88rem', color: '#333', marginBottom: '4px' },
  addrRow: { fontSize: '0.85rem', color: '#148477', fontWeight: 600, marginBottom: '4px' },
  lastSent: { fontSize: '0.78rem', color: '#999', marginTop: '4px' },
  btn: { width: '100%', padding: '13px', background: '#148477', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' },
  liveIndicator: { marginTop: '10px', fontSize: '0.85rem', color: '#2e7d32', fontWeight: 600 },
};
