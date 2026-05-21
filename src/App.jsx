import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { routes } from './routes/routes';
import AdminLayout from './admin/scenes/dashboard/Adindex';

const adminRoutes = routes.filter(r => r.role === 'admin');
const otherRoutes = routes.filter(r => r.role !== 'admin');

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {otherRoutes.map((route) =>
          route.public ? (
            <Route key={route.path} path={route.path} element={route.element} />
          ) : (
            <Route
              key={route.path}
              path={route.path}
              element={
                <ProtectedRoute element={route.element} requiredRole={route.role === 'any' ? 'any' : route.role} />
              }
            />
          )
        )}
        <Route element={<ProtectedRoute element={<AdminLayout />} requiredRole="admin" />}>
          {adminRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
