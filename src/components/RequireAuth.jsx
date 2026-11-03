import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function RequireAuth() {
  const { status, error, refreshUser } = useAuth();
  const location = useLocation();
  if (status === 'loading') return <p role="status">Đang kiểm tra phiên đăng nhập...</p>;
  if (status === 'error') return (
    <div className="feedback error" role="alert">
      <p>{error}</p>
      <button className="button secondary" onClick={refreshUser}>Thử lại kết nối</button>
    </div>
  );
  if (status !== 'authenticated') return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
  return <Outlet />;
}
