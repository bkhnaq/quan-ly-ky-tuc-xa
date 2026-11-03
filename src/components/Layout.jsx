import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { getApiError } from '../services/api';

// NavLink tự thêm trạng thái active cho menu của trang đang mở.
export default function Layout() {
  const { user, status, logout, storageWarning } = useAuth();
  const [logoutError, setLogoutError] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    setLoggingOut(true);
    setLogoutError('');
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      setLogoutError(getApiError(error));
    } finally {
      setLoggingOut(false);
    }
  }
  return (
    <>
      <header className="header">
        <div className="container header-content">
          <NavLink to="/" className="logo">KTX Campus</NavLink>
          <span>Hệ thống quản lý ký túc xá</span>
        </div>
      </header>

      <nav className="navbar" aria-label="Menu chính">
        <div className="container nav-links">
          <NavLink to="/" end>Trang chủ</NavLink>
          <NavLink to="/rooms">Phòng ở</NavLink>
          <NavLink to="/students">Sinh viên</NavLink>
          <NavLink to="/invoices">Hóa đơn</NavLink>
          <NavLink to="/notifications">Thông báo</NavLink>
          <NavLink to="/about-us">Giới thiệu</NavLink>
          <div className="auth-nav">
            {status === 'authenticated' ? <>
              <NavLink to="/account" className="user-email">{user.email}</NavLink>
              <button className="button secondary" disabled={loggingOut} onClick={handleLogout}>{loggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}</button>
            </> : status !== 'loading' && <>
              <NavLink to="/login">Đăng nhập</NavLink>
              <NavLink to="/register">Đăng ký</NavLink>
            </>}
          </div>
        </div>
      </nav>

      <main className="container main-content">
        {logoutError && <p className="feedback error" role="alert">{logoutError}</p>}
        {storageWarning && <p className="feedback" role="status">{storageWarning}</p>}
        {/* Outlet hiển thị nội dung trang tương ứng với URL. */}
        <Outlet />
      </main>

      <footer className="footer">
        <p>© 2026 KTX Campus — Đồ án quản lý ký túc xá</p>
        <p>ReactJS · Vite · React Router</p>
      </footer>
    </>
  );
}
