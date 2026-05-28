import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  jobsAPI, paymentsAPI, notificationsAPI, verificationAPI,
  jobUpdatesAPI, usersAPI,
} from '../../api/endpoints';
import useNotifications from '../../hooks/useNotifications';
import NotificationBell from '../../components/ui/NotificationBell';
import './WorkerDashboard.css';

export default function WorkerDashboard() {
  const { user, logout } = useAuth();
  const { notifications, dismiss, dismissAll } = useNotifications(user);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Data
  const [availableJobs, setAvailableJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  // notifications managed by useNotifications hook
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [profile, setProfile] = useState(user);
  const [selectedJob, setSelectedJob] = useState(null);

  // Accept job dialog
  const [acceptDialog, setAcceptDialog] = useState(null);
  const [proposedRate, setProposedRate] = useState('');

  // Progress dialog
  const [progressDialog, setProgressDialog] = useState(null);
  const [progressValue, setProgressValue] = useState(0);
  const [progressNote, setProgressNote] = useState('');

  useEffect(() => {
    notificationsAPI.heartbeat().catch(() => {});
    loadAll();
    return () => notificationsAPI.offline().catch(() => {});
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [avail, mine, w, t, u] = await Promise.all([
        jobsAPI.availableJobs(),
        jobsAPI.myJobs(),
        paymentsAPI.wallet(),
        paymentsAPI.transactions(),
        usersAPI.me(),
      ]);
      setAvailableJobs(avail.data?.jobs || avail.data || []);
      setMyJobs(mine.data?.jobs || mine.data || []);
      setWallet(w.data);
      setTransactions(Array.isArray(t.data) ? t.data : t.data?.transactions || []);
      setProfile(u.data || user);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
    try {
      const vs = await verificationAPI.status();
      setVerificationStatus(vs.data);
    } catch {}
  };

  const flash = (type, msg) => {
    if (type === 'error') setError(msg);
    else setSuccess(msg);
    setTimeout(() => { setError(null); setSuccess(null); }, 4000);
  };

  const handleAcceptJob = async () => {
    if (!acceptDialog || !proposedRate) return;
    setLoading(true);
    try {
      await jobsAPI.accept(acceptDialog.id, { proposed_rate: Number(proposedRate) });
      flash('success', 'Job accepted! Rate proposed to customer.');
      setAcceptDialog(null);
      setProposedRate('');
      loadAll();
    } catch (err) {
      flash('error', err.response?.data?.error || 'Failed to accept job');
    } finally { setLoading(false); }
  };

  const handleUpdateStatus = async (jobId, status) => {
    setLoading(true);
    try {
      await jobsAPI.updateStatus(jobId, { status });
      flash('success', `Job status updated to ${status.replace('_', ' ')}`);
      loadAll();
    } catch (err) {
      flash('error', err.response?.data?.error || 'Failed to update status');
    } finally { setLoading(false); }
  };

  const handleUpdateProgress = async () => {
    if (!progressDialog) return;
    setLoading(true);
    try {
      await jobUpdatesAPI.updateProgress(progressDialog.id, { progress: progressValue });
      if (progressNote) await jobUpdatesAPI.addNote(progressDialog.id, { note: progressNote });
      flash('success', 'Progress updated!');
      setProgressDialog(null);
      setProgressValue(0);
      setProgressNote('');
    } catch (err) {
      flash('error', err.response?.data?.error || 'Failed to update progress');
    } finally { setLoading(false); }
  };

  // keep renderNotifications tab working with hook data
  const handleMarkRead = dismiss;

  const handleInitiateVerification = async () => {
    try {
      await verificationAPI.initiate();
      const vs = await verificationAPI.status();
      setVerificationStatus(vs.data);
      flash('success', 'Verification started!');
    } catch (err) {
      flash('error', err.response?.data?.error || 'Failed to start verification');
    }
  };

  const statusColor = {
    pending: '#f59e0b', accepted: '#3b82f6', in_progress: '#8b5cf6',
    completed: '#10b981', cancelled: '#ef4444', disputed: '#ec4899',
  };

  const StatusBadge = ({ status }) => (
    <span style={{
      background: (statusColor[status] || '#999') + '22',
      color: statusColor[status] || '#999',
      padding: '2px 10px', borderRadius: 20,
      fontSize: 12, fontWeight: 700, textTransform: 'capitalize',
    }}>{status?.replace('_', ' ') || '—'}</span>
  );

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const money = (v) => v != null ? `KSh ${Number(v).toLocaleString()}` : '—';

  // ── VIEWS ──────────────────────────────────────────────────────────────────

  const renderDashboard = () => (
    <div className="wd-content">
      <div className="wd-welcome">
        <div>
          <h2>Welcome back, {profile?.full_name?.split(' ')[0] || 'Worker'} 👋</h2>
          <p>Here's your work overview for today.</p>
        </div>
        <button className="wd-btn-primary" onClick={() => setActiveTab('available')}>Browse Jobs</button>
      </div>

      <div className="wd-stats">
        <div className="wd-stat" style={{ background: 'linear-gradient(135deg,#00695c,#00897b)' }}>
          <span className="wd-stat-icon">💰</span>
          <div className="wd-stat-label">Wallet Balance</div>
          <div className="wd-stat-value">{money(wallet?.balance)}</div>
          <div className="wd-stat-sub">Available</div>
        </div>
        <div className="wd-stat" style={{ background: 'linear-gradient(135deg,#1565c0,#1976d2)' }}>
          <span className="wd-stat-icon">⚡</span>
          <div className="wd-stat-label">Active Jobs</div>
          <div className="wd-stat-value">{myJobs.filter(j => ['accepted','in_progress'].includes(j.status)).length}</div>
          <div className="wd-stat-sub">In progress</div>
        </div>
        <div className="wd-stat" style={{ background: 'linear-gradient(135deg,#2e7d32,#388e3c)' }}>
          <span className="wd-stat-icon">✅</span>
          <div className="wd-stat-label">Completed</div>
          <div className="wd-stat-value">{myJobs.filter(j => j.status === 'completed').length}</div>
          <div className="wd-stat-sub">All time</div>
        </div>
        <div className="wd-stat" style={{ background: 'linear-gradient(135deg,#e65100,#f57c00)' }}>
          <span className="wd-stat-icon">🔍</span>
          <div className="wd-stat-label">Available Jobs</div>
          <div className="wd-stat-value">{availableJobs.length}</div>
          <div className="wd-stat-sub">Near you</div>
        </div>
      </div>

      {/* Active jobs */}
      <div className="wd-section">
        <h3 className="wd-section-title">Active Jobs</h3>
        {myJobs.filter(j => ['accepted','in_progress'].includes(j.status)).length === 0 ? (
          <div className="wd-empty"><p>No active jobs. Browse available jobs to get started!</p></div>
        ) : (
          <div className="wd-jobs-grid">
            {myJobs.filter(j => ['accepted','in_progress'].includes(j.status)).map(j => (
              <div key={j.id} className="wd-job-card">
                <div className="wd-job-header">
                  <h4>{j.title}</h4>
                  <StatusBadge status={j.status} />
                </div>
                <div className="wd-job-meta">
                  <span>📍 {j.location}</span>
                  <span>💰 {money(j.proposed_rate || j.budget)}</span>
                  <span>📅 {fmt(j.created_at)}</span>
                </div>
                <div className="wd-job-actions">
                  {j.status === 'accepted' && (
                    <button className="wd-btn-sm wd-btn-blue" onClick={() => handleUpdateStatus(j.id, 'in_progress')}>
                      Start Job
                    </button>
                  )}
                  {j.status === 'in_progress' && (
                    <>
                      <button className="wd-btn-sm wd-btn-green" onClick={() => handleUpdateStatus(j.id, 'completed')}>
                        Complete
                      </button>
                      <button className="wd-btn-sm wd-btn-outline" onClick={() => { setProgressDialog(j); setProgressValue(0); }}>
                        Update Progress
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available jobs preview */}
      <div className="wd-section">
        <div className="wd-section-header">
          <h3 className="wd-section-title">Available Jobs</h3>
          <button className="wd-btn-link" onClick={() => setActiveTab('available')}>View all →</button>
        </div>
        {availableJobs.length === 0 ? (
          <div className="wd-empty"><p>No available jobs at the moment.</p></div>
        ) : (
          <div className="wd-jobs-grid">
            {availableJobs.slice(0, 3).map(j => (
              <div key={j.id} className="wd-job-card">
                <div className="wd-job-header">
                  <h4>{j.title}</h4>
                  <span className="wd-badge-new">New</span>
                </div>
                <p className="wd-job-desc">{j.description?.substring(0, 80)}{j.description?.length > 80 ? '…' : ''}</p>
                <div className="wd-job-meta">
                  <span>📍 {j.location}</span>
                  <span>💰 {money(j.budget)}</span>
                </div>
                <button className="wd-btn-primary wd-btn-sm-full" onClick={() => { setAcceptDialog(j); setProposedRate(''); }}>
                  Accept & Propose Rate
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderAvailableJobs = () => (
    <div className="wd-content">
      <h2 className="wd-page-title">Available Jobs</h2>
      {availableJobs.length === 0 ? (
        <div className="wd-empty"><div style={{ fontSize: 48 }}>🔍</div><p>No available jobs right now. Check back soon!</p></div>
      ) : (
        <div className="wd-jobs-grid">
          {availableJobs.map(j => (
            <div key={j.id} className="wd-job-card">
              <div className="wd-job-header">
                <h4>{j.title}</h4>
                <span className="wd-badge-new">New</span>
              </div>
              <p className="wd-job-desc">{j.description}</p>
              <div className="wd-job-meta">
                <span>📍 {j.location}</span>
                <span>💰 Budget: {money(j.budget)}</span>
                <span>📅 {fmt(j.created_at)}</span>
              </div>
              <button className="wd-btn-primary" style={{ width: '100%', marginTop: 12 }}
                onClick={() => { setAcceptDialog(j); setProposedRate(''); }}>
                Accept & Propose Rate
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderMyJobs = () => (
    <div className="wd-content">
      <h2 className="wd-page-title">My Jobs</h2>
      {myJobs.length === 0 ? (
        <div className="wd-empty"><div style={{ fontSize: 48 }}>💼</div><p>No jobs yet. Browse available jobs!</p></div>
      ) : (
        <div className="wd-table-wrap">
          <table className="wd-table">
            <thead>
              <tr><th>Title</th><th>Location</th><th>Status</th><th>Rate</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {myJobs.map(j => (
                <tr key={j.id}>
                  <td><strong>{j.title}</strong></td>
                  <td>{j.location}</td>
                  <td><StatusBadge status={j.status} /></td>
                  <td>{money(j.proposed_rate || j.budget)}</td>
                  <td>{fmt(j.created_at)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {j.status === 'accepted' && (
                        <button className="wd-btn-sm wd-btn-blue" onClick={() => handleUpdateStatus(j.id, 'in_progress')}>Start</button>
                      )}
                      {j.status === 'in_progress' && (
                        <>
                          <button className="wd-btn-sm wd-btn-green" onClick={() => handleUpdateStatus(j.id, 'completed')}>Complete</button>
                          <button className="wd-btn-sm wd-btn-outline" onClick={() => { setProgressDialog(j); setProgressValue(0); }}>Progress</button>
                        </>
                      )}
                      {j.status === 'completed' && <span style={{ color: '#10b981', fontSize: 13 }}>✅ Done</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderEarnings = () => (
    <div className="wd-content">
      <h2 className="wd-page-title">Earnings & Wallet</h2>
      <div className="wd-wallet-cards">
        <div className="wd-wallet-card" style={{ background: 'linear-gradient(135deg,#00695c,#00897b)' }}>
          <div className="wd-wallet-label">Available Balance</div>
          <div className="wd-wallet-amount">{money(wallet?.balance)}</div>
        </div>
        <div className="wd-wallet-card" style={{ background: 'linear-gradient(135deg,#1565c0,#1976d2)' }}>
          <div className="wd-wallet-label">Held in Escrow</div>
          <div className="wd-wallet-amount">{money(wallet?.held_balance ?? 0)}</div>
        </div>
      </div>
      <div className="wd-section">
        <h3 className="wd-section-title">Transaction History</h3>
        {transactions.length === 0 ? (
          <div className="wd-empty"><p>No transactions yet</p></div>
        ) : (
          <div className="wd-table-wrap">
            <table className="wd-table">
              <thead><tr><th>Type</th><th>Amount</th><th>Balance After</th><th>Date</th></tr></thead>
              <tbody>
                {transactions.map((tx, i) => (
                  <tr key={i}>
                    <td style={{ textTransform: 'capitalize' }}>
                      <span style={{ color: tx.type === 'credit' ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                        {tx.type === 'credit' ? '▲' : '▼'} {tx.type}
                      </span>
                    </td>
                    <td style={{ color: tx.type === 'credit' ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                      {tx.type === 'credit' ? '+' : '-'}{money(tx.amount)}
                    </td>
                    <td style={{ color: '#666' }}>{money(tx.balance_after)}</td>
                    <td>{fmt(tx.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderVerification = () => (
    <div className="wd-content">
      <h2 className="wd-page-title">Identity Verification</h2>
      <div className="wd-verify-card">
        <div className="wd-verify-status">
          <span style={{ fontSize: 48 }}>{verificationStatus?.status === 'approved' ? '✅' : '🔐'}</span>
          <div>
            <h3>Verification Status</h3>
            <StatusBadge status={verificationStatus?.status || 'not_started'} />
          </div>
        </div>
        {!verificationStatus ? (
          <div>
            <p style={{ color: '#666', marginBottom: 16 }}>Get verified to build trust with customers and unlock more jobs.</p>
            <button className="wd-btn-primary" onClick={handleInitiateVerification}>Start Verification</button>
          </div>
        ) : (
          <div className="wd-verify-steps">
            <p style={{ color: '#666', marginBottom: 16 }}>Complete all steps to get your verified badge.</p>
            {[
              { label: 'National ID', done: verificationStatus.id_uploaded },
              { label: 'Phone Verification', done: verificationStatus.phone_verified },
              { label: 'Selfie', done: verificationStatus.selfie_uploaded },
              { label: 'Skill Documents', done: verificationStatus.skills_uploaded },
            ].map(step => (
              <div key={step.label} className="wd-verify-step">
                <span>{step.done ? '✅' : '⬜'}</span>
                <span style={{ color: step.done ? '#10b981' : '#666' }}>{step.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="wd-content">
      <h2 className="wd-page-title">Notifications</h2>
      {notifications.length === 0 ? (
        <div className="wd-empty"><div style={{ fontSize: 48 }}>🔔</div><p>No pending notifications</p></div>
      ) : (
        <div className="wd-notif-list">
          {notifications.map(n => (
            <div key={n.id} className="wd-notif-card">
              <div>
                <div className="wd-notif-title">{n.title || n.type}</div>
                <div className="wd-notif-msg">{n.message}</div>
                <div className="wd-notif-time">{fmt(n.created_at)}</div>
              </div>
              <button className="wd-btn-sm wd-btn-green" onClick={() => handleMarkRead(n.id)}>Mark Read</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="wd-content">
      <h2 className="wd-page-title">My Profile</h2>
      <div className="wd-profile-card">
        <div className="wd-profile-avatar">{profile?.full_name?.charAt(0) || 'W'}</div>
        <h3>{profile?.full_name}</h3>
        <p style={{ color: '#666' }}>{profile?.email}</p>
        <StatusBadge status="worker" />
        <div className="wd-profile-details">
          <div className="wd-detail-row"><span>Phone</span><strong>{profile?.phone || '—'}</strong></div>
          <div className="wd-detail-row"><span>Jobs Completed</span><strong>{myJobs.filter(j => j.status === 'completed').length}</strong></div>
          <div className="wd-detail-row"><span>Active Jobs</span><strong>{myJobs.filter(j => ['accepted','in_progress'].includes(j.status)).length}</strong></div>
          <div className="wd-detail-row"><span>Verification</span><strong>{verificationStatus?.status || 'Not started'}</strong></div>
        </div>
      </div>
    </div>
  );

  const views = {
    dashboard: renderDashboard,
    available: renderAvailableJobs,
    jobs: renderMyJobs,
    earnings: renderEarnings,
    verification: renderVerification,
    notifications: renderNotifications,
    profile: renderProfile,
  };

  const navItems = [
    { id: 'dashboard',     label: 'Dashboard',      icon: '🏠' },
    { id: 'available',     label: 'Available Jobs',  icon: '🔍' },
    { id: 'jobs',          label: 'My Jobs',         icon: '💼' },
    { id: 'earnings',      label: 'Earnings',        icon: '💰' },
    { id: 'verification',  label: 'Verification',    icon: '🔐' },
    { id: 'notifications', label: `Notifications${notifications.length ? ` (${notifications.length})` : ''}`, icon: '🔔' },
    { id: 'profile',       label: 'Profile',         icon: '👤' },
  ];

  return (
    <div className="wd-layout">
      {/* Sidebar */}
      <aside className={`wd-sidebar ${sidebarOpen ? 'wd-sidebar-open' : ''}`}>
        <div className="wd-sidebar-profile">
          <div className="wd-avatar">{profile?.full_name?.charAt(0) || 'W'}</div>
          <div className="wd-profile-name">{profile?.full_name || 'Worker'}</div>
          <div className="wd-profile-email">{profile?.email}</div>
          <span className="wd-role-badge">Worker</span>
        </div>
        <nav className="wd-nav">
          {navItems.map(item => (
            <button key={item.id} className={`wd-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="wd-sidebar-wallet">
          <div className="wd-sidebar-wallet-label">Wallet Balance</div>
          <div className="wd-sidebar-wallet-amount">{money(wallet?.balance)}</div>
        </div>
        <button className="wd-logout" onClick={() => { logout(); window.location.href = '/'; }}>🚪 Logout</button>
      </aside>

      {/* Main */}
      <div className="wd-main">
        <header className="wd-topbar">
          <button className="wd-hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <h1 className="wd-topbar-title">{navItems.find(n => n.id === activeTab)?.label?.replace(/[^\w\s]/g, '').trim() || 'Dashboard'}</h1>
          <div className="wd-topbar-right">
            <NotificationBell notifications={notifications} onDismiss={dismiss} onDismissAll={dismissAll} />
            <div className="wd-avatar wd-avatar-sm">{profile?.full_name?.charAt(0) || 'W'}</div>
          </div>
        </header>

        <main className="wd-page">
          {error && <div className="wd-flash wd-flash-error">{error}</div>}
          {success && <div className="wd-flash wd-flash-success">{success}</div>}
          {loading && <div className="wd-loading">Loading…</div>}
          {(views[activeTab] || views.dashboard)()}
        </main>
      </div>

      {sidebarOpen && <div className="wd-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Accept Job Dialog */}
      {acceptDialog && (
        <div className="wd-modal-overlay" onClick={() => setAcceptDialog(null)}>
          <div className="wd-modal" onClick={e => e.stopPropagation()}>
            <div className="wd-modal-header">
              <h3>Accept Job & Propose Rate</h3>
              <button onClick={() => setAcceptDialog(null)}>✕</button>
            </div>
            <p><strong>{acceptDialog.title}</strong></p>
            <p style={{ color: '#666', fontSize: 13, margin: '8px 0' }}>📍 {acceptDialog.location}</p>
            <p style={{ color: '#666', fontSize: 13, marginBottom: 16 }}>Customer budget: {money(acceptDialog.budget)}</p>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Your Proposed Rate (KSh)</label>
            <input type="number" value={proposedRate} onChange={e => setProposedRate(e.target.value)}
              placeholder="e.g. 800" style={{ width: '100%', padding: '10px 14px', border: '1px solid #e8ecf0', borderRadius: 8, fontSize: 16, marginBottom: 16 }} />
            <p style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>You receive 85% after platform commission (15%): <strong>{proposedRate ? money(Number(proposedRate) * 0.85) : '—'}</strong></p>
            <div className="wd-modal-footer">
              <button className="wd-btn-ghost" onClick={() => setAcceptDialog(null)}>Cancel</button>
              <button className="wd-btn-primary" onClick={handleAcceptJob} disabled={loading || !proposedRate}>
                {loading ? 'Accepting…' : 'Accept Job'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Dialog */}
      {progressDialog && (
        <div className="wd-modal-overlay" onClick={() => setProgressDialog(null)}>
          <div className="wd-modal" onClick={e => e.stopPropagation()}>
            <div className="wd-modal-header">
              <h3>Update Job Progress</h3>
              <button onClick={() => setProgressDialog(null)}>✕</button>
            </div>
            <p style={{ marginBottom: 16 }}><strong>{progressDialog.title}</strong></p>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Progress: {progressValue}%</label>
            <input type="range" min={0} max={100} value={progressValue} onChange={e => setProgressValue(Number(e.target.value))}
              style={{ width: '100%', marginBottom: 16 }} />
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Note (optional)</label>
            <textarea rows={3} value={progressNote} onChange={e => setProgressNote(e.target.value)}
              placeholder="Describe what you've done so far…"
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #e8ecf0', borderRadius: 8, fontSize: 14, marginBottom: 16 }} />
            <div className="wd-modal-footer">
              <button className="wd-btn-ghost" onClick={() => setProgressDialog(null)}>Cancel</button>
              <button className="wd-btn-primary" onClick={handleUpdateProgress} disabled={loading}>
                {loading ? 'Saving…' : 'Save Progress'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
