import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../api/endpoints';

export default function SMSCenter() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    adminAPI.atBalance().then(r => setBalance(r.data)).catch(() => {});
  }, []);

  return (
    <div style={s.page}>
      <h2 style={s.title}>SMS Center</h2>
      {balance && (
        <div style={s.balanceCard}>
          <div style={s.balLabel}>Africa's Talking Balance</div>
          <div style={s.balAmount}>{balance.balance ?? balance.Balance ?? '—'}</div>
        </div>
      )}
      <div style={s.actions}>
        <div style={s.actionCard} onClick={() => navigate('/admin/sms/send')}>
          <div style={s.actionIcon}>📤</div>
          <h3 style={s.actionTitle}>Send SMS</h3>
          <p style={s.actionDesc}>Send a message to one or more users.</p>
        </div>
        <div style={s.actionCard} onClick={() => navigate('/admin/africastalking')}>
          <div style={s.actionIcon}>💰</div>
          <h3 style={s.actionTitle}>Check Balance</h3>
          <p style={s.actionDesc}>View Africa's Talking account balance.</p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { padding: '24px', fontFamily: 'Poppins, sans-serif' },
  title: { fontSize: '1.4rem', fontWeight: 700, color: '#111', marginBottom: '20px' },
  balanceCard: { background: 'linear-gradient(135deg,#00695c,#00897b)', borderRadius: '12px', padding: '20px', color: '#fff', marginBottom: '24px', display: 'inline-block' },
  balLabel: { fontSize: '0.82rem', opacity: 0.85, marginBottom: '6px' },
  balAmount: { fontSize: '1.6rem', fontWeight: 800 },
  actions: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' },
  actionCard: { background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', cursor: 'pointer', textAlign: 'center' },
  actionIcon: { fontSize: '2rem', marginBottom: '10px' },
  actionTitle: { fontSize: '1rem', fontWeight: 700, color: '#111', marginBottom: '4px' },
  actionDesc: { color: '#666', fontSize: '0.85rem' },
};
