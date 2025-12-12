const API = 'http://localhost:5000/api';

function getCartCount() {
  fetch(`${API}/cart`).then(r => r.json()).then(data => {
    const count = data.reduce((t, i) => t + i.quantity, 0);
    document.querySelectorAll('#cart-count').forEach(el => el.textContent = count);
  });
}

function formatPrice(price) {
  return '$' + price.toFixed(2);
}