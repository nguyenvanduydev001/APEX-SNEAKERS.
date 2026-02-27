import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Package, User as UserIcon, LogOut } from 'lucide-react';
import { useStore } from '../store/useStore';

import { api } from '../services/api';

export default function Profile() {
  const { user, token, logout } = useStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    api.getOrders(user?.id || '')
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setOrders([]);
        setLoading(false);
      });
  }, [token, navigate, user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
    >
      <div className="md:flex md:items-center md:justify-between mb-12">
        <div className="flex-1 min-w-0">
          <h2 className="text-4xl font-extrabold text-zinc-900 sm:text-5xl sm:truncate">Tài khoản của tôi</h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-6 py-3 border border-zinc-300 rounded-full shadow-sm text-sm font-bold text-zinc-700 bg-white hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="bg-white shadow-sm rounded-3xl p-8 border border-zinc-200">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-zinc-100 flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-zinc-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900">{user.name}</h3>
                <p className="text-sm text-zinc-500">{user.email}</p>
              </div>
            </div>
            <div className="border-t border-zinc-200 pt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-zinc-500">Loại tài khoản</span>
                <span className="text-sm font-bold text-zinc-900 capitalize">{user.role}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-zinc-500">Thành viên từ</span>
                <span className="text-sm font-bold text-zinc-900">2024</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm rounded-3xl p-8 border border-zinc-200">
            <h3 className="text-2xl font-bold text-zinc-900 mb-8 flex items-center">
              <Package className="w-6 h-6 mr-3 text-zinc-400" />
              Lịch sử đơn hàng
            </h3>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zinc-900"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
                <h3 className="text-lg font-medium text-zinc-900">Chưa có đơn hàng nào</h3>
                <p className="mt-1 text-sm text-zinc-500">Khi bạn đặt hàng, nó sẽ xuất hiện ở đây.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order: any) => (
                  <div key={order.id} className="border border-zinc-200 rounded-2xl p-6 hover:border-zinc-300 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium text-zinc-500">Đơn hàng #{order.id}</p>
                        <p className="text-sm font-bold text-zinc-900">{new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-zinc-900">{order.total.toLocaleString('vi-VN')}₫</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                          order.status === 'chờ xử lý' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'đã giao hàng' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
