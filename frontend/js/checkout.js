async function loadCheckoutPage() {
  const list = document.getElementById('order-items-summary');
  const cart = await fetch(`${API}/cart`).then(r => r.json());
  if (!cart.length) {
    list.innerHTML = '<p>Your cart is empty.</p>';
    document.getElementById('checkout-total').textContent = formatPrice(0);
    return;
  }

  const rows = cart.map(item => `
    <div class="d-flex justify-content-between align-items-center mb-2">
      <div>
        <strong>${item.name}</strong><br>
        <small>${formatPrice(item.price)} each</small>
      </div>
      <div class="d-flex align-items-center" style="gap:6px;">
        <span>Qty: ${item.quantity}</span>
        <span style="margin-left:8px;">${formatPrice(item.price * item.quantity)}</span>
      </div>
    </div>
  `).join('');

  list.innerHTML = rows;
  document.getElementById('checkout-total').textContent = formatPrice(cart.reduce((t, i) => t + i.price * i.quantity, 0));
}

async function submitOrder() {
  const cart = await fetch(`${API}/cart`).then(r => r.json());
  if (!cart.length) return alert('Your cart is empty.');

  const order = await fetch(`${API}/orders/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cartItems: cart,
      customerName: document.getElementById('customer-name').value,
      customerEmail: document.getElementById('customer-email').value,
      customerAddress: document.getElementById('customer-address').value,
      customerCity: document.getElementById('customer-city').value,
      customerZip: document.getElementById('customer-zip').value,
      total: cart.reduce((t, i) => t + i.price * i.quantity, 0)
    })
  }).then(r => r.json());

  sessionStorage.setItem('lastOrderId', order.orderId);
  sessionStorage.setItem('lastOrderTotal', order.total);
  sessionStorage.setItem('lastOrderItems', JSON.stringify(order.items));

  await fetch(`${API}/cart/clear`, { method: 'DELETE' });
  getCartCount();
  window.location.href = 'thankyou.html';
}

document.addEventListener('DOMContentLoaded', () => {
  loadCheckoutPage();
  document.getElementById('checkout-form').addEventListener('submit', e => {
    e.preventDefault();
    submitOrder();
  });
});