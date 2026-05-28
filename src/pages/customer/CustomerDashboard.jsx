import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobsAPI, paymentsAPI, usersAPI, categoriesAPI, workersAPI } from '../../api/endpoints';
import useNotifications from '../../hooks/useNotifications';
import NotificationBell from '../../components/ui/NotificationBell';
import './CustomerDashboard.css';

const STATUS_COLORS = {
  pending:     { bg: '#fff3cd', color: '#856404' },
  accepted:    { bg: '#cfe2ff', color: '#084298' },
  in_progress: { bg: '#d1ecf1', color: '#0c5460' },
  completed:   { bg: '#d1e7dd', color: '#0f5132' },
  cancelled:   { bg: '#f8d7da', color: '#842029' },
  disputed:    { bg: '#f3d9fa', color: '#6f42c1' },
};

const CATEGORY_ICONS = {
  plumbing: '🔧', electrical: '⚡', cleaning: '🧹', painting: '🎨',
  carpentry: '🪚', gardening: '🌿', moving: '📦', security: '🔒',
  beauty: '💅', mechanic: '🔩', tv: '📺', cctv: '📷',
};

const StatusBadge = ({ status }) => {
  const s = STATUS_COLORS[status] || STATUS_COLORS.pending;
  return (
    <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
      {status?.replace('_', ' ') || '—'}
    </span>
  );
};

const money = (v) => v != null ? `KES ${Number(v).toLocaleString('en-KE', { minimumFractionDigits: 2 })}` : 'KES 0.00';
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }) : '—';
const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; };
const catIcon = (name) => CATEGORY_ICONS[name?.toLowerCase().split(' ')[0]] || '🛠️';
const stars = (r) => '★'.repeat(Math.round(Number(r) || 0)) + '☆'.repeat(5 - Math.round(Number(r) || 0));

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [myJobs, setMyJobs] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [profile, setProfile] = useState(user);
  const [categories, setCategories] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobFilter, setJobFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Book form
  const [bookForm, setBookForm] = useState({ title: '', description: '', category_id: '', location: '', budget: '' });
  const [bookError, setBookError] = useState('');
  const [bookLoading, setBookLoading] = useState(false);

  const flash = (type, msg) => {
    if (type === 'error') setError(msg); else setSuccess(msg);
    setTimeout(() => { setError(null); setSuccess(null); }, 4000);
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      const [jobsRes, walletRes, userRes, catsRes, txRes] = await Promise.all([
        jobsAPI.customerJobs(),
        paymentsAPI.wallet(),
        usersAPI.me(),
        categoriesAPI.list(),
        paymentsAPI.transactions(),
      ]);
      setMyJobs(jobsRes.data || []);
      setWallet(walletRes.data);
      setProfile(userRes.data || user);
      setCategories(catsRes.data || []);
      setTransactions(Array.isArray(txRes.data) ? txRes.data : txRes.data?.transactions || []);
    } catch {
      flash('error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadWorkers = async (categoryId) => {
    try {
      const res = await workersAPI.search(categoryId ? { category_id: categoryId } : {});
      setWorkers(res.data?.workers || []);
    } catch { setWorkers([]); }
  };

  useEffect(() => { loadAll(); loadWorkers(); }, []);

  const handleCategoryClick = (cat) => {
    setBookForm(f => ({ ...f, category_id: cat.id, title: cat.name + ' service' }));
    loadWorkers(cat.id);
    setActiveTab('book');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setBookForm(f => ({ ...f, title: searchQuery }));
      setActiveTab('book');
    }
  };

  const handleBookService = async (e) => {
    e.preventDefault();
    setBookLoading(true);
    setBookError('');
    try {
      await jobsAPI.create({ ...bookForm, budget: Number(bookForm.budget) });
      setBookForm({ title: '', description: '', category_id: '', location: '', budget: '' });
      flash('success', 'Request posted! Workers will be notified.');
      await loadAll();
      setActiveTab('requests');
    } catch (err) {
      setBookError(err.response?.data?.error || 'Failed to post request');
    } finally {
      setBookLoading(false);
    }
  };

  const handleReleasePayment = async (jobId) => {
    setLoading(true);
    try {
      await paymentsAPI.release(jobId);
      flash('success', 'Payment released to worker!');
      await loadAll();
      setSelectedJob(null);
    } catch (err) {
      flash('error', err.response?.data?.error || 'Failed to release payment');
    } finally {
      setLoading(false);
    }
  };

  const { notifications, dismiss, dismissAll } = useNotifications(user);

  const activeRequests = myJobs.filter(j => ['pending', 'accepted', 'in_progress'].includes(j.status));
  const completedJobs  = myJobs.filter(j => j.status === 'completed');
  const filteredJobs   = jobFilter === 'all' ? myJobs : myJobs.filter(j => j.status === jobFilter);

  // ── DASHBOARD ──────────────────────────────────────────────────────────────
  const renderDashboard = () => (
    <div className="cd-content">

      {/* Greeting + Search */}
      <div className="cd-hero">
        <div className="cd-hero-text">
          <h2>{greeting()}, {profile?.full_name?.split(' ')[0] || 'there'} 👋</h2>
          <p>What service do you need today?</p>
        </div>
        <form className="cd-search-bar" onSubmit={handleSearch}>
          <span className="cd-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search services… e.g. plumber, cleaner"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {/* Service Categories */}
      <div className="cd-section">
        <div className="cd-section-header">
          <h3>Service Categories</h3>
          <button className="cd-btn-link" onClick={() => setActiveTab('book')}>Book custom →</button>
        </div>
        <div className="cd-categories-grid">
          {categories.slice(0, 8).map(cat => (
            <button key={cat.id} className="cd-category-btn" onClick={() => handleCategoryClick(cat)}>
              <span className="cd-cat-icon">{catIcon(cat.name)}</span>
              <span className="cd-cat-name">{cat.name}</span>
            </button>
          ))}
          {categories.length === 0 && [
            { id: 1, name: 'Plumbing' }, { id: 2, name: 'Electrical' },
            { id: 3, name: 'Cleaning' }, { id: 4, name: 'Painting' },
          ].map(cat => (
            <button key={cat.id} className="cd-category-btn" onClick={() => setActiveTab('book')}>
              <span className="cd-cat-icon">{catIcon(cat.name)}</span>
              <span className="cd-cat-name">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="cd-grid">
        {/* Active Requests */}
        <div className="cd-section">
          <div className="cd-section-header">
            <h3>Active Requests</h3>
            <button className="cd-btn-link" onClick={() => setActiveTab('requests')}>View all →</button>
          </div>
          {activeRequests.length === 0 ? (
            <div className="cd-empty">
              <p>No active requests.</p>
              <button className="cd-btn-primary" style={{ marginTop: 12 }} onClick={() => setActiveTab('book')}>
                Book a Service
              </button>
            </div>
          ) : (
            activeRequests.slice(0, 4).map(job => (
              <div key={job.id} className="cd-job-row" onClick={() => { setSelectedJob(job); setActiveTab('requests'); }}>
                <div className="cd-job-row-info">
                  <strong>{job.title}</strong>
                  <span className="cd-job-meta-text">📍 {job.location} · {fmtDate(job.created_at)}</span>
                </div>
                <div className="cd-job-row-right">
                  <span className="cd-job-budget">{money(job.budget)}</span>
                  <StatusBadge status={job.status} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Wallet Summary */}
        <div className="cd-section">
          <div className="cd-section-header">
            <h3>Wallet</h3>
            <button className="cd-btn-link" onClick={() => setActiveTab('payments')}>Details →</button>
          </div>
          <div className="cd-wallet-mini">
            <div className="cd-wallet-mini-balance">
              <span className="cd-wallet-mini-label">Available Balance</span>
              <span className="cd-wallet-mini-amount">{money(wallet?.balance)}</span>
            </div>
          </div>
          <div className="cd-section-header" style={{ marginTop: 16, marginBottom: 8 }}>
            <h3 style={{ fontSize: '0.88rem', color: '#888' }}>Recent Activity</h3>
          </div>
          {transactions.length === 0 ? (
            <div className="cd-empty" style={{ padding: '16px 0' }}><p>No transactions yet.</p></div>
          ) : (
            transactions.slice(0, 4).map((tx, i) => (
              <div key={i} className="cd-tx-row">
                <div>
                  <div className="cd-tx-desc">{tx.description || tx.type}</div>
                  <div className="cd-tx-date">{fmtDate(tx.created_at)}</div>
                </div>
                <span className={`cd-tx-amount ${tx.type === 'credit' ? 'cd-credit' : 'cd-debit'}`}>
                  {tx.type === 'credit' ? '+' : '-'}{money(tx.amount)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Trusted Workers */}
      {workers.length > 0 && (
        <div className="cd-section">
          <div className="cd-section-header">
            <h3>Trusted Workers Near You</h3>
          </div>
          <div className="cd-workers-grid">
            {workers.slice(0, 4).map(w => (
              <div key={w.id} className="cd-worker-card" onClick={() => navigate(`/workers/${w.id}`)}>
                <div className="cd-worker-avatar">{w.full_name?.charAt(0) || '👷'}</div>
                <div className="cd-worker-info">
                  <div className="cd-worker-name">{w.full_name || 'Worker'}</div>
                  <div className="cd-worker-stars">{stars(w.rating)}</div>
                  <div className="cd-worker-meta">
                    {w.location && <span>📍 {w.location}</span>}
                    <span>✅ {w.total_jobs_completed} jobs</span>
                  </div>
                </div>
                <div className="cd-worker-rate">{w.hourly_rate ? `KES ${Number(w.hourly_rate).toLocaleString()}/hr` : ''}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // ── BOOK SERVICE ───────────────────────────────────────────────────────────
  const renderBook = () => (
    <div className="cd-content">
      <h2 className="cd-page-title">Book a Service</h2>
      <div className="cd-form-card">
        {bookError && <div className="cd-form-error">{bookError}</div>}
        <form onSubmit={handleBookService}>
          <div className="cd-field">
            <label>What do you need?</label>
            <input type="text" placeholder="e.g. Fix leaking pipe, House cleaning" value={bookForm.title}
              onChange={e => setBookForm({ ...bookForm, title: e.target.value })} required />
          </div>
          <div className="cd-field">
            <label>Describe the work</label>
            <textarea rows={3} placeholder="Give details so workers can prepare…" value={bookForm.description}
              onChange={e => setBookForm({ ...bookForm, description: e.target.value })} required />
          </div>
          <div className="cd-field-row">
            <div className="cd-field">
              <label>Service Category</label>
              <select value={bookForm.category_id} onChange={e => setBookForm({ ...bookForm, category_id: e.target.value })} required>
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="cd-field">
              <label>Your Budget (KES)</label>
              <input type="number" placeholder="e.g. 2000" min={1} value={bookForm.budget}
                onChange={e => setBookForm({ ...bookForm, budget: e.target.value })} required />
            </div>
          </div>
          <div className="cd-field">
            <label>Location</label>
            <input type="text" placeholder="e.g. Westlands, Nairobi" value={bookForm.location}
              onChange={e => setBookForm({ ...bookForm, location: e.target.value })} required />
          </div>
          <div className="cd-form-actions">
            <button type="button" className="cd-btn-ghost" onClick={() => setActiveTab('dashboard')}>Cancel</button>
            <button type="submit" className="cd-btn-primary" disabled={bookLoading}>
              {bookLoading ? 'Posting…' : 'Post Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // ── MY REQUESTS ────────────────────────────────────────────────────────────
  const renderRequests = () => (
    <div className="cd-content">
      <div className="cd-page-header">
        <h2 className="cd-page-title">My Requests</h2>
        <button className="cd-btn-primary" onClick={() => setActiveTab('book')}>+ New Request</button>
      </div>

      <div className="cd-filter-tabs">
        {[
          { key: 'all', label: 'All', count: myJobs.length },
          { key: 'pending', label: 'Pending' },
          { key: 'accepted', label: 'Accepted' },
          { key: 'in_progress', label: 'In Progress' },
          { key: 'completed', label: 'Completed' },
          { key: 'cancelled', label: 'Cancelled' },
        ].map(f => (
          <button key={f.key} className={`cd-filter-tab ${jobFilter === f.key ? 'active' : ''}`}
            onClick={() => setJobFilter(f.key)}>
            {f.label}
            {f.count != null && <span className="cd-tab-count">{f.count}</span>}
          </button>
        ))}
      </div>

      <div className="cd-jobs-layout">
        <div className="cd-jobs-list">
          {filteredJobs.length === 0 ? (
            <div className="cd-empty" style={{ background: '#fff', borderRadius: 12, padding: 40 }}>
              <p>No {jobFilter !== 'all' ? jobFilter.replace('_', ' ') : ''} requests found.</p>
              <button className="cd-btn-primary" style={{ marginTop: 12 }} onClick={() => setActiveTab('book')}>
                Book a Service
              </button>
            </div>
          ) : (
            filteredJobs.map(job => (
              <div key={job.id} className={`cd-job-card ${selectedJob?.id === job.id ? 'selected' : ''}`}
                onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}>
                <div className="cd-job-card-top">
                  <div>
                    <h4>{job.title}</h4>
                    {job.category && <span className="cd-category-tag">{catIcon(job.category)} {job.category}</span>}
                  </div>
                  <StatusBadge status={job.status} />
                </div>
                <div className="cd-job-card-meta">
                  <span>📍 {job.location}</span>
                  <span>💰 {money(job.budget)}</span>
                  <span>📅 {fmtDate(job.created_at)}</span>
                </div>
                {job.proposed_rate && (
                  <div className="cd-proposed-rate">
                    Worker proposed: <strong>{money(job.proposed_rate)}</strong>
                    {job.status === 'pending' && (
                      <button className="cd-btn-sm cd-btn-green" style={{ marginLeft: 12 }}
                        onClick={e => { e.stopPropagation(); navigate(`/jobs/${job.id}/approve-rate`); }}>
                        Review Rate
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {selectedJob && (
          <div className="cd-detail-panel">
            <button className="cd-close-panel" onClick={() => setSelectedJob(null)}>✕</button>
            <h3>{selectedJob.title}</h3>
            <div style={{ marginBottom: 12 }}><StatusBadge status={selectedJob.status} /></div>

            <div className="cd-detail-section">
              {selectedJob.category && <div className="cd-detail-row"><span>Category</span><strong>{selectedJob.category}</strong></div>}
              <div className="cd-detail-row"><span>Location</span><strong>{selectedJob.location}</strong></div>
              <div className="cd-detail-row"><span>Budget</span><strong>{money(selectedJob.budget)}</strong></div>
              {selectedJob.proposed_rate && <div className="cd-detail-row"><span>Worker Rate</span><strong>{money(selectedJob.proposed_rate)}</strong></div>}
              <div className="cd-detail-row"><span>Posted</span><strong>{fmtDate(selectedJob.created_at)}</strong></div>
            </div>

            {selectedJob.description && (
              <div className="cd-detail-section">
                <p className="cd-description">{selectedJob.description}</p>
              </div>
            )}

            <div className="cd-detail-actions">
              {selectedJob.status === 'pending' && selectedJob.proposed_rate && (
                <button className="cd-btn-primary" style={{ width: '100%' }}
                  onClick={() => navigate(`/jobs/${selectedJob.id}/approve-rate`)}>
                  Approve Worker Rate
                </button>
              )}
              {selectedJob.status === 'in_progress' && (
                <button className="cd-btn-primary" style={{ width: '100%' }}
                  onClick={() => navigate(`/tracking/${selectedJob.id}`)}>
                  Track Worker
                </button>
              )}
              {selectedJob.status === 'completed' && (
                <>
                  <button className="cd-btn-success" style={{ width: '100%' }}
                    onClick={() => handleReleasePayment(selectedJob.id)} disabled={loading}>
                    {loading ? 'Releasing…' : 'Release Payment'}
                  </button>
                  <button className="cd-btn-ghost" style={{ width: '100%', marginTop: 8 }}
                    onClick={() => navigate(`/reviews/create?jobId=${selectedJob.id}`)}>
                    Leave a Review
                  </button>
                </>
              )}
              {['pending', 'accepted'].includes(selectedJob.status) && (
                <button className="cd-btn-danger" style={{ width: '100%', marginTop: 8 }}
                  onClick={() => navigate(`/jobs/${selectedJob.id}/cancel`)}>
                  Cancel Request
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ── PAYMENTS ───────────────────────────────────────────────────────────────
  const renderPayments = () => (
    <div className="cd-content">
      <h2 className="cd-page-title">Payments</h2>
      <div className="cd-wallet-card">
        <div className="cd-wallet-label">Available Balance</div>
        <div className="cd-wallet-amount">{money(wallet?.balance)}</div>
      </div>
      <div className="cd-section" style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 16, fontWeight: 700 }}>Transaction History</h3>
        {transactions.length === 0 ? (
          <div className="cd-empty"><p>No transactions yet.</p></div>
        ) : (
          <div className="cd-table-wrap">
            <table className="cd-table">
              <thead><tr><th>Date</th><th>Description</th><th>Amount</th></tr></thead>
              <tbody>
                {transactions.map((tx, i) => (
                  <tr key={i}>
                    <td>{fmtDate(tx.created_at)}</td>
                    <td>{tx.description || tx.type}</td>
                    <td className={tx.type === 'credit' ? 'cd-credit' : 'cd-debit'}>
                      {tx.type === 'credit' ? '+' : '-'}{money(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  // ── PROFILE ────────────────────────────────────────────────────────────────
  const renderProfile = () => (
    <div className="cd-content">
      <h2 className="cd-page-title">Profile</h2>
      <div className="cd-profile-card">
        <div className="cd-profile-avatar">{profile?.full_name?.charAt(0)?.toUpperCase() || 'C'}</div>
        <h3>{profile?.full_name}</h3>
        <p className="cd-profile-email">{profile?.email}</p>
        <div className="cd-profile-details">
          <div className="cd-detail-row"><span>Phone</span><strong>{profile?.phone || '—'}</strong></div>
          <div className="cd-detail-row"><span>Location</span><strong>{profile?.location || '—'}</strong></div>
          <div className="cd-detail-row"><span>Requests Posted</span><strong>{myJobs.length}</strong></div>
          <div className="cd-detail-row"><span>Completed</span><strong>{completedJobs.length}</strong></div>
        </div>
      </div>
    </div>
  );

  const views = { dashboard: renderDashboard, book: renderBook, requests: renderRequests, payments: renderPayments, profile: renderProfile };

  const navItems = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { id: 'book',      icon: '➕', label: 'Book a Service' },
    { id: 'requests',  icon: '📋', label: 'My Requests', count: activeRequests.length || null },
    { id: 'payments',  icon: '💰', label: 'Payments' },
    { id: 'profile',   icon: '👤', label: 'Profile' },
  ];

  return (
    <div className="cd-layout">
      <aside className={`cd-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="cd-sidebar-top">
          <div className="cd-sidebar-avatar">{profile?.full_name?.charAt(0)?.toUpperCase() || 'C'}</div>
          <div className="cd-sidebar-name">{profile?.full_name || 'Customer'}</div>
          <div className="cd-sidebar-email">{profile?.email}</div>
        </div>
        <nav className="cd-nav">
          {navItems.map(item => (
            <button key={item.id} className={`cd-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}>
              <span className="cd-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.count > 0 && <span className="cd-nav-badge">{item.count}</span>}
            </button>
          ))}
        </nav>
        <button className="cd-logout" onClick={() => { logout(); window.location.href = '/login'; }}>
          🚪 Logout
        </button>
      </aside>

      <div className="cd-main">
        <header className="cd-topbar">
          <button className="cd-hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <h1 className="cd-topbar-title">{navItems.find(n => n.id === activeTab)?.label || 'Dashboard'}</h1>
          <div className="cd-topbar-right">
            <div className="cd-topbar-balance">{money(wallet?.balance)}</div>
            <NotificationBell notifications={notifications} onDismiss={dismiss} onDismissAll={dismissAll} />
            <div className="cd-topbar-avatar">{profile?.full_name?.charAt(0)?.toUpperCase() || 'C'}</div>
          </div>
        </header>

        <main className="cd-page">
          {error   && <div className="cd-flash cd-flash-error">{error}</div>}
          {success && <div className="cd-flash cd-flash-success">{success}</div>}
          {loading && <div className="cd-loading">Loading…</div>}
          {(views[activeTab] || views.dashboard)()}
        </main>
      </div>

      {sidebarOpen && <div className="cd-overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}
