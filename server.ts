import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'apex-secret-key-123';

app.use(express.json());

// Initialize Database
const db = new Database('apex.db');

// Setup tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user'
  );
  
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image TEXT,
    stock INTEGER DEFAULT 0,
    sizes TEXT,
    featured INTEGER DEFAULT 0
  );
  
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    total REAL NOT NULL,
    status TEXT DEFAULT 'chờ xử lý',
    shipping_info TEXT,
    payment_method TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
  
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    size TEXT,
    price REAL,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  );
`);

// Seed initial data if empty
const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
if (productCount.count === 0) {
  const insertProduct = db.prepare('INSERT INTO products (name, description, price, image, stock, sizes, featured) VALUES (?, ?, ?, ?, ?, ?, ?)');
  insertProduct.run('Apex Sneakers Air Max 270 React', 'Sự thoải mái cổ điển với phong cách hiện đại. Màu trắng tinh tế.', 3200000, 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&q=80&w=800', 50, '["39", "40", "41", "42", "43"]', 1);
  insertProduct.run('Apex Sneakers Air Max 90', 'Phong cách retro nổi bật với màu tím cá tính.', 3500000, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800', 30, '["40", "41", "42", "43", "44"]', 1);
  insertProduct.run('Apex Sneakers RS-X', 'Thiết kế chunky thời thượng với tông màu hồng trắng.', 2800000, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=800', 100, '["36", "37", "38", "39", "40"]', 1);
  insertProduct.run('Apex Sneakers Legend Essential', 'Giày tập luyện đa năng, thiết kế đen trắng tối giản.', 2200000, 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=800', 20, '["39", "40", "41", "42"]', 0);
  insertProduct.run('Apex Sneakers Air Max 200', 'Đệm khí tối đa cho những bước đi êm ái.', 3000000, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800', 40, '["38", "39", "40", "41", "42", "43"]', 1);
  insertProduct.run('Apex Sneakers Runner Pro', 'Nhẹ và thoáng khí cho việc chạy bộ hàng ngày.', 2500000, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800', 60, '["39", "40", "41", "42", "43"]', 0);
  insertProduct.run('Apex Sneakers Shadow 5000', 'Cảm hứng retro với chất liệu cao cấp.', 2600000, 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&q=80&w=800', 25, '["39", "40", "41", "42"]', 0);
  insertProduct.run('Apex Sneakers Fragment 3', 'Phiên bản giới hạn với thiết kế độc đáo.', 4500000, 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&q=80&w=800', 10, '["40", "41", "42", "43"]', 1);
  insertProduct.run('Apex Sneakers Kyrie', 'Giày bóng rổ chuyên nghiệp, hỗ trợ tối đa.', 3800000, 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&q=80&w=800', 15, '["41", "42", "43", "44"]', 0);
  insertProduct.run('Apex Sneakers Air Max 1', 'Biểu tượng của dòng Air Max, thiết kế xám trắng.', 3100000, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800', 45, '["39", "40", "41", "42", "43"]', 1);
  
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run('Quản trị viên', 'admin@apex.com', hash, 'admin');
}

// Auth Middleware
const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Không có quyền truy cập' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token không hợp lệ' });
  }
};

const isAdmin = (req: any, res: any, next: any) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Bị từ chối' });
  next();
};

// API Routes
// Auth
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hash = bcrypt.hashSync(password, 10);
    const result = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(name, email, hash);
    const userId = Number(result.lastInsertRowid);
    const token = jwt.sign({ id: userId, email, role: 'user' }, JWT_SECRET);
    res.json({ token, user: { id: userId, name, email, role: 'user' } });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Thông tin đăng nhập không hợp lệ' });
  }
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.get('/api/auth/me', authenticate, (req: any, res) => {
  const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(req.user.id);
  res.json({ user });
});

// Products
app.get('/api/products', (req, res) => {
  const products = db.prepare('SELECT * FROM products').all();
  res.json(products.map((p: any) => ({ ...p, sizes: JSON.parse(p.sizes) })));
});

app.get('/api/products/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id) as any;
  if (!product) return res.status(404).json({ error: 'Không tìm thấy' });
  res.json({ ...product, sizes: JSON.parse(product.sizes) });
});

// Admin Products
app.post('/api/products', authenticate, isAdmin, (req, res) => {
  const { name, description, price, image, stock, sizes, featured } = req.body;
  const result = db.prepare('INSERT INTO products (name, description, price, image, stock, sizes, featured) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(name, description, price, image, stock, JSON.stringify(sizes), featured ? 1 : 0);
  res.json({ id: Number(result.lastInsertRowid) });
});

app.put('/api/products/:id', authenticate, isAdmin, (req, res) => {
  const { name, description, price, image, stock, sizes, featured } = req.body;
  db.prepare('UPDATE products SET name=?, description=?, price=?, image=?, stock=?, sizes=?, featured=? WHERE id=?')
    .run(name, description, price, image, stock, JSON.stringify(sizes), featured ? 1 : 0, req.params.id);
  res.json({ success: true });
});

app.delete('/api/products/:id', authenticate, isAdmin, (req, res) => {
  db.prepare('DELETE FROM products WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

// Orders
app.post('/api/orders', authenticate, (req: any, res) => {
  const { items, total, shippingInfo, paymentMethod } = req.body;
  
  const transaction = db.transaction(() => {
    const orderResult = db.prepare('INSERT INTO orders (user_id, total, shipping_info, payment_method) VALUES (?, ?, ?, ?)')
      .run(req.user.id, total, JSON.stringify(shippingInfo), paymentMethod);
    
    const orderId = Number(orderResult.lastInsertRowid);
    
    const insertItem = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, size, price) VALUES (?, ?, ?, ?, ?)');
    for (const item of items) {
      insertItem.run(orderId, item.productId, item.quantity, item.size, item.price);
      db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(item.quantity, item.productId);
    }
    
    return orderId;
  });
  
  try {
    const orderId = transaction();
    res.json({ orderId });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/orders', authenticate, (req: any, res) => {
  if (req.user.role === 'admin') {
    const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
    res.json(orders);
  } else {
    const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    res.json(orders);
  }
});

app.get('/api/orders/:id', authenticate, (req: any, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id) as any;
  if (!order) return res.status(404).json({ error: 'Không tìm thấy' });
  
  if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
    return res.status(403).json({ error: 'Bị từ chối' });
  }
  
  const items = db.prepare('SELECT oi.*, p.name, p.image FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE order_id = ?').all(req.params.id);
  res.json({ ...order, shipping_info: JSON.parse(order.shipping_info), items });
});

// Admin Users
app.get('/api/users', authenticate, isAdmin, (req, res) => {
  const users = db.prepare('SELECT id, name, email, role FROM users').all();
  res.json(users);
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
