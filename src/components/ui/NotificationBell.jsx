import React, { useState, useRef, useEffect } from 'react';
import './NotificationBell.css';

const TYPE_ICON = {
  push: '🔔', sms: '📱', job_created: '🛠️', job_accepted: '✅',
  rate_proposed: '💰', rate_approved: '🎉', payment: '💳',
  job_completed: '🏁', default: '🔔',
};

const fmtTime = (d) => {
  if (!d) return '';
  const diff = Math.floor((Date.now() - new Date(d)) / 1000);
  if (diff < 60)  return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });
};

export default function NotificationBell({ notifications, onDismiss, onDismissAll }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const count = notifications.length;

  return (
    <div className="nb-wrap" ref={ref}>
      <button className="nb-btn" onClick={() => setOpen(o => !o)} aria-label="Notifications">
        🔔
        {count > 0 && <span className="nb-badge">{count > 99 ? '99+' : count}</span>}
      </button>

      {open && (
        <div className="nb-panel">
          <div className="nb-header">
            <span className="nb-title">Notifications {count > 0 && <span className="nb-count">{count}</span>}</span>
            {count > 0 && (
              <button className="nb-clear-all" onClick={() => { onDismissAll(); setOpen(false); }}>
                Clear all
              </button>
            )}
          </div>

          <div className="nb-list">
            {count === 0 ? (
              <div className="nb-empty">
                <span>🔕</span>
                <p>No new notifications</p>
              </div>
            ) : (
              notifications.map(n => (
                <div key={n.id} className={`nb-item nb-item-${n.priority || 'normal'}`}>
                  <div className="nb-item-icon">
                    {TYPE_ICON[n.type] || TYPE_ICON.default}
                  </div>
                  <div className="nb-item-body">
                    {n.title && <div className="nb-item-title">{n.title}</div>}
                    <div className="nb-item-msg">{n.message}</div>
                    <div className="nb-item-time">{fmtTime(n.created_at)}</div>
                  </div>
                  <button className="nb-dismiss" onClick={() => onDismiss(n.id)} aria-label="Dismiss">✕</button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
