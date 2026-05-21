import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { jobsAPI, paymentsAPI, reviewsAPI, usersAPI, categoriesAPI } from '../../api/endpoints';
import './CustomerDashboard.css';

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Dashboard data
  const [availableJobs, setAvailableJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [profile, setProfile] = useState(user);
  const [categories, setCategories] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobUpdates, setJobUpdates] = useState(null);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [jobsRes, myJobsRes, walletRes, userRes, categoriesRes] = await Promise.all([
          jobsAPI.availableJobs(),
          jobsAPI.myJobs(),
          paymentsAPI.wallet(),
          usersAPI.me(),
          categoriesAPI.list(),
        ]);
        
        setAvailableJobs(jobsRes.data || []);
        setMyJobs(myJobsRes.data || []);
        setWallet(walletRes.data);
        setProfile(userRes.data);
        setCategories(categoriesRes.data || []);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

  // Load transactions
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const res = await paymentsAPI.transactions();
        setTransactions(res.data || []);
      } catch (err) {
        console.error('Failed to load transactions:', err);
      }
    };
    
    loadTransactions();
  }, []);

  // Load job updates when job is selected
  useEffect(() => {
    if (!selectedJob?.id) return;
    
    const loadJobUpdates = async () => {
      try {
        const res = await jobsAPI.get(selectedJob.id);
        setJobUpdates(res.data);
      } catch (err) {
        console.error('Failed to load job details:', err);
      }
    };
    
    loadJobUpdates();
  }, [selectedJob]);

  const handleApplyJob = async (jobId) => {
    try {
      setLoading(true);
      await jobsAPI.accept(jobId, {});
      setAvailableJobs(prev => prev.filter(j => j.id !== jobId));
      const res = await jobsAPI.myJobs();
      setMyJobs(res.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to apply for job');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteJob = async (jobId) => {
    try {
      setLoading(true);
      await jobsAPI.updateStatus(jobId, { status: 'completed' });
      const res = await jobsAPI.myJobs();
      setMyJobs(res.data || []);
      setSelectedJob(null);
      setError(null);
    } catch (err) {
      setError('Failed to complete job');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReleasePayment = async (jobId) => {
    try {
      setLoading(true);
      await paymentsAPI.release(jobId);
      const walletRes = await paymentsAPI.wallet();
      setWallet(walletRes.data);
      const transRes = await paymentsAPI.transactions();
      setTransactions(transRes.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to release payment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'badge-pending',
      accepted: 'badge-accepted',
      in_progress: 'badge-progress',
      completed: 'badge-completed',
      cancelled: 'badge-cancelled',
    };
    return statusClasses[status] || 'badge-pending';
  };

  const renderDashboard = () => (
    <div className="customer-dashboard-content">
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#4CAF50' }}>
            <i className="fas fa-briefcase"></i>
          </div>
          <div className="stat-info">
            <div className="stat-label">Active Jobs</div>
            <div className="stat-value">{myJobs.filter(j => ['pending', 'accepted', 'in_progress'].includes(j.status)).length}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#2196F3' }}>
            <i className="fas fa-coins"></i>
          </div>
          <div className="stat-info">
            <div className="stat-label">Wallet Balance</div>
            <div className="stat-value">KES {wallet?.balance?.toFixed(2) || '0.00'}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#FF9800' }}>
            <i className="fas fa-star"></i>
          </div>
          <div className="stat-info">
            <div className="stat-label">Average Rating</div>
            <div className="stat-value">{profile?.rating?.toFixed(1) || 'N/A'}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#9C27B0' }}>
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-info">
            <div className="stat-label">Completed Jobs</div>
            <div className="stat-value">{myJobs.filter(j => j.status === 'completed').length}</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h3>Recent Active Jobs</h3>
          <div className="jobs-list">
            {myJobs.filter(j => ['pending', 'accepted', 'in_progress'].includes(j.status)).slice(0, 3).map(job => (
              <div key={job.id} className="job-card-compact" onClick={() => { setActiveTab('jobs'); setSelectedJob(job); }}>
                <div className="job-header">
                  <h4>{job.title}</h4>
                  <span className={`badge ${getStatusBadge(job.status)}`}>
                    {job.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="job-category">{job.category}</p>
                <div className="job-details-row">
                  <span><i className="fas fa-location-dot"></i> {job.location}</span>
                  <span><i className="fas fa-money-bill"></i> KES {job.budget?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            ))}
            {myJobs.filter(j => ['pending', 'accepted', 'in_progress'].includes(j.status)).length === 0 && (
              <p className="empty-state">No active jobs. Browse available jobs to get started!</p>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <h3>Upcoming Available Jobs</h3>
          <div className="jobs-list">
            {availableJobs.slice(0, 3).map(job => (
              <div key={job.id} className="job-card-compact">
                <div className="job-header">
                  <h4>{job.title}</h4>
                  <span className="badge badge-new">New</span>
                </div>
                <p className="job-category">{job.category}</p>
                <div className="job-details-row">
                  <span><i className="fas fa-location-dot"></i> {job.location}</span>
                  <span><i className="fas fa-money-bill"></i> KES {job.budget?.toFixed(2) || '0.00'}</span>
                </div>
                <button className="btn-apply" onClick={() => handleApplyJob(job.id)} disabled={loading}>
                  {loading ? 'Applying...' : 'Apply Now'}
                </button>
              </div>
            ))}
            {availableJobs.length === 0 && (
              <p className="empty-state">No available jobs at the moment.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderJobs = () => (
    <div className="customer-dashboard-content">
      <div className="jobs-container">
        <div className="jobs-main">
          <h3>My Jobs</h3>
          <div className="jobs-tabs">
            <button className="tab-btn active" data-filter="all">All</button>
            <button className="tab-btn" data-filter="pending">Pending</button>
            <button className="tab-btn" data-filter="in_progress">In Progress</button>
            <button className="tab-btn" data-filter="completed">Completed</button>
          </div>

          <div className="jobs-list-full">
            {myJobs.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-inbox"></i>
                <p>No jobs yet. Browse available opportunities!</p>
              </div>
            ) : (
              myJobs.map(job => (
                <div
                  key={job.id}
                  className={`job-card-full ${selectedJob?.id === job.id ? 'selected' : ''}`}
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="job-card-header">
                    <h4>{job.title}</h4>
                    <span className={`badge ${getStatusBadge(job.status)}`}>
                      {job.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="job-category">{job.category}</p>
                  <div className="job-meta">
                    <span><i className="fas fa-location-dot"></i> {job.location}</span>
                    <span><i className="fas fa-calendar"></i> {new Date(job.created_at).toLocaleDateString()}</span>
                    <span><i className="fas fa-money-bill"></i> KES {job.budget?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {selectedJob && (
          <div className="job-details-panel">
            <button className="close-panel" onClick={() => setSelectedJob(null)}>×</button>
            <h3>{selectedJob.title}</h3>
            
            <div className="detail-section">
              <h4>Job Details</h4>
              <div className="detail-row">
                <label>Status:</label>
                <span className={`badge ${getStatusBadge(selectedJob.status)}`}>
                  {selectedJob.status.replace('_', ' ')}
                </span>
              </div>
              <div className="detail-row">
                <label>Category:</label>
                <span>{selectedJob.category}</span>
              </div>
              <div className="detail-row">
                <label>Location:</label>
                <span>{selectedJob.location}</span>
              </div>
              <div className="detail-row">
                <label>Budget:</label>
                <span>KES {selectedJob.budget?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="detail-row">
                <label>Description:</label>
                <p className="description">{selectedJob.description}</p>
              </div>
            </div>

            {jobUpdates && (
              <div className="detail-section">
                <h4>Timeline & Updates</h4>
                <div className="timeline">
                  {jobUpdates.updates?.map((update, idx) => (
                    <div key={idx} className="timeline-item">
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <p className="timeline-title">{update.title}</p>
                        <p className="timeline-description">{update.description}</p>
                        <p className="timeline-date">{new Date(update.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="detail-section actions">
              {selectedJob.status === 'in_progress' && (
                <button className="btn btn-primary" onClick={() => handleCompleteJob(selectedJob.id)} disabled={loading}>
                  {loading ? 'Completing...' : 'Mark as Complete'}
                </button>
              )}
              {selectedJob.status === 'completed' && (
                <button className="btn btn-success" onClick={() => handleReleasePayment(selectedJob.id)} disabled={loading}>
                  {loading ? 'Releasing...' : 'Release Payment'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderAvailableJobs = () => (
    <div className="customer-dashboard-content">
      <h3>Available Jobs</h3>
      <div className="jobs-grid">
        {availableJobs.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-search"></i>
            <p>No available jobs at the moment. Check back soon!</p>
          </div>
        ) : (
          availableJobs.map(job => (
            <div key={job.id} className="job-card-grid">
              <div className="job-category-badge">{job.category}</div>
              <h4>{job.title}</h4>
              <p className="job-description">{job.description?.substring(0, 100)}...</p>
              
              <div className="job-info">
                <div className="info-item">
                  <i className="fas fa-location-dot"></i>
                  <span>{job.location}</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-money-bill"></i>
                  <span>KES {job.budget?.toFixed(2) || '0.00'}</span>
                </div>
              </div>

              <div className="job-footer">
                <button className="btn btn-primary" onClick={() => handleApplyJob(job.id)} disabled={loading}>
                  {loading ? 'Applying...' : 'Apply'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderWallet = () => (
    <div className="customer-dashboard-content">
      <div className="wallet-container">
        <div className="wallet-balance">
          <h3>Wallet Balance</h3>
          <div className="balance-amount">
            KES {wallet?.balance?.toFixed(2) || '0.00'}
          </div>
          <p className="balance-label">Available for withdrawal</p>
        </div>

        <div className="wallet-stats">
          <div className="wallet-stat">
            <label>Pending</label>
            <span>KES {wallet?.pending?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="wallet-stat">
            <label>Total Earned</label>
            <span>KES {wallet?.total_earned?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="wallet-stat">
            <label>Total Withdrawn</label>
            <span>KES {wallet?.total_withdrawn?.toFixed(2) || '0.00'}</span>
          </div>
        </div>

        <div className="transactions-section">
          <h4>Transaction History</h4>
          <div className="transactions-list">
            {transactions.length === 0 ? (
              <p className="empty-state">No transactions yet</p>
            ) : (
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(tx => (
                    <tr key={tx.id}>
                      <td>{new Date(tx.created_at).toLocaleDateString()}</td>
                      <td>
                        <span className={`tx-type tx-${tx.type}`}>
                          {tx.type === 'credit' ? '+' : '-'} KES {tx.amount?.toFixed(2) || '0.00'}
                        </span>
                      </td>
                      <td className={tx.type === 'credit' ? 'positive' : 'negative'}>
                        {tx.type === 'credit' ? '+' : '-'} KES {tx.amount?.toFixed(2) || '0.00'}
                      </td>
                      <td><span className={`tx-status tx-status-${tx.status}`}>{tx.status}</span></td>
                      <td>{tx.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="customer-dashboard-content">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <span>{profile?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div className="profile-info">
            <h3>{profile?.name}</h3>
            <p>{profile?.email}</p>
            <div className="profile-rating">
              <i className="fas fa-star"></i>
              <span>{profile?.rating?.toFixed(1) || '0.0'}</span>
              <span className="rating-count">({profile?.review_count || 0} reviews)</span>
            </div>
          </div>
        </div>

        <div className="profile-sections">
          <div className="profile-section">
            <h4>Contact Information</h4>
            <div className="section-row">
              <label>Phone:</label>
              <span>{profile?.phone || 'Not provided'}</span>
            </div>
            <div className="section-row">
              <label>Email:</label>
              <span>{profile?.email}</span>
            </div>
            <div className="section-row">
              <label>Location:</label>
              <span>{profile?.location || 'Not provided'}</span>
            </div>
          </div>

          <div className="profile-section">
            <h4>Account Stats</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Jobs Completed</span>
                <span className="stat-value">{myJobs.filter(j => j.status === 'completed').length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Active Jobs</span>
                <span className="stat-value">{myJobs.filter(j => ['pending', 'accepted', 'in_progress'].includes(j.status)).length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Earned</span>
                <span className="stat-value">KES {wallet?.total_earned?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Member Since</span>
                <span className="stat-value">{profile?.created_at ? new Date(profile.created_at).getFullYear() : 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h4>Verification Status</h4>
            <div className="verification-items">
              <div className="verification-item">
                <i className="fas fa-check-circle"></i>
                <span>Email Verified</span>
              </div>
              <div className="verification-item">
                <i className="fas fa-check-circle"></i>
                <span>Phone Verified</span>
              </div>
              <div className="verification-item">
                <i className={`fas fa-${profile?.id_verified ? 'check' : 'times'}-circle`}></i>
                <span>ID Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="customer-dashboard-wrapper">
      {error && (
        <div className="alert alert-error">
          <i className="fas fa-exclamation-circle"></i>
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <header className="customer-header">
        <div className="header-left">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <i className="fas fa-bars"></i>
          </button>
          <h1 className="header-title">Kazi Connect - Customer</h1>
        </div>
        <div className="header-right">
          <div className="notification-bell">
            <i className="fas fa-bell"></i>
            <span className="notification-badge">3</span>
          </div>
          <button className="btn-logout" onClick={() => { logout(); window.location.href = '/login'; }}>
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </header>

      <div className="customer-main">
        <aside className={`customer-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
            >
              <i className="fas fa-chart-line"></i>
              <span>Dashboard</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'jobs' ? 'active' : ''}`}
              onClick={() => { setActiveTab('jobs'); setSidebarOpen(false); }}
            >
              <i className="fas fa-briefcase"></i>
              <span>My Jobs</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'available' ? 'active' : ''}`}
              onClick={() => { setActiveTab('available'); setSidebarOpen(false); }}
            >
              <i className="fas fa-search"></i>
              <span>Browse Jobs</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'wallet' ? 'active' : ''}`}
              onClick={() => { setActiveTab('wallet'); setSidebarOpen(false); }}
            >
              <i className="fas fa-wallet"></i>
              <span>Wallet</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => { setActiveTab('profile'); setSidebarOpen(false); }}
            >
              <i className="fas fa-user"></i>
              <span>Profile</span>
            </button>
          </nav>
        </aside>

        <main className="customer-content">
          {loading && <div className="loading-spinner"><i className="fas fa-spinner"></i></div>}
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'jobs' && renderJobs()}
          {activeTab === 'available' && renderAvailableJobs()}
          {activeTab === 'wallet' && renderWallet()}
          {activeTab === 'profile' && renderProfile()}
        </main>
      </div>
    </div>
  );
}
