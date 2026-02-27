import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';

import { api } from '../services/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await api.register({ name, email, password });
      setUser(data.user, data.token);
      navigate('/profile');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-[80vh] flex items-center justify-center bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-zinc-100">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-zinc-900 tracking-tight">
            Tham gia Apex Sneakers
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-600">
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-bold text-zinc-900 hover:text-zinc-700 underline underline-offset-4">
              Đăng nhập
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">Họ và tên</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none relative block w-full px-4 py-4 border border-zinc-300 placeholder-zinc-500 text-zinc-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 focus:z-10 sm:text-sm transition-shadow"
                placeholder="Họ và tên"
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">Địa chỉ Email</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-4 py-4 border border-zinc-300 placeholder-zinc-500 text-zinc-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 focus:z-10 sm:text-sm transition-shadow"
                placeholder="Địa chỉ Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Mật khẩu</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-4 py-4 border border-zinc-300 placeholder-zinc-500 text-zinc-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 focus:z-10 sm:text-sm transition-shadow"
                placeholder="Mật khẩu"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-base font-bold rounded-full text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 disabled:opacity-50 shadow-lg transform hover:-translate-y-1 transition-all"
            >
              {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
