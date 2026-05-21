import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ element, children, requiredRole }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (requiredRole && requiredRole !== 'any' && user?.role !== requiredRole) {
    if (user?.role === 'admin') return <Navigate to="/admin" replace />;
    if (user?.role === 'worker') return <Navigate to="/worker/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return element ?? children;
}
