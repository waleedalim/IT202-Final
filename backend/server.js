const express = require('express');
const path = require('path');
const app = express();

// Set BASE_PATH via env when hosting under a subpath (e.g., "/it202-final-project" on Hostinger).
// Leave empty for root deployments (e.g., Render at it202-final.onrender.com).
const BASE_PATH = process.env.BASE_PATH || '';
const STATIC_MOUNT = BASE_PATH || '/';
const API_PREFIX = `${BASE_PATH || ''}/api`;

app.use(express.json());
// Serve frontend under the configured base path
app.use(STATIC_MOUNT, express.static(path.join(__dirname, '../frontend')));
// Allow cross-origin requests from your Hostinger site to Render
try {
  const cors = require('cors');
  app.use(cors({
    origin: [
      'https://waleedalim.com',
      'https://www.waleedalim.com'
    ],
    methods: ['GET','POST','PUT','DELETE'],
  }));
} catch (e) {
  // If cors isn't installed locally, ignore; Render should have it installed.
}

const products = [
  { id: 1, name: 'Wireless Headphones', price: 189.99, description: 'premium sound quality', image: `${BASE_PATH || ''}/images/headphone.webp` },
  { id: 2, name: 'USB-C Cable', price: 19.99, description: 'a fast charging cable', image: `${BASE_PATH || ''}/images/cable.jpg` },
  { id: 3, name: 'Phone Stand', price: 29.99, description: 'adjustable stand', image: `${BASE_PATH || ''}/images/stands.jpg` },
  { id: 4, name: 'Portable Speaker', price: 79.99, description: 'bluetooth speaker', image: `${BASE_PATH || ''}/images/speaker.avif` },
  { id: 5, name: 'Screen Protector', price: 9.99, description: 'tempered glass', image: `${BASE_PATH || ''}/images/screenprotector.webp` },
  { id: 6, name: 'Phone Case', price: 24.99, description: 'protective case', image: `${BASE_PATH || ''}/images/case.jpg` },
  { id: 7, name: 'Wireless Charger', price: 39.99, description: 'very fast charging', image: `${BASE_PATH || ''}/images/charger.webp` },
  { id: 8, name: 'Computer Mouse', price: 49.99, description: 'good design', image: `${BASE_PATH || ''}/images/mouse.avif` },
  { id: 9, name: 'Watch', price: 199.99, description: 'smart watch', image: `${BASE_PATH || ''}/images/watch.webp` }
];

let cart = [];
let orders = [];
let orderId = 1000;

app.get(`${API_PREFIX}/products`, (req, res) => res.json(products));

app.get(`${API_PREFIX}/cart`, (req, res) => res.json(cart));
app.post(`${API_PREFIX}/cart/add`, (req, res) => {
  const productId = Number(req.body.productId);
  const qty = Number(req.body.quantity) || 0;
  const product = products.find(p => p.id === productId);
  const cartItem = cart.find(c => c.id === productId);
  if (cartItem) cartItem.quantity += qty;
  else cart.push({ ...product, quantity: qty });
  res.json(cart);
});
app.put(`${API_PREFIX}/cart/update/:id`, (req, res) => {
  const item = cart.find(c => c.id === parseInt(req.params.id));
  if (item) item.quantity = Number(req.body.quantity) || item.quantity;
  res.json(cart);
});
app.delete(`${API_PREFIX}/cart/remove/:id`, (req, res) => {
  cart = cart.filter(c => c.id !== parseInt(req.params.id));
  res.json(cart);
});
app.delete(`${API_PREFIX}/cart/clear`, (req, res) => {
  cart = [];
  res.json({ success: true });
});

app.post(`${API_PREFIX}/orders/create`, (req, res) => {
  const order = { orderId: orderId++, ...req.body, items: cart, createdAt: new Date() };
  orders.push(order);
  res.json(order);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
