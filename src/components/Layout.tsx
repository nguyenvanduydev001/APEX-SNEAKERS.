import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useState } from 'react';

export default function Layout() {
  const { user, cart, logout } = useStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 font-sans text-zinc-900">
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold tracking-tighter text-zinc-900">
                APEX SNEAKERS.
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-zinc-600 hover:text-zinc-900 font-medium">Trang chủ</Link>
              <Link to="/products" className="text-zinc-600 hover:text-zinc-900 font-medium">Cửa hàng</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-zinc-600 hover:text-zinc-900 font-medium">Quản trị</Link>
              )}
            </nav>

            <div className="hidden md:flex items-center space-x-6">
              <Link to="/cart" className="relative text-zinc-600 hover:text-zinc-900">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-zinc-900 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link to="/profile" className="text-zinc-600 hover:text-zinc-900">
                    <User className="w-6 h-6" />
                  </Link>
                  <button onClick={handleLogout} className="text-zinc-600 hover:text-zinc-900">
                    <LogOut className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-sm font-medium text-zinc-900 border border-zinc-200 px-4 py-2 rounded-full hover:bg-zinc-50 transition-colors">
                  Đăng nhập
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <Link to="/cart" className="relative text-zinc-600 mr-4">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-zinc-900 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-zinc-600 hover:text-zinc-900"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-zinc-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block px-3 py-2 text-base font-medium text-zinc-900 hover:bg-zinc-50 rounded-md" onClick={() => setIsMenuOpen(false)}>Trang chủ</Link>
              <Link to="/products" className="block px-3 py-2 text-base font-medium text-zinc-900 hover:bg-zinc-50 rounded-md" onClick={() => setIsMenuOpen(false)}>Cửa hàng</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="block px-3 py-2 text-base font-medium text-zinc-900 hover:bg-zinc-50 rounded-md" onClick={() => setIsMenuOpen(false)}>Quản trị</Link>
              )}
              {user ? (
                <>
                  <Link to="/profile" className="block px-3 py-2 text-base font-medium text-zinc-900 hover:bg-zinc-50 rounded-md" onClick={() => setIsMenuOpen(false)}>Hồ sơ</Link>
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-base font-medium text-zinc-900 hover:bg-zinc-50 rounded-md">Đăng xuất</button>
                </>
              ) : (
                <Link to="/login" className="block px-3 py-2 text-base font-medium text-zinc-900 hover:bg-zinc-50 rounded-md" onClick={() => setIsMenuOpen(false)}>Đăng nhập</Link>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-zinc-900 text-zinc-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <span className="text-2xl font-bold tracking-tighter text-white mb-4 block">APEX SNEAKERS.</span>
              <p className="text-zinc-400 max-w-sm">
                Giày thể thao cao cấp được thiết kế cho sự thoải mái, độ bền và phong cách. Bước vào tương lai cùng Apex Sneakers.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Cửa hàng</h3>
              <ul className="space-y-2">
                <li><Link to="/products" className="hover:text-white transition-colors">Tất cả sản phẩm</Link></li>
                <li><Link to="/products?category=new" className="hover:text-white transition-colors">Hàng mới về</Link></li>
                <li><Link to="/products?category=sale" className="hover:text-white transition-colors">Khuyến mãi</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Hỗ trợ</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Câu hỏi thường gặp</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Vận chuyển & Đổi trả</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Liên hệ</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-zinc-800 text-sm text-zinc-500 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} Apex Sneakers. Đã đăng ký bản quyền.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
              <a href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
