import { useState, useEffect } from 'react';
import api from '../lib/api';
import Cookies from 'js-cookie';

interface User {
  walletAddress: string;
  username: string;
  stats: { currentPoints: number };
  createdAt: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const login = async (walletAddress: string, username?: string) => {
    const res = await api.post<{ user: User; token: string }>('/users/login', { walletAddress, username });
    const { user, token } = res.data;
    Cookies.set('token', token, { expires: 7 }); // 7 days
    setUser(user);
    return user;
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
  };

  const fetchUser = async () => {
    try {
      const res = await api.get<User>('/users/me');
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading, login, logout, fetchUser };
};
