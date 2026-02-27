import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Star } from 'lucide-react';

import { api } from '../services/api';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    api.getProducts()
      .then((data: any) => setFeaturedProducts(data.filter((p: any) => p.featured).slice(0, 4)))
      .catch((err) => console.error('Failed to load products', err));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen"
    >
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-zinc-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=1920"
            alt="Hero Sneaker"
            className="w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter mb-6"
          >
            BƯỚC VÀO TƯƠNG LAI
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-zinc-300 mb-10 font-light"
          >
            Sự thoải mái cao cấp kết hợp cùng phong cách không thỏa hiệp. Khám phá bộ sưu tập Apex Sneakers mới.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-zinc-900 bg-white rounded-full hover:bg-zinc-100 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Mua sắm ngay
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Sản phẩm nổi bật</h2>
              <p className="mt-4 text-lg text-zinc-500">Những sản phẩm mới nhất và tốt nhất từ Apex Sneakers.</p>
            </div>
            <Link to="/products" className="hidden md:flex items-center text-zinc-900 font-semibold hover:text-zinc-600 transition-colors">
              Xem tất cả <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product: any) => (
              <Link key={product.id} to={`/products/${product.id}`} className="group block">
                <div className="relative w-full h-80 bg-zinc-100 rounded-2xl overflow-hidden mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                    Mới
                  </div>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 group-hover:text-zinc-600 transition-colors">{product.name}</h3>
                <p className="mt-1 text-sm text-zinc-500 font-medium">{product.price.toLocaleString('vi-VN')}₫</p>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <Link to="/products" className="inline-flex items-center text-zinc-900 font-semibold hover:text-zinc-600 transition-colors">
              Xem tất cả <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl mb-6">Chế tác cho những chuyến đi</h2>
              <p className="text-lg text-zinc-600 mb-6 leading-relaxed">
                Tại Apex Sneakers, chúng tôi tin rằng mỗi bước đi đều quan trọng. Được thành lập vào năm 2024, sứ mệnh của chúng tôi là tạo ra những đôi giày không chỉ đẹp mà còn mang lại cảm giác tuyệt vời từ lần mang đầu tiên cho đến hàng ngàn dặm sau.
              </p>
              <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
                Sử dụng vật liệu bền vững và công nghệ đệm lót sáng tạo, chúng tôi đang định nghĩa lại một đôi giày thể thao hiện đại. Không thỏa hiệp. Chỉ có sự thoải mái thuần túy và thiết kế vượt thời gian.
              </p>
              <Link to="/about" className="inline-flex items-center text-zinc-900 font-bold border-b-2 border-zinc-900 pb-1 hover:text-zinc-600 hover:border-zinc-600 transition-colors">
                Đọc câu chuyện của chúng tôi
              </Link>
            </div>
            <div className="order-1 lg:order-2 relative h-96 lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://picsum.photos/seed/brandstory/800/1000"
                alt="Brand Story"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-center sm:text-4xl mb-16">Khách hàng nói gì</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Alex J.", text: "Đôi giày thoải mái nhất tôi từng sở hữu. Lớp đệm thật không thể tin được.", rating: 5 },
              { name: "Sarah M.", text: "Thiết kế đẹp mắt và chúng phù hợp với mọi thứ trong tủ đồ của tôi.", rating: 5 },
              { name: "David K.", text: "Đã đi bộ 10 dặm với đôi giày này vào ngày đầu tiên. Không hề bị phồng rộp. Rất đáng mua.", rating: 5 }
            ].map((testimonial, i) => (
              <div key={i} className="bg-zinc-800 p-8 rounded-2xl">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-lg text-zinc-300 mb-6 italic">"{testimonial.text}"</p>
                <p className="font-bold text-white">— {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
