import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useStore();
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 3000000 ? 0 : 30000;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 px-4">
        <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-4">Giỏ hàng của bạn đang trống</h2>
        <p className="text-zinc-500 mb-8 text-center max-w-md">Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá các bộ sưu tập mới nhất của chúng tôi.</p>
        <Link
          to="/products"
          className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors shadow-lg"
        >
          Bắt đầu mua sắm
          <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
    >
      <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl mb-12">Giỏ hàng</h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        <div className="lg:col-span-7">
          <ul role="list" className="border-t border-b border-zinc-200 divide-y divide-zinc-200">
            {cart.map((item) => (
              <li key={`${item.productId}-${item.size}`} className="flex py-6 sm:py-10">
                <div className="flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 rounded-2xl object-cover object-center sm:w-32 sm:h-32 bg-zinc-100"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                  <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-lg font-bold text-zinc-900">
                          <Link to={`/products/${item.productId}`} className="hover:text-zinc-600">
                            {item.name}
                          </Link>
                        </h3>
                      </div>
                      <p className="mt-1 text-sm font-medium text-zinc-500">Kích cỡ: {item.size}</p>
                      <p className="mt-1 text-lg font-bold text-zinc-900">{item.price.toLocaleString('vi-VN')}₫</p>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:pr-9 flex items-center">
                      <div className="flex items-center border border-zinc-300 rounded-full">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                          className="p-2 text-zinc-500 hover:text-zinc-900 focus:outline-none"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 font-bold text-zinc-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                          className="p-2 text-zinc-500 hover:text-zinc-900 focus:outline-none"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="absolute top-0 right-0">
                        <button
                          onClick={() => removeFromCart(item.productId, item.size)}
                          className="-m-2 p-2 inline-flex text-zinc-400 hover:text-red-500 transition-colors"
                        >
                          <span className="sr-only">Remove</span>
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Order summary */}
        <section className="mt-16 bg-zinc-50 rounded-3xl px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5 border border-zinc-200 shadow-sm">
          <h2 className="text-xl font-bold text-zinc-900 mb-6">Tóm tắt đơn hàng</h2>

          <dl className="space-y-4 text-sm text-zinc-600">
            <div className="flex items-center justify-between">
              <dt>Tạm tính</dt>
              <dd className="font-medium text-zinc-900">{subtotal.toLocaleString('vi-VN')}₫</dd>
            </div>
            <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
              <dt className="flex items-center">
                <span>Phí vận chuyển</span>
              </dt>
              <dd className="font-medium text-zinc-900">{shipping === 0 ? 'Miễn phí' : `${shipping.toLocaleString('vi-VN')}₫`}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
              <dt className="text-base font-bold text-zinc-900">Tổng cộng</dt>
              <dd className="text-2xl font-extrabold text-zinc-900">{total.toLocaleString('vi-VN')}₫</dd>
            </div>
          </dl>

          <div className="mt-8">
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-zinc-900 border border-transparent rounded-full shadow-lg py-4 px-4 text-base font-bold text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 transition-all transform hover:-translate-y-1"
            >
              Tiến hành thanh toán
            </button>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
