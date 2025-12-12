function displayThankYou() {
  const orderId = sessionStorage.getItem('lastOrderId');
  const total = sessionStorage.getItem('lastOrderTotal');
  const items = JSON.parse(sessionStorage.getItem('lastOrderItems') || '[]');
  
  document.getElementById('thank-you-order-id').textContent = orderId;
  document.getElementById('thank-you-total').textContent = formatPrice(parseFloat(total));
  
  const list = document.getElementById('thank-you-items-list');
  items.forEach(item => {
    const p = document.createElement('p');
    p.textContent = `${item.name} (x${item.quantity}) - ${formatPrice(item.price * item.quantity)}`;
    list.appendChild(p);
  });
  
  sessionStorage.clear();
}

document.addEventListener('DOMContentLoaded', displayThankYou);