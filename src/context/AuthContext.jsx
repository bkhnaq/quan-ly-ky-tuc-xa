import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import api, { authApi, getApiError } from '../services/api';

const AuthContext = createContext(null);
const STORAGE_KEY = 'ktx-user';

function readCachedUser() {
  try {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return user && typeof user.id === 'string' && typeof user.email === 'string'
      ? { id: user.id, email: user.email, createdAt: user.createdAt } : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readCachedUser);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [storageWarning, setStorageWarning] = useState('');
  const requestVersion = useRef(0);

  const saveUser = useCallback((user) => {
    setUser(user);
    setStatus(user ? 'authenticated' : 'anonymous');
    setError('');
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      else localStorage.removeItem(STORAGE_KEY);
      setStorageWarning('');
    } catch {
      setStorageWarning('Trình duyệt không cho phép lưu thông tin user. Phiên đăng nhập vẫn được xác thực bằng cookie.');
    }
  }, []);

  // localStorage chỉ là cache: luôn hỏi API trước khi cho vào trang được bảo vệ.
  const refreshUser = useCallback(async () => {
    const version = ++requestVersion.current;
    setStatus('loading');
    setError('');
    try {
      const response = await authApi.me();
      if (version === requestVersion.current) saveUser(response.data);
    } catch (error) {
      if (version !== requestVersion.current) return;
      if (error.response?.status === 401) saveUser(null);
      else {
        setStatus('error');
        setError(getApiError(error));
      }
    }
  }, [saveUser]);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(response => response, error => {
      const path = error.config?.url;
      if (error.response?.status === 401 && !['/auth/login', '/auth/register', '/auth/me'].includes(path)) {
        ++requestVersion.current;
        saveUser(null);
      }
      return Promise.reject(error);
    });
    refreshUser();
    function syncOtherTab(event) {
      if (event.key === STORAGE_KEY || event.key === null) refreshUser();
    }
    window.addEventListener('storage', syncOtherTab);
    return () => {
      ++requestVersion.current;
      api.interceptors.response.eject(interceptor);
      window.removeEventListener('storage', syncOtherTab);
    };
  }, [refreshUser, saveUser]);

  async function login(credentials) {
    const response = await authApi.login(credentials);
    ++requestVersion.current;
    saveUser(response.data);
  }

  async function logout() {
    // Chỉ xóa state sau khi backend đã xóa cookie thành công.
    await authApi.logout();
    ++requestVersion.current;
    saveUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, status, error, storageWarning, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
