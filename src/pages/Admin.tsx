import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Users, Package, ShoppingBag, Plus, Trash2, Edit } from 'lucide-react';
import { useStore } from '../store/useStore';

import { api } from '../services/api';

export default function Admin() {
  const { user, token } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Product Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>({
    name: '',
    description: '',
    price: 0,
    image: '',
    stock: 0,
    sizes: ['7', '8', '9', '10', '11'],
    featured: false,
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, ordersData, usersData] = await Promise.all([
          api.getProducts().catch(() => []),
          api.getOrders('admin').catch(() => []), // Assuming 'admin' user_id fetches all in GAS
          api.getUsers().catch(() => []),
        ]);

        setProducts(Array.isArray(productsData) ? productsData : []);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (error) {
        console.error('Failed to fetch admin data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, token, navigate]);

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing ? `/api/products/${currentProduct.id}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(currentProduct),
      });

      if (!res.ok) throw new Error('Failed to save product');

      // Refresh products
      const productsRes = await fetch('/api/products');
      setProducts(await productsRes.json());
      
      setIsEditing(false);
      setCurrentProduct({
        name: '',
        description: '',
        price: 0,
        image: '',
        stock: 0,
        sizes: ['7', '8', '9', '10', '11'],
        featured: false,
      });
    } catch (error) {
      console.error(error);
      alert('Failed to save product');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to delete product');

      setProducts(products.filter((p: any) => p.id !== id));
    } catch (error) {
      console.error(error);
      alert('Failed to delete product');
    }
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
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
    >
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">Admin Dashboard</h1>
        <p className="mt-4 text-lg text-zinc-500">Manage your store, products, and orders.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-2xl transition-colors ${
                activeTab === 'products' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              <Package className="w-5 h-5 mr-3" />
              Products
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-2xl transition-colors ${
                activeTab === 'orders' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              <ShoppingBag className="w-5 h-5 mr-3" />
              Orders
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-2xl transition-colors ${
                activeTab === 'users' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              <Users className="w-5 h-5 mr-3" />
              Users
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'products' && (
            <div className="bg-white shadow-sm rounded-3xl p-8 border border-zinc-200">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-zinc-900">Manage Products</h2>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setCurrentProduct({
                      name: '',
                      description: '',
                      price: 0,
                      image: '',
                      stock: 0,
                      sizes: ['7', '8', '9', '10', '11'],
                      featured: false,
                    });
                  }}
                  className="flex items-center px-4 py-2 bg-zinc-900 text-white text-sm font-bold rounded-full hover:bg-zinc-800 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </button>
              </div>

              {/* Product Form */}
              <form onSubmit={handleProductSubmit} className="mb-12 bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
                <h3 className="text-lg font-bold text-zinc-900 mb-4">{isEditing ? 'Edit Product' : 'New Product'}</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-zinc-700">Name</label>
                    <input
                      type="text"
                      required
                      value={currentProduct.name}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                      className="mt-1 block w-full rounded-xl border-zinc-300 shadow-sm focus:border-zinc-900 focus:ring-zinc-900 sm:text-sm py-2 px-3 border"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-zinc-700">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={currentProduct.price}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) })}
                      className="mt-1 block w-full rounded-xl border-zinc-300 shadow-sm focus:border-zinc-900 focus:ring-zinc-900 sm:text-sm py-2 px-3 border"
                    />
                  </div>
                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-zinc-700">Description</label>
                    <textarea
                      required
                      value={currentProduct.description}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                      className="mt-1 block w-full rounded-xl border-zinc-300 shadow-sm focus:border-zinc-900 focus:ring-zinc-900 sm:text-sm py-2 px-3 border"
                      rows={3}
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-sm font-medium text-zinc-700">Image URL</label>
                    <input
                      type="text"
                      required
                      value={currentProduct.image}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, image: e.target.value })}
                      className="mt-1 block w-full rounded-xl border-zinc-300 shadow-sm focus:border-zinc-900 focus:ring-zinc-900 sm:text-sm py-2 px-3 border"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700">Stock</label>
                    <input
                      type="number"
                      required
                      value={currentProduct.stock}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, stock: parseInt(e.target.value) })}
                      className="mt-1 block w-full rounded-xl border-zinc-300 shadow-sm focus:border-zinc-900 focus:ring-zinc-900 sm:text-sm py-2 px-3 border"
                    />
                  </div>
                  <div className="sm:col-span-6 flex items-center">
                    <input
                      id="featured"
                      type="checkbox"
                      checked={currentProduct.featured}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, featured: e.target.checked })}
                      className="h-4 w-4 text-zinc-900 focus:ring-zinc-900 border-zinc-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-zinc-900 font-medium">
                      Featured Product
                    </label>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    className="bg-zinc-900 border border-transparent rounded-full shadow-sm py-2 px-6 text-sm font-bold text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 transition-colors"
                  >
                    {isEditing ? 'Update Product' : 'Save Product'}
                  </button>
                </div>
              </form>

              {/* Product List */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-200">
                  <thead className="bg-zinc-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Product</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Price</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Stock</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-zinc-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-zinc-200">
                    {products.map((product: any) => (
                      <tr key={product.id} className="hover:bg-zinc-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-lg object-cover" src={product.image} alt="" referrerPolicy="no-referrer" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-zinc-900">{product.name}</div>
                              <div className="text-sm text-zinc-500">{product.featured ? 'Featured' : 'Standard'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 font-medium">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                          {product.stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setIsEditing(true);
                              setCurrentProduct(product);
                            }}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white shadow-sm rounded-3xl p-8 border border-zinc-200">
              <h2 className="text-2xl font-bold text-zinc-900 mb-8">Recent Orders</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-200">
                  <thead className="bg-zinc-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Order ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Total</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-zinc-200">
                    {orders.map((order: any) => (
                      <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-zinc-900">#{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">{new Date(order.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900">${order.total.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white shadow-sm rounded-3xl p-8 border border-zinc-200">
              <h2 className="text-2xl font-bold text-zinc-900 mb-8">Registered Users</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-200">
                  <thead className="bg-zinc-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Email</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Role</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-zinc-200">
                    {users.map((u: any) => (
                      <tr key={u.id} className="hover:bg-zinc-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-zinc-900">{u.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">{u.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 capitalize">{u.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
