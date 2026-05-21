import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationsAPI } from '../../api/endpoints';

export default function SyncStatus() {
  const navigate = useNavigate();
  const [online, setOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState(localStorage.getItem('kazi_last_sync'));
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => { window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline); };
  }, []);

  const handleSync = async () => {
    try {
      setSyncing(true);
      await notificationsAPI.heartbeat();
      const now = new Date().toISOString();
      localStorage.setItem('kazi_last_sync', now);
      setLastSync(now);
    } catch {} finally {
      setSyncing(false);
    }
  };

  const fmt = (d) => d ? new Date(d).toLocaleString('en-KE') : 'Never';

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate(-1)}>← Back</button>
      <div style={s.card}>
        <div style={s.icon}>{online ? '🟢' : '🔴'}</div>
        <h2 style={s.title}>Sync Status</h2>
        <div style={{ ...s.statusBadge, background: online ? '#e8f5e9' : '#ffebee', color: online ? '#2e7d32' : '#c62828' }}>
          {online ? 'Online' : 'Offline'}
        </div>
        <div style={s.info}>
          <div style={s.row}><span style={s.lbl}>Last Synced</span><span>{fmt(lastSync)}</span></div>
          <div style={s.row}><span style={s.lbl}>Queued Actions</span><span>{JSON.parse(localStorage.getItem('kazi_offline_queue') || '[]').length}</span></div>
        </div>
        <button style={s.btn} onClick={handleSync} disabled={syncing || !online}>
          {syncing ? 'Syncing...' : '🔄 Sync Now'}
        </button>
        <button style={s.linkBtn} onClick={() => navigate('/sync')}>View Offline Queue →</button>
      </div>
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '440px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' },
  card: { background: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', textAlign: 'center' },
  icon: { fontSize: '2.5rem', marginBottom: '12px' },
  title: { fontSize: '1.3rem', fontWeight: 700, color: '#111', marginBottom: '12px' },
  statusBadge: { display: 'inline-block', padding: '6px 20px', borderRadius: '20px', fontWeight: 700, fontSize: '0.9rem', marginBottom: '20px' },
  info: { display: 'flex', flexDirection: 'column', gap: '10px', background: '#f9f9f9', borderRadius: '10px', padding: '16px', marginBottom: '20px', textAlign: 'left' },
  row: { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' },
  lbl: { color: '#888' },
  btn: { width: '100%', padding: '12px', background: '#148477', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem', marginBottom: '10px' },
  linkBtn: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' },
};
