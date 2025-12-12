function loadCart() {
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) checkoutBtn.disabled = true; // default to disabled until data loads
  fetch(`${API}/cart`).then(r => r.json()).then(cart => {
    const container = document.getElementById('cart-items-container');
    if (cart.length === 0) {
      container.innerHTML = `<p>Cart is empty</p><a class="btn btn-primary mt-2" href="/it202-final-project/frontend/index.html">Back to products</a>`;
      document.getElementById('total').textContent = formatPrice(0);
      document.getElementById('checkout-btn').disabled = true;
      getCartCount();
      return;
    }
    container.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
      total += item.price * item.quantity;
      const div = document.createElement('div');
      div.className = 'card mb-2';
      div.innerHTML = `
        <div class="card-body d-flex justify-content-between align-items-center">
          <div>
            <strong>${item.name}</strong><br>
            <small>${formatPrice(item.price)} each</small>
          </div>
          <div class="d-flex align-items-center" style="gap:6px;">
            <button class="btn btn-sm btn-light" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
            <input type="number" min="1" value="${item.quantity}" style="width:70px;" onchange="updateQuantity(${item.id}, this.value)">
            <button class="btn btn-sm btn-light" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
            <strong style="margin-left:8px;">${formatPrice(item.price * item.quantity)}</strong>
            <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${item.id})">Remove</button>
          </div>
        </div>
      `;
      container.appendChild(div);
    });
    document.getElementById('total').textContent = formatPrice(total);
    document.getElementById('checkout-btn').disabled = false;
  }).catch(() => {
    const container = document.getElementById('cart-items-container');
    if (container) container.innerHTML = '<p>Unable to load cart.</p>';
    if (checkoutBtn) checkoutBtn.disabled = true;
  });
}

function updateQuantity(id, qty) {
  const quantity = parseInt(qty);
  if (quantity <= 0) { removeFromCart(id); return; }
  fetch(`${API}/cart/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity })
  }).then(() => { loadCart(); getCartCount(); });
}

function removeFromCart(id) {
  fetch(`${API}/cart/remove/${id}`, { method: 'DELETE' }).then(() => { loadCart(); getCartCount(); });
}

function goToCheckout() {
  fetch(`${API}/cart`).then(r => r.json()).then(cart => {
    if (!cart || cart.length === 0) return alert('Cart is empty. Add items first.');
    window.location.href = `/it202-final-project/frontend/pages/checkout.html`;
  });
}

document.addEventListener('DOMContentLoaded', loadCart);