import { useAuth } from '../context/AuthContext';

export default function Account() {
  const { user } = useAuth();
  return (
    <section className="card account-card">
      <h1>Tài khoản của tôi</h1>
      <p>Bạn đã đăng nhập thành công vào KTX Campus.</p>
      <dl>
        <dt>Email</dt><dd>{user.email}</dd>
        <dt>Mã tài khoản</dt><dd>{user.id}</dd>
        <dt>Ngày đăng ký</dt><dd>{new Date(user.createdAt).toLocaleString('vi-VN')}</dd>
      </dl>
    </section>
  );
}
