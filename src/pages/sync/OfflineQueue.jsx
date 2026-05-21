import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationsAPI } from '../../api/endpoints';

export default function OfflineQueue() {
  const navigate = useNavigate();
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('kazi_offline_queue') || '[]');
    setQueue(stored);
  }, []);

  const clearQueue = () => {
    localStorage.removeItem('kazi_offline_queue');
    setQueue([]);
  };

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate(-1)}>← Back</button>
      <div style={s.card}>
        <div style={s.icon}>📦</div>
        <h2 style={s.title}>Offline Queue</h2>
        <p style={s.sub}>Actions queued while offline will sync automatically when you reconnect.</p>
        {queue.length === 0 ? (
          <div style={s.empty}>✅ Queue is empty — all actions synced.</div>
        ) : (
          <>
            <div style={s.list}>
              {queue.map((item, i) => (
                <div key={i} style={s.item}>
                  <span style={s.itemType}>{item.type}</span>
                  <span style={s.itemTime}>{item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : '—'}</span>
                </div>
              ))}
            </div>
            <button style={s.clearBtn} onClick={clearQueue}>Clear Queue</button>
          </>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '480px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' },
  card: { background: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', textAlign: 'center' },
  icon: { fontSize: '2.5rem', marginBottom: '12px' },
  title: { fontSize: '1.3rem', fontWeight: 700, color: '#111', marginBottom: '8px' },
  sub: { color: '#666', fontSize: '0.9rem', marginBottom: '20px' },
  empty: { color: '#2e7d32', fontWeight: 600, padding: '16px', background: '#e8f5e9', borderRadius: '8px' },
  list: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', textAlign: 'left' },
  item: { display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f9f9f9', borderRadius: '8px', fontSize: '0.88rem' },
  itemType: { fontWeight: 600, color: '#333', textTransform: 'capitalize' },
  itemTime: { color: '#888' },
  clearBtn: { width: '100%', padding: '11px', background: 'none', border: '1.5px solid #c62828', color: '#c62828', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' },
};
