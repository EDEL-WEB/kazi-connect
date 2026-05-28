import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobsAPI, paymentsAPI, usersAPI, categoriesAPI, workersAPI } from '../../api/endpoints';
import { useGeoLocation } from '../../hooks/useGeoLocation';
import useNotifications from '../../hooks/useNotifications';
import NotificationBell from '../../components/ui/NotificationBell';
import './CustomerDashboardModern.css';

/* ──────────────────────────────────────
   UTILITIES
   ────────────────────────────────────── */

const money = (v) => v != null ? `KES ${Number(v).toLocaleString('en-KE', { minimumFractionDigits: 0 })}` : 'KES 0';
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }) : '—';
const stars = (r) => '★'.repeat(Math.round(Number(r) || 0)) + '☆'.repeat(5 - Math.round(Number(r) || 0));
const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? '👋 Good morning' : h < 17 ? '🌤️ Good afternoon' : '🌙 Good evening';
};

const CATEGORY_ICONS = {
  plumbing: '🔧', electrical: '⚡', cleaning: '🧹', painting: '🎨',
  carpentry: '🪚', gardening: '🌿', moving: '📦', security: '🔒',
  beauty: '💅', mechanic: '🔩', tv: '📺', cctv: '📷', appliance: '🔌',
};

const STATUS_INFO = {
  pending: { badge: 'Pending', icon: '⏳', color: 'status-pending' },
  accepted: { badge: 'Accepted', icon: '✅', color: 'status-accepted' },
  in_progress: { badge: 'In Progress', icon: '⚙️', color: 'status-in-progress' },
  completed: { badge: 'Completed', icon: '🎉', color: 'status-completed' },
  cancelled: { badge: 'Cancelled', icon: '❌', color: 'status-cancelled' },
  disputed: { badge: 'Disputed', icon: '⚠️', color: 'status-cancelled' },
};

/* ──────────────────────────────────────
   COMPONENTS
   ────────────────────────────────────── */

// KPI Card Component
const KPICard = ({ icon, label, value, change, positive }) => (
  <div className="kpi-card fade-in">
    <div className="kpi-header">
      <div className="kpi-label">{label}</div>
      <div className="kpi-icon">{icon}</div>
    </div>
    <div className="kpi-value">{value}</div>
    {change && <div className={`kpi-change ${positive ? 'positive' : 'negative'}`}>
      {positive ? '↑' : '↓'} {change}
    </div>}
  </div>
);

// Status Badge Component
const StatusBadge = ({ status }) => {
  const info = STATUS_INFO[status] || STATUS_INFO.pending;
  return <div className={`status-badge ${info.color}`}>
    {info.icon} {info.badge}
  </div>;
};

// Request Card Component
const RequestCard = ({ request, onClick }) => (
  <div className="request-card fade-in" onClick={onClick}>
    <div className="request-header">
      <div>
        <div className="request-title">{request.title}</div>
        {request.category && <span className="request-category">{CATEGORY_ICONS[request.category?.toLowerCase()?.split(' ')[0]] || '🛠️'} {request.category}</span>}
      </div>
      <StatusBadge status={request.status} />
    </div>
    <div className="request-meta">
      <div className="meta-item"><span className="meta-icon">📍</span> {request.location}</div>
      <div className="meta-item"><span className="meta-icon">📅</span> {fmtDate(request.created_at)}</div>
    </div>
    <div className="request-budget">
      {money(request.budget)}
    </div>
  </div>
);

// Worker Card Component
const WorkerCard = ({ worker, onHire }) => (
  <div className="worker-card fade-in">
    <div className="worker-avatar">{worker.full_name?.charAt(0)?.toUpperCase() || '👷'}</div>
    <div className="worker-name">{worker.full_name || 'Worker'}</div>
    <div className="worker-rating">
      <span className="stars">{stars(worker.rating)}</span>
      <span>({Math.round(worker.rating || 0)})</span>
    </div>
    <div className="worker-verification">
      ✓ Verified
    </div>
    <div className="worker-meta">
      {worker.location && <div>📍 {worker.location}</div>}
      <div>{worker.total_jobs_completed || 0} jobs completed</div>
    </div>
    <div className="worker-rate">
      {worker.hourly_rate ? `KES ${Number(worker.hourly_rate).toLocaleString()}/hr` : 'Contact for rate'}
    </div>
    <button className="hire-btn" onClick={onHire}>Hire Now</button>
  </div>
);

// Sidebar Component
const Sidebar = ({ user, activeTab, setActiveTab, onLogout, sidebarOpen, setSidebarOpen }) => (
  <aside className={`dashboard-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
    <div className="sidebar-scroll">
      <a href="/" className="sidebar-logo">
        <div className="sidebar-logo-icon">K</div>
        <span>KaziConnect</span>
      </a>
      
      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <button className={`sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}>
            <span className="sidebar-link-icon">📊</span>
            Dashboard
          </button>
        </li>
        <li className="sidebar-item">
          <button className={`sidebar-link ${activeTab === 'book' ? 'active' : ''}`}
            onClick={() => { setActiveTab('book'); setSidebarOpen(false); }}>
            <span className="sidebar-link-icon">📋</span>
            Book a Service
          </button>
        </li>
        <li className="sidebar-item">
          <button className={`sidebar-link ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => { setActiveTab('requests'); setSidebarOpen(false); }}>
            <span className="sidebar-link-icon">📝</span>
            My Requests
          </button>
        </li>
        <li className="sidebar-item">
          <button className={`sidebar-link ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => { setActiveTab('payments'); setSidebarOpen(false); }}>
            <span className="sidebar-link-icon">💳</span>
            Payments
          </button>
        </li>
        <li className="sidebar-item">
          <button className={`sidebar-link ${activeTab === 'wallet' ? 'active' : ''}`}
            onClick={() => { setActiveTab('wallet'); setSidebarOpen(false); }}>
            <span className="sidebar-link-icon">💰</span>
            Wallet
            {user?.wallet_balance > 0 && <span className="sidebar-link-badge">{money(user.wallet_balance)}</span>}
          </button>
        </li>
      </ul>

      <div className="sidebar-divider"></div>

      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <button className={`sidebar-link ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => { setActiveTab('profile'); setSidebarOpen(false); }}>
            <span className="sidebar-link-icon">👤</span>
            Profile
          </button>
        </li>
      </ul>
    </div>

    <div className="sidebar-footer">
      <button className="sidebar-logout-btn" onClick={onLogout}>
        <span>🚪</span>
        <span>Logout</span>
      </button>
    </div>
  </aside>
);

// Topbar Component
const Topbar = ({ user, wallet, onMenuToggle }) => (
  <div className="topbar">
    <div className="topbar-left">
      <button onClick={onMenuToggle} style={{ display: 'none' }} className="menu-toggle">☰</button>
      <div className="topbar-search">
        <span className="topbar-search-icon">🔍</span>
        <input type="text" placeholder="Search services..." />
      </div>
    </div>
    <div className="topbar-right">
      <div className="topbar-notification">
        🔔
        <div className="notification-badge">2</div>
      </div>
      <div className="topbar-profile">
        <div className="topbar-avatar">{user?.full_name?.charAt(0)?.toUpperCase() || 'U'}</div>
        <div className="topbar-user-info">
          <div className="topbar-name">{user?.full_name?.split(' ')[0] || 'User'}</div>
          <div className="topbar-balance">{money(wallet?.balance)}</div>
        </div>
      </div>
    </div>
  </div>
);

/* ──────────────────────────────────────
   MAIN COMPONENT
   ────────────────────────────────────── */

export default function CustomerDashboardModern() {
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

  // Book form
  const [bookForm, setBookForm] = useState({
    title: '',
    description: '',
    category_id: '',
    location: '',
    budget: '',
  });
  const [bookError, setBookError] = useState('');
  const [bookLoading, setBookLoading] = useState(false);
  const { coords, locating, getOnce } = useGeoLocation();

  // Load data
  const loadAll = async () => {
    setLoading(true);
    try {
      const [jobsRes, walletRes, userRes, catsRes, txRes, workersRes] = await Promise.all([
        jobsAPI.customerJobs().catch(() => ({ data: [] })),
        paymentsAPI.wallet().catch(() => ({ data: { balance: 0 } })),
        usersAPI.me().catch(() => ({ data: user })),
        categoriesAPI.list().catch(() => ({ data: [] })),
        paymentsAPI.transactions().catch(() => ({ data: [] })),
        workersAPI.search().catch(() => ({ data: { workers: [] } })),
      ]);
      setMyJobs(jobsRes.data || []);
      setWallet(walletRes.data);
      setProfile(userRes.data || user);
      setCategories(catsRes.data || []);
      setTransactions(Array.isArray(txRes.data) ? txRes.data : txRes.data?.transactions || []);
      setWorkers(workersRes.data?.workers || []);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    getOnce();
  }, []);

  // Auto-fill location when GPS resolves
  useEffect(() => {
    if (coords?.location && !bookForm.location) {
      setBookForm(f => ({ ...f, location: coords.location }));
    }
  }, [coords]);

  const handleBookService = async (e) => {
    e.preventDefault();
    setBookLoading(true);
    setBookError('');
    try {
      await jobsAPI.create({
        ...bookForm,
        budget: Number(bookForm.budget),
        latitude: coords?.latitude ?? null,
        longitude: coords?.longitude ?? null,
      });
      setBookForm({ title: '', description: '', category_id: '', location: '', budget: '' });
      setSuccess('Request posted! Workers will be notified.');
      await loadAll();
      setActiveTab('requests');
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      setBookError(err.response?.data?.error || 'Failed to post request');
    } finally {
      setBookLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeRequests = myJobs.filter(j => ['pending', 'accepted', 'in_progress'].includes(j.status));
  const completedJobs = myJobs.filter(j => j.status === 'completed').length;

  // ── DASHBOARD TAB ──
  if (activeTab === 'dashboard') {
    return (
      <div className="dashboard-layout">
        <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} 
          onLogout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Topbar user={profile} wallet={wallet} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="main-content">
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-content">
              <div className="hero-text">
                <h1>{greeting()}, {profile?.full_name?.split(' ')[0] || 'Customer'}! 👍</h1>
                <p>Find trusted workers for any service in your area. Fast, reliable, and affordable.</p>
                <div className="hero-buttons">
                  <button className="btn btn-primary" onClick={() => setActiveTab('book')}>
                    + Book a Service
                  </button>
                  <button className="btn btn-ghost">
                    Browse Services →
                  </button>
                </div>
              </div>
              <form className="hero-search" onSubmit={(e) => {
                e.preventDefault();
                setActiveTab('book');
              }}>
                <span>🔍</span>
                <input type="text" placeholder="Search: plumber, cleaner, electrician..." />
                <button type="submit">Search</button>
              </form>
            </div>
          </section>

          {/* KPI Cards */}
          <div className="kpi-grid">
            <KPICard 
              icon="📋"
              label="Active Requests"
              value={activeRequests.length}
              change="2 this week"
              positive={true}
            />
            <KPICard 
              icon="✅"
              label="Completed Jobs"
              value={completedJobs}
              change="8% increase"
              positive={true}
            />
            <KPICard 
              icon="💰"
              label="Wallet Balance"
              value={money(wallet?.balance)}
              change="Last updated now"
              positive={true}
            />
            <KPICard 
              icon="⏳"
              label="Pending Payments"
              value={myJobs.filter(j => j.status === 'completed').length}
              change="Awaiting release"
              positive={false}
            />
          </div>

          {/* Service Categories */}
          <section className="section">
            <div className="section-header">
              <h2 className="section-title">
                <span>🏗️</span> Popular Services
              </h2>
              <a href="#" className="view-all-btn">View all →</a>
            </div>
            <div className="categories-grid">
              {[
                { icon: '🔧', name: 'Plumbing' },
                { icon: '⚡', name: 'Electrical' },
                { icon: '🧹', name: 'Cleaning' },
                { icon: '🎨', name: 'Painting' },
                { icon: '📦', name: 'Moving' },
                { icon: '🏠', name: 'Repairs' },
              ].map((cat) => (
                <button key={cat.name} className="category-card" 
                  onClick={() => setActiveTab('book')}>
                  <span className="category-icon">{cat.icon}</span>
                  <span className="category-name">{cat.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Active Requests */}
          {activeRequests.length > 0 && (
            <section className="section">
              <div className="section-header">
                <h2 className="section-title">
                  <span>📝</span> Your Active Requests
                </h2>
                <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('requests')}>
                  View all →
                </button>
              </div>
              <div className="requests-container">
                {activeRequests.slice(0, 3).map((job) => (
                  <RequestCard key={job.id} request={job}
                    onClick={() => navigate(`/jobs/${job.id}`)} />
                ))}
              </div>
            </section>
          )}

          {/* Trusted Workers */}
          {workers.length > 0 && (
            <section className="section">
              <div className="section-header">
                <h2 className="section-title">
                  <span>⭐</span> Trusted Workers Near You
                </h2>
                <a href="#" className="view-all-btn">View all →</a>
              </div>
              <div className="workers-grid">
                {workers.slice(0, 4).map((worker) => (
                  <WorkerCard key={worker.id} worker={worker}
                    onHire={() => navigate(`/workers/${worker.id}`)} />
                ))}
              </div>
            </section>
          )}

          {/* Wallet Summary */}
          <section className="section">
            <div className="section-header">
              <h2 className="section-title">
                <span>💳</span> Wallet & Transactions
              </h2>
            </div>
            <div className="wallet-card">
              <div className="wallet-content">
                <div className="wallet-label">Available Balance</div>
                <div className="wallet-amount">{money(wallet?.balance)}</div>
                <div className="wallet-actions">
                  <button className="wallet-action-btn">Add Funds</button>
                  <button className="wallet-action-btn">Withdraw</button>
                  <button className="wallet-action-btn">History</button>
                </div>
              </div>
            </div>

            {transactions.length > 0 && (
              <div style={{ marginTop: 'var(--spacing-xl)' }}>
                <h3 style={{ marginBottom: 'var(--spacing-lg)', fontSize: '1rem', fontWeight: 700 }}>
                  Recent Transactions
                </h3>
                <table className="transactions-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.slice(0, 5).map((tx, i) => (
                      <tr key={i}>
                        <td>{fmtDate(tx.created_at)}</td>
                        <td className="transaction-desc">{tx.description || tx.type}</td>
                        <td className={`transaction-amount ${tx.type === 'credit' ? 'credit' : 'debit'}`}>
                          {tx.type === 'credit' ? '+' : '-'}{money(tx.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
    );
  }

  // ── BOOK SERVICE TAB ──
  if (activeTab === 'book') {
    return (
      <div className="dashboard-layout">
        <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} 
          onLogout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Topbar user={profile} wallet={wallet} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="main-content">
          <section className="section" style={{ maxWidth: '600px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 'var(--spacing-lg)' }}>
              📋 Book a Service
            </h2>
            {bookError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                padding: 'var(--spacing-md)',
                borderRadius: '10px',
                marginBottom: 'var(--spacing-lg)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
              }}>
                {bookError}
              </div>
            )}
            <form onSubmit={handleBookService} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 700 }}>
                  What service do you need?
                </label>
                <input 
                  type="text"
                  placeholder="e.g., Fix leaking pipe, House cleaning"
                  value={bookForm.title}
                  onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-md)',
                    border: '1px solid var(--gray-200)',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 700 }}>
                  Describe the work in detail
                </label>
                <textarea 
                  rows={4}
                  placeholder="Give workers clear details so they can prepare properly..."
                  value={bookForm.description}
                  onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-md)',
                    border: '1px solid var(--gray-200)',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 700 }}>
                    Service Category
                  </label>
                  <select
                    value={bookForm.category_id}
                    onChange={(e) => setBookForm({ ...bookForm, category_id: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-md)',
                      border: '1px solid var(--gray-200)',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                    }}
                  >
                    <option value="">Select category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 700 }}>
                    Your Budget (KES)
                  </label>
                  <input 
                    type="number"
                    placeholder="e.g., 2000"
                    min={1}
                    value={bookForm.budget}
                    onChange={(e) => setBookForm({ ...bookForm, budget: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-md)',
                      border: '1px solid var(--gray-200)',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 700 }}>
                  Location
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="e.g., Westlands, Nairobi"
                    value={bookForm.location}
                    onChange={(e) => setBookForm({ ...bookForm, location: e.target.value })}
                    required
                    style={{
                      flex: 1,
                      padding: 'var(--spacing-md)',
                      border: '1px solid var(--gray-200)',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                    }}
                  />
                  <button type="button" onClick={getOnce} disabled={locating}
                    style={{ padding: '12px 14px', background: '#f0faf9', border: '1.5px solid #148477', borderRadius: '10px', cursor: 'pointer', fontSize: '1rem', flexShrink: 0 }}
                    title="Use my location">
                    {locating ? '⏳' : '📍'}
                  </button>
                </div>
                {coords && (
                  <div style={{ fontSize: '0.75rem', color: '#148477', marginTop: '4px' }}>
                    📡 GPS: {coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('dashboard')}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={bookLoading}>
                  {bookLoading ? 'Posting...' : 'Post Request'}
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>
    );
  }

  // ── REQUESTS TAB ──
  if (activeTab === 'requests') {
    return (
      <div className="dashboard-layout">
        <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} 
          onLogout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Topbar user={profile} wallet={wallet} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="main-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>📝 My Requests</h2>
            <button className="btn btn-primary" onClick={() => setActiveTab('book')}>
              + New Request
            </button>
          </div>
          <div className="requests-container">
            {myJobs.map((job) => (
              <RequestCard key={job.id} request={job} onClick={() => navigate(`/jobs/${job.id}`)} />
            ))}
          </div>
          {myJobs.length === 0 && (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
              <p style={{ fontSize: '1.1rem', color: 'var(--gray-500)', marginBottom: 'var(--spacing-lg)' }}>
                No requests yet. Let's book your first service!
              </p>
              <button className="btn btn-primary" onClick={() => setActiveTab('book')}>
                Book a Service
              </button>
            </div>
          )}

          {/* Job Detail — navigate to full page instead of modal */}
        </main>
      </div>
    );
  }

  // ── PAYMENTS TAB ──
  if (activeTab === 'payments') {
    return (
      <div className="dashboard-layout">
        <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} 
          onLogout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Topbar user={profile} wallet={wallet} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="main-content">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 'var(--spacing-xl)' }}>
            💳 Payments
          </h2>
          <section className="section">
            <div className="wallet-card">
              <div className="wallet-content">
                <div className="wallet-label">Available Balance</div>
                <div className="wallet-amount">{money(wallet?.balance)}</div>
              </div>
            </div>
          </section>
          <section className="section">
            <h3 style={{ marginBottom: 'var(--spacing-lg)', fontSize: '1.1rem', fontWeight: 700 }}>
              Transaction History
            </h3>
            {transactions.length > 0 ? (
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, i) => (
                    <tr key={i}>
                      <td>{fmtDate(tx.created_at)}</td>
                      <td className="transaction-desc">{tx.description || tx.type}</td>
                      <td className={`transaction-amount ${tx.type === 'credit' ? 'credit' : 'debit'}`}>
                        {tx.type === 'credit' ? '+' : '-'}{money(tx.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--gray-500)' }}>
                No transactions yet.
              </div>
            )}
          </section>
        </main>
      </div>
    );
  }

  // ── WALLET TAB ──
  if (activeTab === 'wallet') {
    return (
      <div className="dashboard-layout">
        <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} 
          onLogout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Topbar user={profile} wallet={wallet} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="main-content">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 'var(--spacing-xl)' }}>
            💰 My Wallet
          </h2>
          <section className="section">
            <div className="wallet-card" style={{ marginBottom: 0 }}>
              <div className="wallet-content">
                <div className="wallet-label">Total Available</div>
                <div className="wallet-amount">{money(wallet?.balance)}</div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 'var(--spacing-lg)',
                  marginTop: 'var(--spacing-2xl)',
                }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>In Escrow</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 700, marginTop: 'var(--spacing-sm)' }}>
                      {money(wallet?.escrow || 0)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Pending</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 700, marginTop: 'var(--spacing-sm)' }}>
                      {money(wallet?.pending || 0)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Total Volume</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 700, marginTop: 'var(--spacing-sm)' }}>
                      {money((wallet?.balance || 0) + (wallet?.escrow || 0) + (wallet?.pending || 0))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // ── PROFILE TAB ──
  if (activeTab === 'profile') {
    return (
      <div className="dashboard-layout">
        <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} 
          onLogout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Topbar user={profile} wallet={wallet} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="main-content">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 'var(--spacing-xl)' }}>
            👤 My Profile
          </h2>
          <section className="section" style={{ maxWidth: '500px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '100px',
                height: '100px',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '2.5rem',
                fontWeight: 700,
                margin: '0 auto var(--spacing-lg)',
                boxShadow: 'var(--shadow-lg)',
              }}>
                {profile?.full_name?.charAt(0)?.toUpperCase() || 'C'}
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 'var(--spacing-sm)' }}>
                {profile?.full_name}
              </h3>
              <p style={{ color: 'var(--gray-500)', marginBottom: 'var(--spacing-xl)' }}>
                {profile?.email}
              </p>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--spacing-lg)',
              paddingTop: 'var(--spacing-lg)',
              borderTop: '1px solid var(--gray-200)',
            }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: 'var(--spacing-sm)' }}>
                  Total Requests
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{myJobs.length}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: 'var(--spacing-sm)' }}>
                  Completed
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{completedJobs}</div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }
}
