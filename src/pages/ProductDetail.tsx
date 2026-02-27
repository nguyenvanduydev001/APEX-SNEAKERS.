import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBag, Check, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';

import { api } from '../services/api';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [error, setError] = useState('');
  const addToCart = useStore((state) => state.addToCart);

  useEffect(() => {
    if (!id) return;
    api.getProduct(id)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        navigate('/products');
      });
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError('Vui lòng chọn kích cỡ');
      return;
    }
    
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      size: selectedSize,
    });
    
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-900"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24"
    >
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-16 xl:gap-x-24">
        {/* Product Image */}
        <div className="flex flex-col-reverse lg:flex-row gap-6">
          <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible w-full lg:w-24 shrink-0">
            {[1, 2, 3, 4].map((i) => (
              <button key={i} className="relative h-24 w-24 rounded-xl overflow-hidden bg-zinc-100 border-2 border-transparent hover:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2">
                <img src={product.image} alt="" className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
          <div className="relative w-full aspect-square lg:aspect-auto lg:h-[600px] bg-zinc-100 rounded-3xl overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-10 px-4 sm:px-0 lg:mt-0">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">{product.name}</h1>
          <div className="mt-4">
            <h2 className="sr-only">Thông tin sản phẩm</h2>
            <p className="text-3xl tracking-tight text-zinc-900 font-bold">{product.price.toLocaleString('vi-VN')}₫</p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Mô tả</h3>
            <div className="text-base text-zinc-600 space-y-6 leading-relaxed">
              <p>{product.description}</p>
            </div>
          </div>

          <div className="mt-10">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-900 uppercase tracking-wider">Kích cỡ</h3>
              <a href="#" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 underline underline-offset-4">Hướng dẫn chọn size</a>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-4">
              {product.sizes.map((size: string) => (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedSize(size);
                    setError('');
                  }}
                  className={`
                    flex items-center justify-center rounded-xl py-3 px-4 text-sm font-bold uppercase sm:flex-1
                    ${selectedSize === size
                      ? 'bg-zinc-900 text-white ring-2 ring-zinc-900 ring-offset-2'
                      : 'bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50'
                    }
                  `}
                >
                  {size}
                </button>
              ))}
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" /> {error}
              </p>
            )}
          </div>

          <div className="mt-10 flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-zinc-900 border border-transparent rounded-full py-4 px-8 flex items-center justify-center text-base font-bold text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
            </button>
          </div>

          <div className="mt-8 border-t border-zinc-200 pt-8">
            <div className="flex items-center text-sm text-zinc-500 mb-4">
              <Check className="w-5 h-5 text-green-500 mr-2" />
              Miễn phí vận chuyển cho đơn hàng trên 3.000.000₫
            </div>
            <div className="flex items-center text-sm text-zinc-500">
              <Check className="w-5 h-5 text-green-500 mr-2" />
              Chính sách đổi trả 30 ngày
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
