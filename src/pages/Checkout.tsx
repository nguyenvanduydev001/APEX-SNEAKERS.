import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, CreditCard, Truck } from 'lucide-react';
import { useStore } from '../store/useStore';

import { api } from '../services/api';

export default function Checkout() {
  const { cart, token, clearCart } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 3000000 ? 0 : 30000;
  const total = subtotal + shipping;

  if (cart.length === 0 && step !== 3) {
    navigate('/cart');
    return null;
  }

  if (!token) {
    navigate('/login?redirect=/checkout');
    return null;
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = await api.createOrder({
        user_id: useStore.getState().user?.id,
        items: cart,
        total,
        shippingInfo,
        paymentMethod,
      });

      setOrderId(data.orderId);
      clearCart();
      setStep(3);
    } catch (error) {
      console.error(error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 3) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen flex items-center justify-center bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl text-center">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-zinc-900">Đặt hàng thành công!</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Cảm ơn bạn đã mua hàng. Đơn hàng #{orderId} của bạn đang được xử lý.
          </p>
          <div className="mt-8">
            <button
              onClick={() => navigate('/products')}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 transition-colors"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
    >
      <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl mb-12">Thanh toán</h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        <div className="lg:col-span-7">
          {/* Progress Steps */}
          <nav aria-label="Progress" className="mb-12">
            <ol role="list" className="flex items-center">
              <li className={`relative pr-8 sm:pr-20 ${step >= 1 ? 'text-zinc-900' : 'text-zinc-400'}`}>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className={`h-0.5 w-full ${step >= 2 ? 'bg-zinc-900' : 'bg-zinc-200'}`}></div>
                </div>
                <div className={`relative flex h-8 w-8 items-center justify-center rounded-full ${step >= 1 ? 'bg-zinc-900 text-white' : 'bg-white border-2 border-zinc-300'} font-bold text-sm`}>
                  1
                </div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium uppercase tracking-wider">Giao hàng</span>
              </li>
              <li className={`relative pr-8 sm:pr-20 ${step >= 2 ? 'text-zinc-900' : 'text-zinc-400'}`}>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className={`h-0.5 w-full ${step >= 3 ? 'bg-zinc-900' : 'bg-zinc-200'}`}></div>
                </div>
                <div className={`relative flex h-8 w-8 items-center justify-center rounded-full ${step >= 2 ? 'bg-zinc-900 text-white' : 'bg-white border-2 border-zinc-300'} font-bold text-sm`}>
                  2
                </div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium uppercase tracking-wider">Thanh toán</span>
              </li>
              <li className={`relative ${step >= 3 ? 'text-zinc-900' : 'text-zinc-400'}`}>
                <div className={`relative flex h-8 w-8 items-center justify-center rounded-full ${step >= 3 ? 'bg-zinc-900 text-white' : 'bg-white border-2 border-zinc-300'} font-bold text-sm`}>
                  3
                </div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium uppercase tracking-wider">Đánh giá</span>
              </li>
            </ol>
          </nav>

          {step === 1 && (
            <form onSubmit={handleShippingSubmit} className="bg-white shadow-sm rounded-3xl p-8 border border-zinc-200">
              <h2 className="text-2xl font-bold text-zinc-900 mb-8 flex items-center">
                <Truck className="w-6 h-6 mr-3 text-zinc-400" />
                Thông tin giao hàng
              </h2>
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-zinc-700">Tên</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="first-name"
                      required
                      value={shippingInfo.firstName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                      className="block w-full rounded-xl border-zinc-300 shadow-sm focus:border-zinc-900 focus:ring-zinc-900 sm:text-sm py-3 px-4 border"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-zinc-700">Họ</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="last-name"
                      required
                      value={shippingInfo.lastName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                      className="block w-full rounded-xl border-zinc-300 shadow-sm focus:border-zinc-900 focus:ring-zinc-900 sm:text-sm py-3 px-4 border"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-zinc-700">Địa chỉ</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="address"
                      required
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      className="block w-full rounded-xl border-zinc-300 shadow-sm focus:border-zinc-900 focus:ring-zinc-900 sm:text-sm py-3 px-4 border"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-zinc-700">Thành phố</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="city"
                      required
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      className="block w-full rounded-xl border-zinc-300 shadow-sm focus:border-zinc-900 focus:ring-zinc-900 sm:text-sm py-3 px-4 border"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="postal-code" className="block text-sm font-medium text-zinc-700">Mã bưu điện</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="postal-code"
                      required
                      value={shippingInfo.postalCode}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                      className="block w-full rounded-xl border-zinc-300 shadow-sm focus:border-zinc-900 focus:ring-zinc-900 sm:text-sm py-3 px-4 border"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-10 flex justify-end">
                <button
                  type="submit"
                  className="bg-zinc-900 border border-transparent rounded-full shadow-lg py-4 px-8 text-base font-bold text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 transition-all transform hover:-translate-y-1"
                >
                  Tiếp tục thanh toán
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handlePaymentSubmit} className="bg-white shadow-sm rounded-3xl p-8 border border-zinc-200">
              <h2 className="text-2xl font-bold text-zinc-900 mb-8 flex items-center">
                <CreditCard className="w-6 h-6 mr-3 text-zinc-400" />
                Phương thức thanh toán
              </h2>
              <div className="space-y-6">
                <div className="flex items-center p-4 border rounded-2xl border-zinc-200 hover:border-zinc-900 transition-colors cursor-pointer" onClick={() => setPaymentMethod('credit_card')}>
                  <input
                    id="credit_card"
                    name="payment_method"
                    type="radio"
                    checked={paymentMethod === 'credit_card'}
                    onChange={() => setPaymentMethod('credit_card')}
                    className="h-5 w-5 text-zinc-900 focus:ring-zinc-900 border-zinc-300"
                  />
                  <label htmlFor="credit_card" className="ml-4 block text-sm font-bold text-zinc-900 cursor-pointer">
                    Thẻ tín dụng (Thử nghiệm)
                  </label>
                </div>
                <div className="flex items-center p-4 border rounded-2xl border-zinc-200 hover:border-zinc-900 transition-colors cursor-pointer" onClick={() => setPaymentMethod('cod')}>
                  <input
                    id="cod"
                    name="payment_method"
                    type="radio"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="h-5 w-5 text-zinc-900 focus:ring-zinc-900 border-zinc-300"
                  />
                  <label htmlFor="cod" className="ml-4 block text-sm font-bold text-zinc-900 cursor-pointer">
                    Thanh toán khi nhận hàng (COD)
                  </label>
                </div>
              </div>
              
              {paymentMethod === 'credit_card' && (
                <div className="mt-8 grid grid-cols-4 gap-y-6 gap-x-4">
                  <div className="col-span-4">
                    <label htmlFor="card-number" className="block text-sm font-medium text-zinc-700">Số thẻ</label>
                    <div className="mt-1">
                      <input type="text" id="card-number" placeholder="0000 0000 0000 0000" className="block w-full rounded-xl border-zinc-300 shadow-sm focus:border-zinc-900 focus:ring-zinc-900 sm:text-sm py-3 px-4 border" />
                    </div>
                  </div>
                  <div className="col-span-4 sm:col-span-3">
                    <label htmlFor="expiration-date" className="block text-sm font-medium text-zinc-700">Ngày hết hạn (MM/YY)</label>
                    <div className="mt-1">
                      <input type="text" id="expiration-date" placeholder="MM/YY" className="block w-full rounded-xl border-zinc-300 shadow-sm focus:border-zinc-900 focus:ring-zinc-900 sm:text-sm py-3 px-4 border" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="cvc" className="block text-sm font-medium text-zinc-700">CVC</label>
                    <div className="mt-1">
                      <input type="text" id="cvc" placeholder="123" className="block w-full rounded-xl border-zinc-300 shadow-sm focus:border-zinc-900 focus:ring-zinc-900 sm:text-sm py-3 px-4 border" />
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-10 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-white border border-zinc-300 rounded-full py-4 px-8 text-base font-bold text-zinc-700 hover:bg-zinc-50 focus:outline-none transition-colors"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-zinc-900 border border-transparent rounded-full shadow-lg py-4 px-8 text-base font-bold text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 disabled:opacity-50 transition-all transform hover:-translate-y-1"
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Order summary */}
        <div className="mt-16 lg:mt-0 lg:col-span-5">
          <section className="bg-zinc-50 rounded-3xl px-4 py-6 sm:p-6 lg:p-8 border border-zinc-200 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-zinc-900 mb-6">Tóm tắt đơn hàng</h2>

            <ul role="list" className="divide-y divide-zinc-200 mb-6">
              {cart.map((item) => (
                <li key={`${item.productId}-${item.size}`} className="py-4 flex">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-zinc-100" referrerPolicy="no-referrer" />
                  <div className="ml-4 flex-1 flex flex-col justify-center">
                    <h3 className="text-sm font-bold text-zinc-900">{item.name}</h3>
                    <p className="text-sm text-zinc-500">Kích cỡ: {item.size} | SL: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-zinc-900 flex items-center">{(item.price * item.quantity).toLocaleString('vi-VN')}₫</p>
                </li>
              ))}
            </ul>

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
          </section>
        </div>
      </div>
    </motion.div>
  );
}
