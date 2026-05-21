import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verificationAPI } from '../../api/endpoints';

const steps = [
  { icon: '🪪', label: 'National ID', points: 25, path: '/verification/upload-id' },
  { icon: '📱', label: 'Phone Verification', points: 20, path: '/verification/verify-phone' },
  { icon: '🤳', label: 'Facial Recognition', points: 30, path: '/verification/upload-selfie' },
  { icon: '📄', label: 'Skill Documents', points: 25, path: '/verification/upload-skills' },
];

export default function VerificationStart() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async () => {
    try {
      setLoading(true);
      setError('');
      await verificationAPI.initiate();
      navigate('/verification/upload-id');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>✅</div>
        <h2 style={styles.title}>Get Verified</h2>
        <p style={styles.sub}>Complete verification to unlock jobs and build trust with customers. You can earn up to 100 points.</p>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.steps}>
          {steps.map((s, i) => (
            <div key={i} style={styles.step}>
              <span style={styles.stepIcon}>{s.icon}</span>
              <div style={styles.stepInfo}>
                <div style={styles.stepLabel}>{s.label}</div>
                <div style={styles.stepPoints}>+{s.points} pts</div>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.thresholds}>
          <div style={styles.threshold}><span style={{ color: '#2e7d32' }}>✅ 80+ pts</span> — Auto-approved</div>
          <div style={styles.threshold}><span style={{ color: '#e65100' }}>👤 60–79 pts</span> — Manual review</div>
          <div style={styles.threshold}><span style={{ color: '#c62828' }}>🚩 &lt;60 pts</span> — Flagged</div>
        </div>

        <button style={styles.btn} onClick={handleStart} disabled={loading}>
          {loading ? 'Starting...' : 'Start Verification'}
        </button>

        <button style={styles.linkBtn} onClick={() => navigate('/verification/status')}>
          Check existing status →
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', fontFamily: 'Poppins, sans-serif', padding: '24px' },
  card: { background: '#fff', borderRadius: '16px', padding: '40px 32px', width: '100%', maxWidth: '480px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  icon: { fontSize: '2.5rem', textAlign: 'center', marginBottom: '12px' },
  title: { fontSize: '1.6rem', fontWeight: 700, color: '#111', textAlign: 'center', marginBottom: '8px' },
  sub: { color: '#666', fontSize: '0.95rem', textAlign: 'center', marginBottom: '28px' },
  error: { background: '#ffebee', color: '#c62828', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' },
  steps: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' },
  step: { display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', background: '#f9f9f9', borderRadius: '10px' },
  stepIcon: { fontSize: '1.6rem' },
  stepInfo: { flex: 1 },
  stepLabel: { fontWeight: 600, color: '#222', fontSize: '0.95rem' },
  stepPoints: { color: '#148477', fontSize: '0.85rem', fontWeight: 500 },
  thresholds: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '28px', padding: '14px 16px', background: '#f0faf9', borderRadius: '10px' },
  threshold: { fontSize: '0.88rem', color: '#444' },
  btn: { width: '100%', padding: '13px', background: '#148477', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', marginBottom: '12px' },
  linkBtn: { width: '100%', background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 },
};
