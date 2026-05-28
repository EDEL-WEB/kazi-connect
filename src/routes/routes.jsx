import React from 'react';
import { Navigate } from 'react-router-dom';

// Public Pages
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import VerifyOTP from '../pages/public/VerifyOTP';
import VerifyLoginOTP from '../pages/public/VerifyLoginOTP';
import Landing from '../Index';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';
import PublicWorkerProfile from '../pages/public/PublicWorkerProfile';
import Categories from '../pages/public/Categories';
import NotFound from '../pages/public/NotFound';
import Unauthorized from '../pages/public/Unauthorized';

// Customer Pages
import CustomerDashboard from '../pages/customer/CustomerDashboardModern';
import BookService from '../pages/customer/BookService';
import BookWithEscrow from '../pages/customer/BookWithEscrow';
import CustomerJobs from '../pages/customer/CustomerJobs';
import JobDetails from '../pages/customer/JobDetails';
import ApproveWorkerRate from '../pages/customer/ApproveWorkerRate';
import TrackWorker from '../pages/customer/TrackWorker';
import DisputeJob from '../pages/customer/DisputeJob';
import CancelJob from '../pages/customer/CancelJob';
import CustomerWallet from '../pages/customer/CustomerWallet';
import Transactions from '../pages/customer/Transactions';
import ReleasePayment from '../pages/customer/ReleasePayment';
import RefundPayment from '../pages/customer/RefundPayment';
import EscrowStatus from '../pages/customer/EscrowStatus';
import ReviewWorker from '../pages/customer/ReviewWorker';
import CustomerReviews from '../pages/customer/CustomerReviews';
import CustomerNotifications from '../pages/customer/CustomerNotifications';
import CustomerProfile from '../pages/customer/CustomerProfile';
import CustomerSettings from '../pages/customer/CustomerSettings';

// Worker Pages
import WorkerDashboard from '../pages/worker/WorkerDashboard';
import AvailableJobs from '../pages/worker/AvailableJobs';
import AcceptJob from '../pages/worker/AcceptJob';
import WorkerJobs from '../pages/worker/WorkerJobs';
import WorkerJobDetails from '../pages/worker/WorkerJobDetails';
import UpdateJobStatus from '../pages/worker/UpdateJobStatus';
import UpdateProgress from '../pages/worker/UpdateProgress';
import AddJobNotes from '../pages/worker/AddJobNotes';
import UploadPhotos from '../pages/worker/UploadPhotos';
import WorkerTracking from '../pages/worker/WorkerTracking';
import CompletedJobs from '../pages/worker/CompletedJobs';
import VerificationStart from '../pages/worker/VerificationStart';
import UploadID from '../pages/worker/UploadID';
import VerifyPhone from '../pages/worker/VerifyPhone';
import UploadSelfie from '../pages/worker/UploadSelfie';
import UploadSkills from '../pages/worker/UploadSkills';
import VerificationStatus from '../pages/worker/VerificationStatus';
import WorkerWallet from '../pages/worker/WorkerWallet';
import WorkerTransactions from '../pages/worker/WorkerTransactions';
import EarningsDashboard from '../pages/worker/EarningsDashboard';
import WorkerProfile from '../pages/worker/WorkerProfile';
import EditWorkerProfile from '../pages/worker/EditWorkerProfile';

import WorkerSetup from '../pages/worker/WorkerSetup';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import UsersManagement from '../pages/admin/UsersManagement';
import UserDetails from '../pages/admin/UserDetails';
import PendingVerifications from '../pages/admin/PendingVerifications';
import VerificationReview from '../pages/admin/VerificationReview';
import ManageCategories from '../pages/admin/ManageCategories';
import CreateCategory from '../pages/admin/CreateCategory';
import AllJobs from '../pages/admin/AllJobs';
import FlaggedWorkers from '../pages/admin/FlaggedWorkers';
import JobMonitoring from '../pages/admin/JobMonitoring';
import Disputes from '../pages/admin/Disputes';
import ResolveDispute from '../pages/admin/ResolveDispute';
import SMSCenter from '../pages/admin/SMSCenter';
import SendSMS from '../pages/admin/SendSMS';
import NotificationsMonitor from '../pages/admin/NotificationsMonitor';
import AfricasTalkingBalance from '../pages/admin/AfricasTalkingBalance';
import Reports from '../pages/admin/Reports';
import CommissionAnalytics from '../pages/admin/CommissionAnalytics';

// Sync Pages
import OfflineQueue from '../pages/sync/OfflineQueue';
import SyncStatus from '../pages/sync/SyncStatus';

// Optional Pages
import FAQ from '../pages/public/FAQ';
import Terms from '../pages/public/Terms';
import Privacy from '../pages/public/Privacy';

export const routes = [
  // ===== PUBLIC ROUTES (No Auth Required) =====
  { path: '/', element: <Landing />, label: 'Landing', public: true },
  { path: '/login', element: <Login />, label: 'Login', public: true },
  { path: '/register', element: <Register />, label: 'Register', public: true },
  { path: '/verify-otp', element: <VerifyOTP />, label: 'Verify OTP', public: true },
  { path: '/verify-login-otp', element: <VerifyLoginOTP />, label: 'Verify Login OTP', public: true },
  { path: '/about', element: <About />, label: 'About', public: true },
  { path: '/contact', element: <Contact />, label: 'Contact', public: true },
  { path: '/workers/:id', element: <PublicWorkerProfile />, label: 'Worker Profile', public: true },
  { path: '/categories', element: <Categories />, label: 'Categories', public: true },
  { path: '/faq', element: <FAQ />, label: 'FAQ', public: true },
  { path: '/terms', element: <Terms />, label: 'Terms', public: true },
  { path: '/privacy', element: <Privacy />, label: 'Privacy', public: true },
  { path: '/403', element: <Unauthorized />, label: 'Unauthorized', public: true },
  { path: '*', element: <NotFound />, label: 'Not Found', public: true },

  // ===== CUSTOMER ROUTES (Auth: customer) =====
  { path: '/dashboard', element: <CustomerDashboard />, label: 'Dashboard', role: 'customer' },
  { path: '/jobs/create', element: <BookService />, label: 'Book a Service', role: 'customer' },
  { path: '/escrow/create', element: <BookWithEscrow />, label: 'Book with Escrow', role: 'customer' },
  { path: '/jobs', element: <CustomerJobs />, label: 'My Requests', role: 'customer' },
  { path: '/jobs/:id', element: <JobDetails />, label: 'Request Details', role: 'customer' },
  { path: '/jobs/:id/approve-rate', element: <ApproveWorkerRate />, label: 'Approve Payment', role: 'customer' },
  { path: '/tracking/:jobId', element: <TrackWorker />, label: 'Track Service', role: 'customer' },
  { path: '/jobs/:id/dispute', element: <DisputeJob />, label: 'Dispute Job', role: 'customer' },
  { path: '/jobs/:id/cancel', element: <CancelJob />, label: 'Cancel Job', role: 'customer' },
  { path: '/wallet', element: <CustomerWallet />, label: 'Wallet', role: 'customer' },
  { path: '/transactions', element: <Transactions />, label: 'Transactions', role: 'customer' },
  { path: '/payments/release/:jobId', element: <ReleasePayment />, label: 'Release Funds', role: 'customer' },
  { path: '/payments/refund/:jobId', element: <RefundPayment />, label: 'Refund', role: 'customer' },
  { path: '/escrow/:jobId/status', element: <EscrowStatus />, label: 'Escrow Status', role: 'customer' },
  { path: '/reviews/create', element: <ReviewWorker />, label: 'Review Worker', role: 'customer' },
  { path: '/reviews', element: <CustomerReviews />, label: 'My Reviews', role: 'customer' },
  { path: '/notifications', element: <CustomerNotifications />, label: 'Notifications', role: 'customer' },
  { path: '/profile', element: <CustomerProfile />, label: 'Profile', role: 'customer' },
  { path: '/settings', element: <CustomerSettings />, label: 'Settings', role: 'customer' },

  // ===== WORKER ROUTES (Auth: worker) =====
  { path: '/worker/setup', element: <WorkerSetup />, label: 'Worker Setup', role: 'worker' },
  { path: '/worker/dashboard', element: <WorkerDashboard />, label: 'Dashboard', role: 'worker' },
  { path: '/worker/jobs/available', element: <AvailableJobs />, label: 'Available Jobs', role: 'worker' },
  { path: '/worker/jobs/:id/accept', element: <AcceptJob />, label: 'Accept Job', role: 'worker' },
  { path: '/worker/jobs', element: <WorkerJobs />, label: 'My Jobs', role: 'worker' },
  { path: '/worker/jobs/:id', element: <WorkerJobDetails />, label: 'Job Details', role: 'worker' },
  { path: '/worker/jobs/:id/status', element: <UpdateJobStatus />, label: 'Update Status', role: 'worker' },
  { path: '/worker/jobs/:id/progress', element: <UpdateProgress />, label: 'Update Progress', role: 'worker' },
  { path: '/worker/jobs/:id/notes', element: <AddJobNotes />, label: 'Add Notes', role: 'worker' },
  { path: '/worker/jobs/:id/photos', element: <UploadPhotos />, label: 'Upload Photos', role: 'worker' },
  { path: '/worker/tracking/:jobId', element: <WorkerTracking />, label: 'Tracking', role: 'worker' },
  { path: '/worker/jobs/completed', element: <CompletedJobs />, label: 'Completed Jobs', role: 'worker' },
  { path: '/verification', element: <VerificationStart />, label: 'Start Verification', role: 'worker' },
  { path: '/verification/upload-id', element: <UploadID />, label: 'Upload ID', role: 'worker' },
  { path: '/verification/verify-phone', element: <VerifyPhone />, label: 'Verify Phone', role: 'worker' },
  { path: '/verification/upload-selfie', element: <UploadSelfie />, label: 'Upload Selfie', role: 'worker' },
  { path: '/verification/upload-skills', element: <UploadSkills />, label: 'Upload Skills', role: 'worker' },
  { path: '/verification/status', element: <VerificationStatus />, label: 'Verification Status', role: 'worker' },
  { path: '/worker/wallet', element: <WorkerWallet />, label: 'Wallet', role: 'worker' },
  { path: '/worker/transactions', element: <WorkerTransactions />, label: 'Transactions', role: 'worker' },
  { path: '/worker/earnings', element: <EarningsDashboard />, label: 'Earnings', role: 'worker' },
  { path: '/worker/profile', element: <WorkerProfile />, label: 'Profile', role: 'worker' },
  { path: '/worker/profile/edit', element: <EditWorkerProfile />, label: 'Edit Profile', role: 'worker' },

  // ===== ADMIN ROUTES (Auth: admin) =====
  { path: '/admin', element: <AdminDashboard />, label: 'Admin Dashboard', role: 'admin' },
  { path: '/admin/users', element: <UsersManagement />, label: 'Users', role: 'admin' },
  { path: '/admin/users/:id', element: <UserDetails />, label: 'User Details', role: 'admin' },
  { path: '/admin/verifications', element: <PendingVerifications />, label: 'Verifications', role: 'admin' },
  { path: '/admin/verifications/:id', element: <VerificationReview />, label: 'Review Verification', role: 'admin' },
  { path: '/admin/categories', element: <ManageCategories />, label: 'Categories', role: 'admin' },
  { path: '/admin/categories/new', element: <CreateCategory />, label: 'Create Category', role: 'admin' },
  { path: '/admin/jobs', element: <AllJobs />, label: 'Jobs', role: 'admin' },
  { path: '/admin/flagged-workers', element: <FlaggedWorkers />, label: 'Flagged Workers', role: 'admin' },
  { path: '/admin/jobs/:id', element: <JobMonitoring />, label: 'Monitor Job', role: 'admin' },
  { path: '/admin/disputes', element: <Disputes />, label: 'Disputes', role: 'admin' },
  { path: '/admin/disputes/:jobId', element: <ResolveDispute />, label: 'Resolve Dispute', role: 'admin' },
  { path: '/admin/sms', element: <SMSCenter />, label: 'SMS Center', role: 'admin' },
  { path: '/admin/sms/send', element: <SendSMS />, label: 'Send SMS', role: 'admin' },
  { path: '/admin/notifications', element: <NotificationsMonitor />, label: 'Notifications', role: 'admin' },
  { path: '/admin/africastalking', element: <AfricasTalkingBalance />, label: 'Africa\'s Talking', role: 'admin' },
  { path: '/admin/reports', element: <Reports />, label: 'Reports', role: 'admin' },
  { path: '/admin/commission', element: <CommissionAnalytics />, label: 'Commission Analytics', role: 'admin' },

  // ===== SYNC ROUTES (Auth: any) =====
  { path: '/sync', element: <OfflineQueue />, label: 'Offline Queue', role: 'any' },
  { path: '/sync/status', element: <SyncStatus />, label: 'Sync Status', role: 'any' },
];

// Helper function to get routes by role
export const getRoutesByRole = (role) => {
  return routes.filter(route => !route.role || route.role === role || route.role === 'any');
};

// Helper function to get public routes
export const getPublicRoutes = () => {
  return routes.filter(route => route.public);
};

// Helper function to check if route is protected
export const isProtectedRoute = (path) => {
  const route = routes.find(r => r.path === path);
  return route && !route.public;
};
