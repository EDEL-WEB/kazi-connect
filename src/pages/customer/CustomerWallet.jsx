import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentsAPI } from '../../api/endpoints';

export default function CustomerWallet() {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    paymentsAPI.wallet()
      .then(r => setWallet(r.data))
      .catch(() => setError('Failed to load wallet.'))
      .finally(() => setLoading(false));
  }, []);

  const money = (v) => v != null ? `KSh ${Number(v).toLocaleString()}` : '—';

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate('/dashboard')}>← Dashboard</button>
        <h2 style={s.title}>My Wallet</h2>
      </div>
      {error && <div style={s.error}>{error}</div>}
      {loading && <div style={s.empty}>Loading...</div>}
      {wallet && (
        <>
          <div style={s.cards}>
            {[
              { label: 'Available Balance', value: money(wallet.balance), bg: 'linear-gradient(135deg,#00695c,#00897b)' },
              { label: 'Held in Escrow', value: money(wallet.held_balance ?? 0), bg: 'linear-gradient(135deg,#1565c0,#1976d2)' },
              { label: 'Total Spent', value: money(wallet.total_spent ?? 0), bg: 'linear-gradient(135deg,#4a148c,#7b1fa2)' },
            ].map((c, i) => (
              <div key={i} style={{ ...s.walletCard, background: c.bg }}>
                <div style={s.wLabel}>{c.label}</div>
                <div style={s.wAmount}>{c.value}</div>
              </div>
            ))}
          </div>
          <button style={s.txBtn} onClick={() => navigate('/transactions')}>View Transactions →</button>
        </>
      )}
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '700px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' },
  title: { fontSize: '1.4rem', fontWeight: 700, color: '#111' },
  error: { background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px', marginBottom: '16px' },
  empty: { textAlign: 'center', color: '#666', padding: '60px 0' },
  cards: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' },
  walletCard: { borderRadius: '12px', padding: '20px', color: '#fff' },
  wLabel: { fontSize: '0.82rem', opacity: 0.85, marginBottom: '8px' },
  wAmount: { fontSize: '1.5rem', fontWeight: 800 },
  txBtn: { background: 'none', border: '1.5px solid #148477', color: '#148477', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' },
};
