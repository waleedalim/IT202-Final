const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const products = [
  { id: 1, name: 'Wireless Headphones', price: 189.99, description: 'premium sound quality', image: '/images/headphone.webp' },
  { id: 2, name: 'USB-C Cable', price: 19.99, description: 'a fast charging cable', image: '/images/cable.jpg' },
  { id: 3, name: 'Phone Stand', price: 29.99, description: 'adjustable stand', image: '/images/stands.jpg' },
  { id: 4, name: 'Portable Speaker', price: 79.99, description: 'bluetooth speaker', image: '/images/speaker.avif' },
  { id: 5, name: 'Screen Protector', price: 9.99, description: 'tempered glass', image: '/images/screenprotector.webp' },
  { id: 6, name: 'Phone Case', price: 24.99, description: 'protective case', image: '/images/case.jpg' },
  { id: 7, name: 'Wireless Charger', price: 39.99, description: 'very fast charging', image: '/images/charger.webp' },
  { id: 8, name: 'Computer Mouse', price: 49.99, description: 'good design', image: '/images/mouse.avif' },
  { id: 9, name: 'Watch', price: 199.99, description: 'smart watch', image: '/images/watch.webp' }
];

let cart = [];
let orders = [];
let orderId = 1000;

app.get('/api/products', (req, res) => res.json(products));

app.get('/api/cart', (req, res) => res.json(cart));
app.post('/api/cart/add', (req, res) => {
  const productId = Number(req.body.productId);
  const qty = Number(req.body.quantity) || 0;
  const product = products.find(p => p.id === productId);
  const cartItem = cart.find(c => c.id === productId);
  if (cartItem) cartItem.quantity += qty;
  else cart.push({ ...product, quantity: qty });
  res.json(cart);
});
app.put('/api/cart/update/:id', (req, res) => {
  const item = cart.find(c => c.id === parseInt(req.params.id));
  if (item) item.quantity = Number(req.body.quantity) || item.quantity;
  res.json(cart);
});
app.delete('/api/cart/remove/:id', (req, res) => {
  cart = cart.filter(c => c.id !== parseInt(req.params.id));
  res.json(cart);
});
app.delete('/api/cart/clear', (req, res) => {
  cart = [];
  res.json({ success: true });
});

app.post('/api/orders/create', (req, res) => {
  const order = { orderId: orderId++, ...req.body, items: cart, createdAt: new Date() };
  orders.push(order);
  res.json(order);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
