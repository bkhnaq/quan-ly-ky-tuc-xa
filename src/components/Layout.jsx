import { NavLink, Outlet } from 'react-router';

// NavLink tự thêm trạng thái active cho menu của trang đang mở.
export default function Layout() {
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
        </div>
      </nav>

      <main className="container main-content">
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
