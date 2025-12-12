const express = require('express');
const path = require('path');
const app = express();

const BASE_PATH = '/it202-final-project';

app.use(express.json());
// Serve frontend under the base path so assets resolve at /it202-final-project/*
app.use(BASE_PATH, express.static(path.join(__dirname, '../frontend')));

const products = [
  { id: 1, name: 'Wireless Headphones', price: 189.99, description: 'premium sound quality', image: `${BASE_PATH}/images/headphone.webp` },
  { id: 2, name: 'USB-C Cable', price: 19.99, description: 'a fast charging cable', image: `${BASE_PATH}/images/cable.jpg` },
  { id: 3, name: 'Phone Stand', price: 29.99, description: 'adjustable stand', image: `${BASE_PATH}/images/stands.jpg` },
  { id: 4, name: 'Portable Speaker', price: 79.99, description: 'bluetooth speaker', image: `${BASE_PATH}/images/speaker.avif` },
  { id: 5, name: 'Screen Protector', price: 9.99, description: 'tempered glass', image: `${BASE_PATH}/images/screenprotector.webp` },
  { id: 6, name: 'Phone Case', price: 24.99, description: 'protective case', image: `${BASE_PATH}/images/case.jpg` },
  { id: 7, name: 'Wireless Charger', price: 39.99, description: 'very fast charging', image: `${BASE_PATH}/images/charger.webp` },
  { id: 8, name: 'Computer Mouse', price: 49.99, description: 'good design', image: `${BASE_PATH}/images/mouse.avif` },
  { id: 9, name: 'Watch', price: 199.99, description: 'smart watch', image: `${BASE_PATH}/images/watch.webp` }
];

let cart = [];
let orders = [];
let orderId = 1000;

app.get(`${BASE_PATH}/api/products`, (req, res) => res.json(products));

app.get(`${BASE_PATH}/api/cart`, (req, res) => res.json(cart));
app.post(`${BASE_PATH}/api/cart/add`, (req, res) => {
  const productId = Number(req.body.productId);
  const qty = Number(req.body.quantity) || 0;
  const product = products.find(p => p.id === productId);
  const cartItem = cart.find(c => c.id === productId);
  if (cartItem) cartItem.quantity += qty;
  else cart.push({ ...product, quantity: qty });
  res.json(cart);
});
app.put(`${BASE_PATH}/api/cart/update/:id`, (req, res) => {
  const item = cart.find(c => c.id === parseInt(req.params.id));
  if (item) item.quantity = Number(req.body.quantity) || item.quantity;
  res.json(cart);
});
app.delete(`${BASE_PATH}/api/cart/remove/:id`, (req, res) => {
  cart = cart.filter(c => c.id !== parseInt(req.params.id));
  res.json(cart);
});
app.delete(`${BASE_PATH}/api/cart/clear`, (req, res) => {
  cart = [];
  res.json({ success: true });
});

app.post(`${BASE_PATH}/api/orders/create`, (req, res) => {
  const order = { orderId: orderId++, ...req.body, items: cart, createdAt: new Date() };
  orders.push(order);
  res.json(order);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
