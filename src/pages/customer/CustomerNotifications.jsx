import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationsAPI } from '../../api/endpoints';

export default function CustomerNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationsAPI.pending()
      .then(r => setNotifications(Array.isArray(r.data) ? r.data : []))
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    await notificationsAPI.markRead(id).catch(() => {});
    setNotifications(n => n.filter(x => x.id !== id));
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate('/dashboard')}>← Dashboard</button>
        <h2 style={s.title}>Notifications {notifications.length > 0 && <span style={s.count}>{notifications.length}</span>}</h2>
      </div>
      {loading && <div style={s.empty}>Loading...</div>}
      {!loading && notifications.length === 0 && <div style={s.empty}>🔔 No pending notifications.</div>}
      <div style={s.list}>
        {notifications.map(n => (
          <div key={n.id} style={s.card}>
            <div style={s.cardTop}>
              <div>
                <div style={s.notifTitle}>{n.title || n.type}</div>
                <div style={s.notifMsg}>{n.message}</div>
                <div style={s.notifTime}>{fmt(n.created_at)}</div>
              </div>
              <button style={s.readBtn} onClick={() => markRead(n.id)}>✓ Read</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '700px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  header: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' },
  title: { fontSize: '1.4rem', fontWeight: 700, color: '#111', display: 'flex', alignItems: 'center', gap: '8px' },
  count: { background: '#148477', color: '#fff', borderRadius: '12px', padding: '2px 8px', fontSize: '0.8rem' },
  empty: { textAlign: 'center', color: '#666', padding: '60px 0' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  card: { background: '#fff', borderRadius: '12px', padding: '16px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  notifTitle: { fontWeight: 700, color: '#111', fontSize: '0.95rem', marginBottom: '4px' },
  notifMsg: { color: '#555', fontSize: '0.88rem', marginBottom: '4px' },
  notifTime: { color: '#aaa', fontSize: '0.8rem' },
  readBtn: { background: '#e8f5e9', color: '#2e7d32', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', whiteSpace: 'nowrap' },
};
