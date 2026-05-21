import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../api/endpoints';

export default function AfricasTalkingBalance() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBalance = () => {
    setLoading(true);
    adminAPI.atBalance()
      .then(r => setData(r.data))
      .catch(() => setError('Failed to fetch balance.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBalance(); }, []);

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate('/admin/sms')}>← SMS Center</button>
      <div style={s.card}>
        <div style={s.icon}>📡</div>
        <h2 style={s.title}>Africa's Talking Balance</h2>
        {error && <div style={s.error}>{error}</div>}
        {loading && <div style={s.info}>Fetching balance...</div>}
        {data && !loading && (
          <div style={s.balanceWrap}>
            <div style={s.balAmount}>{data.balance ?? data.Balance ?? '—'}</div>
            <div style={s.balCurrency}>{data.currency ?? 'KES'}</div>
          </div>
        )}
        <button style={s.btn} onClick={fetchBalance} disabled={loading}>🔄 Refresh</button>
      </div>
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '400px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' },
  card: { background: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', textAlign: 'center' },
  icon: { fontSize: '2.5rem', marginBottom: '12px' },
  title: { fontSize: '1.3rem', fontWeight: 700, color: '#111', marginBottom: '20px' },
  error: { background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.9rem' },
  info: { color: '#666', fontSize: '0.9rem', marginBottom: '16px' },
  balanceWrap: { marginBottom: '20px' },
  balAmount: { fontSize: '2.5rem', fontWeight: 800, color: '#148477' },
  balCurrency: { color: '#888', fontSize: '0.9rem', marginTop: '4px' },
  btn: { width: '100%', padding: '11px', background: 'none', border: '1.5px solid #148477', color: '#148477', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' },
};
