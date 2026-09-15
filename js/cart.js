/**
 * LUMINA Global Slide-over Shopping Cart
 * Manages cart state in localStorage and updates badges and drawer across all pages.
 */

const CART_STORAGE_KEY = "lumina_shopping_cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartBadge();
  renderCartDrawer();
}

function addToCart(productId, qty = 1) {
  if (typeof PRODUCTS_DATA === "undefined") return;
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  let cart = getCart();
  const existingItemIndex = cart.findIndex(item => item.id === productId);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: qty
    });
  }

  saveCart(cart);
  if (typeof showToast === "function") {
    showToast(`Added "${product.name}" to cart!`, "success");
  }
  openCartDrawer();
}

function updateQuantity(productId, delta) {
  let cart = getCart();
  const itemIndex = cart.findIndex(item => item.id === productId);
  if (itemIndex > -1) {
    cart[itemIndex].quantity += delta;
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }
    saveCart(cart);
  }
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  if (typeof showToast === "function") {
    showToast("Item removed from cart.", "info");
  }
}

function clearCart() {
  saveCart([]);
}

function updateCartBadge() {
  const cart = getCart();
  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const badges = document.querySelectorAll(".cart-count-badge");
  badges.forEach(b => {
    b.textContent = totalCount;
    b.style.display = totalCount > 0 ? "inline-flex" : "none";
  });
}

function openCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-backdrop");
  if (drawer && overlay) {
    drawer.classList.add("open");
    overlay.classList.add("open");
    document.body.classList.add("body-locked");
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-backdrop");
  if (drawer && overlay) {
    drawer.classList.remove("open");
    overlay.classList.remove("open");
    document.body.classList.remove("body-locked");
  }
}

function renderCartDrawer() {
  const container = document.getElementById("cart-items-container");
  const subtotalEl = document.getElementById("cart-subtotal-price");
  const checkoutBtn = document.getElementById("cart-checkout-btn");
  if (!container || !subtotalEl) return;

  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-state">
        <div class="empty-icon-circle">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </div>
        <h4>Your Cart is Empty</h4>
        <p>Explore our audio & lifestyle collection and find your sound.</p>
        <a href="products.html" class="btn btn-sm btn-primary" onclick="closeCartDrawer()">Shop Products</a>
      </div>
    `;
    subtotalEl.textContent = "$0.00";
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  let subtotal = 0;
  let html = "";

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    html += `
      <div class="cart-item-row" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-thumb" />
        <div class="cart-item-details">
          <h5 class="cart-item-title">${item.name}</h5>
          <span class="cart-item-price">$${item.price.toFixed(2)}</span>
          <div class="cart-qty-ctrls">
            <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" title="Remove item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    `;
  });

  container.innerHTML = html;
  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (checkoutBtn) checkoutBtn.disabled = false;
}

function handleCheckout() {
  const cart = getCart();
  if (cart.length === 0) return;

  const user = typeof getCurrentUser === "function" ? getCurrentUser() : null;
  if (!user) {
    if (typeof showToast === "function") {
      showToast("Please sign in or create an account to finalize checkout.", "warning");
    }
    setTimeout(() => {
      window.location.href = "auth.html";
    }, 1200);
    return;
  }

  // Simulate successful order
  const orderId = "ORD-" + Math.floor(10000 + Math.random() * 90000);
  const total = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);

  // Add order to user history
  const orderObj = {
    id: orderId,
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    status: "Processing",
    items: cart.map(i => `${i.name} (x${i.quantity})`).join(", "),
    total: `$${total.toFixed(2)}`
  };

  const users = typeof getUsers === "function" ? getUsers() : [];
  const idx = users.findIndex(u => u.id === user.id);
  if (idx !== -1) {
    if (!users[idx].orders) users[idx].orders = [];
    users[idx].orders.unshift(orderObj);
    localStorage.setItem("lumina_users_db", JSON.stringify(users));
    setCurrentUser(users[idx]);
  }

  clearCart();
  closeCartDrawer();
  
  if (typeof showToast === "function") {
    showToast(`Success! Order #${orderId} placed successfully.`, "success");
  }

  setTimeout(() => {
    window.location.href = "auth.html#orders";
  }, 1500);
}

// Ensure DOM elements for drawer exist or attach event bindings
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  renderCartDrawer();

  // Bind close buttons
  const closeBtn = document.getElementById("close-cart-btn");
  const backdrop = document.getElementById("cart-backdrop");
  if (closeBtn) closeBtn.addEventListener("click", closeCartDrawer);
  if (backdrop) backdrop.addEventListener("click", closeCartDrawer);

  const checkoutBtn = document.getElementById("cart-checkout-btn");
  if (checkoutBtn) checkoutBtn.addEventListener("click", handleCheckout);
});
