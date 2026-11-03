import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { authApi, getApiError } from '../services/api';

export default function Auth({ mode }) {
  const registering = mode === 'register';
  const { login, status } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const destination = location.state?.from;
  const returnTo = typeof destination === 'string' && destination.startsWith('/') && !destination.startsWith('//')
    && !['/login', '/register'].includes(destination.split('?')[0]) ? destination : '/';

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    const normalizedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || normalizedEmail.length > 254) {
      setError('Vui lòng nhập email hợp lệ.');
      return;
    }
    if (password.length < 8 || password.length > 128 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      setError('Mật khẩu phải có 8–128 ký tự, gồm ít nhất một chữ cái và một chữ số.');
      return;
    }
    if (registering && password !== confirmation) {
      setError('Mật khẩu nhập lại không khớp.');
      return;
    }
    setBusy(true);
    try {
      if (registering) {
        await authApi.register({ email: normalizedEmail, password });
        navigate('/login', { replace: true, state: { email: normalizedEmail, registered: true, from: returnTo } });
      } else {
        await login({ email: normalizedEmail, password });
        navigate(returnTo, { replace: true });
      }
    } catch (error) {
      setError(getApiError(error));
    } finally {
      setBusy(false);
    }
  }

  if (status === 'loading') return <p role="status">Đang kiểm tra phiên đăng nhập...</p>;
  if (status === 'authenticated') return <Navigate to={returnTo} replace />;

  return (
    <section className="card auth-card">
      <span className="eyebrow">KTX CAMPUS</span>
      <h1>{registering ? 'Đăng ký tài khoản' : 'Đăng nhập'}</h1>
      <p className="page-description">{registering ? 'Tạo tài khoản bằng email để sử dụng hệ thống.' : 'Đăng nhập để truy cập các trang quản lý ký túc xá.'}</p>
      {!registering && location.state?.registered && <p className="feedback success" role="status">Đăng ký thành công. Bạn có thể đăng nhập ngay.</p>}
      <form onSubmit={handleSubmit} noValidate>
        <fieldset disabled={busy}>
          <div className="form-grid auth-fields">
            <label>Email
              <input type="email" name="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} maxLength={254} required />
            </label>
            <label>Mật khẩu
              <input type="password" name="password" autoComplete={registering ? 'new-password' : 'current-password'} value={password} onChange={event => setPassword(event.target.value)} minLength={8} maxLength={128} aria-describedby="password-help" required />
            </label>
            <small id="password-help">8–128 ký tự, có ít nhất một chữ cái và một chữ số.</small>
            {registering && <label>Nhập lại mật khẩu
              <input type="password" name="confirmation" autoComplete="new-password" value={confirmation} onChange={event => setConfirmation(event.target.value)} maxLength={128} required />
            </label>}
          </div>
          {error && <p className="feedback error" role="alert">{error}</p>}
          <button className="button auth-submit" type="submit">{busy ? 'Đang xử lý...' : registering ? 'Đăng ký' : 'Đăng nhập'}</button>
        </fieldset>
      </form>
      <p className="auth-switch">{registering ? 'Đã có tài khoản? ' : 'Chưa có tài khoản? '}<Link to={registering ? '/login' : '/register'} state={{ from: returnTo }}>{registering ? 'Đăng nhập' : 'Đăng ký ngay'}</Link></p>
    </section>
  );
}
