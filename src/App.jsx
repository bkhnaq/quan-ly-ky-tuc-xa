import { Routes, Route, Link } from 'react-router';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Students from './pages/Students';
import Invoices from './pages/Invoices';
import Notifications from './pages/Notifications';
import About from './pages/About';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="students" element={<Students />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="about-us" element={<About />} />
        <Route path="*" element={
          <div className="not-found">
            <span>404</span>
            <h1>Không tìm thấy trang</h1>
            <p>Đường dẫn không tồn tại.</p>
            <Link to="/" className="button">Về trang chủ</Link>
          </div>
        } />
      </Route>
    </Routes>
  );
}
