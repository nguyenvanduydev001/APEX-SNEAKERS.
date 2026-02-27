import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Filter, ChevronDown } from 'lucide-react';

import { api } from '../services/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProducts()
      .then((data: any) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load products', err);
        setLoading(false);
      });
  }, []);

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
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">Tất cả giày</h1>
          <p className="mt-4 text-lg text-zinc-500">Khám phá đôi giày hoàn hảo của bạn.</p>
        </div>
        
        <div className="mt-6 md:mt-0 flex items-center space-x-4">
          <button className="flex items-center px-4 py-2 border border-zinc-300 rounded-full text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Lọc
          </button>
          <button className="flex items-center px-4 py-2 border border-zinc-300 rounded-full text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors">
            Sắp xếp: Nổi bật
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
        {products.map((product: any) => (
          <Link key={product.id} to={`/products/${product.id}`} className="group block">
            <div className="relative w-full aspect-square bg-zinc-100 rounded-3xl overflow-hidden mb-6">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
                referrerPolicy="no-referrer"
              />
              {product.stock < 10 && product.stock > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                  Sắp hết
                </div>
              )}
              {product.stock === 0 && (
                <div className="absolute top-4 left-4 bg-zinc-900 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                  Hết hàng
                </div>
              )}
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 group-hover:text-zinc-600 transition-colors">{product.name}</h3>
                <p className="mt-1 text-sm text-zinc-500 line-clamp-1">{product.description}</p>
              </div>
              <p className="text-lg font-bold text-zinc-900">{product.price.toLocaleString('vi-VN')}₫</p>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
