function loadProducts() {
  fetch(`${API}/products`).then(r => r.json()).then(products => {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    products.forEach(p => {
      const div = document.createElement('div');
      div.className = 'col-md-4 mb-4';
      div.innerHTML = `
        <div class="card">
          <img src="${p.image}" class="card-img-top">
          <div class="card-body">
            <h5>${p.name}</h5>
            <p>${p.description}</p>
            <p><strong>${formatPrice(p.price)}</strong></p>
            <input type="number" value="1" min="1" id="qty-${p.id}" style="width:60px;">
            <button onclick="addToCart(${p.id})">Add to Cart</button>
          </div>
        </div>
      `;
      container.appendChild(div);
    });
  });
}

function addToCart(productId) {
  const qty = parseInt(document.getElementById(`qty-${productId}`).value);
  fetch(`${API}/cart/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity: qty })
  }).then(() => {
    document.getElementById(`qty-${productId}`).value = 1;
    getCartCount();
  });
}

document.addEventListener('DOMContentLoaded', loadProducts);