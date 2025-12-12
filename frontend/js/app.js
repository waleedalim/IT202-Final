// Frontend is hosted at /it202-final-project on Hostinger, but the backend/API runs on Render.
const BASE_PATH = window.location.pathname.startsWith('/it202-final-project') ? '/it202-final-project' : '';
const API = 'https://it202-final.onrender.com/api';

function applyNavLinks() {
  document.querySelectorAll('[data-nav="home"]').forEach(a => { a.href = `${BASE_PATH}/index.html`; });
  document.querySelectorAll('[data-nav="cart"]').forEach(a => { a.href = `${BASE_PATH}/pages/cart.html`; });
}

function getCartCount() {
  fetch(`${API}/cart`).then(r => r.json()).then(data => {
    const count = data.reduce((t, i) => t + i.quantity, 0);
    document.querySelectorAll('#cart-count').forEach(el => el.textContent = count);
  }).catch(e => console.log('Cart load error:', e));
}

// Initialize nav links early
document.addEventListener('DOMContentLoaded', applyNavLinks);

function formatPrice(price) {
  return '$' + price.toFixed(2);
}