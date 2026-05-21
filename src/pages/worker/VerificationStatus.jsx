import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verificationAPI } from '../../api/endpoints';

const components = [
  { key: 'id_verified',    label: 'National ID',         points: 25, icon: '🪪', path: '/verification/upload-id' },
  { key: 'phone_verified', label: 'Phone Verification',  points: 20, icon: '📱', path: '/verification/verify-phone' },
  { key: 'face_verified',  label: 'Facial Recognition',  points: 30, icon: '🤳', path: '/verification/upload-selfie' },
  { key: 'skill_verified', label: 'Skill Documents',     points: 25, icon: '📄', path: '/verification/upload-skills' },
];

export default function VerificationStatus() {
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    verificationAPI.status()
      .then(res => setStatus(res.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load status.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={styles.center}>Loading...</div>;
  if (error) return <div style={styles.center}><div style={styles.error}>{error}</div></div>;

  const { overall_score = 0, auto_approved, manual_review_required, flagged } = status;

  const statusBadge = auto_approved
    ? { label: '✅ Auto-Approved', bg: '#e8f5e9', color: '#2e7d32' }
    : manual_review_required
    ? { label: '👤 Under Manual Review', bg: '#fff3e0', color: '#e65100' }
    : flagged
    ? { label: '🚩 Flagged', bg: '#ffebee', color: '#c62828' }
    : { label: '⏳ In Progress', bg: '#e3f2fd', color: '#1565c0' };

  const scoreColor = overall_score >= 80 ? '#2e7d32' : overall_score >= 60 ? '#e65100' : '#c62828';

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Verification Status</h2>

        <div style={styles.scoreRing}>
          <div style={{ ...styles.scoreNum, color: scoreColor }}>{overall_score}</div>
          <div style={styles.scoreLabel}>/ 100 pts</div>
        </div>

        <div style={{ ...styles.badge, background: statusBadge.bg, color: statusBadge.color }}>
          {statusBadge.label}
        </div>

        <div style={styles.components}>
          {components.map((c) => {
            const done = status[c.key];
            return (
              <div key={c.key} style={styles.component}>
                <span style={styles.compIcon}>{c.icon}</span>
                <div style={styles.compInfo}>
                  <div style={styles.compLabel}>{c.label}</div>
                  <div style={{ ...styles.compStatus, color: done ? '#2e7d32' : '#999' }}>
                    {done ? `✓ +${c.points} pts` : `Pending — +${c.points} pts`}
                  </div>
                </div>
                {!done && (
                  <button style={styles.completeBtn} onClick={() => navigate(c.path)}>
                    Complete
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {!auto_approved && (
          <button style={styles.btn} onClick={() => navigate('/verification')}>
            Continue Verification
          </button>
        )}

        <button style={styles.dashBtn} onClick={() => navigate('/worker/dashboard')}>
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', fontFamily: 'Poppins, sans-serif', padding: '24px' },
  center: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins, sans-serif' },
  card: { background: '#fff', borderRadius: '16px', padding: '40px 32px', width: '100%', maxWidth: '480px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', textAlign: 'center' },
  title: { fontSize: '1.5rem', fontWeight: 700, color: '#111', marginBottom: '24px' },
  scoreRing: { display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '110px', height: '110px', borderRadius: '50%', border: '6px solid #e0e0e0', marginBottom: '16px' },
  scoreNum: { fontSize: '2rem', fontWeight: 800, lineHeight: 1 },
  scoreLabel: { fontSize: '0.8rem', color: '#888' },
  badge: { display: 'inline-block', padding: '6px 16px', borderRadius: '20px', fontWeight: 600, fontSize: '0.9rem', marginBottom: '28px' },
  components: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', textAlign: 'left' },
  component: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: '#f9f9f9', borderRadius: '10px' },
  compIcon: { fontSize: '1.4rem' },
  compInfo: { flex: 1 },
  compLabel: { fontWeight: 600, fontSize: '0.9rem', color: '#222' },
  compStatus: { fontSize: '0.82rem', marginTop: '2px' },
  completeBtn: { background: 'none', border: '1.5px solid #148477', color: '#148477', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' },
  error: { background: '#ffebee', color: '#c62828', padding: '12px 16px', borderRadius: '8px' },
  btn: { width: '100%', padding: '13px', background: '#148477', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', marginBottom: '10px' },
  dashBtn: { width: '100%', padding: '11px', background: 'none', border: '1.5px solid #148477', color: '#148477', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' },
};
