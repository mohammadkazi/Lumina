/**
 * LUMINA Global Slide-over Shopping Cart & Checkout System
 * Manages cart state in localStorage, badges, drawer, checkout form modal, and order confirmation.
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

// -----------------------------------------------------------------------------
// Dynamic Checkout Modal & Order Success Modal Management
// -----------------------------------------------------------------------------

function ensureCheckoutModalsExist() {
  if (document.getElementById("checkout-modal")) return;

  const modalHtml = `
    <!-- Checkout Modal -->
    <div class="modal-overlay" id="checkout-modal">
      <div class="checkout-modal-dialog">
        <button class="modal-close-btn" onclick="closeCheckoutModal()" aria-label="Close checkout">&times;</button>
        
        <div class="checkout-header">
          <h3>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            Complete Delivery Details
          </h3>
          <span class="badge-tier">Secure Checkout</span>
        </div>

        <div class="checkout-items-preview" id="checkout-order-summary">
          <!-- Summary injected dynamically -->
        </div>

        <form id="checkout-details-form" onsubmit="handleCheckoutFormSubmit(event)">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group">
              <label class="form-label" for="checkout-name">Full Name *</label>
              <div class="input-with-icon">
                <span class="input-icon-slot">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
                <input type="text" id="checkout-name" class="form-input" placeholder="e.g. Liam Vance" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="checkout-mobile">Mobile Number *</label>
              <div class="input-with-icon">
                <span class="input-icon-slot">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </span>
                <input type="tel" id="checkout-mobile" class="form-input" placeholder="+1 (555) 382-9012" required />
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="checkout-email">Email Address *</label>
            <div class="input-with-icon">
              <span class="input-icon-slot">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </span>
              <input type="email" id="checkout-email" class="form-input" placeholder="liam@example.com" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="checkout-address">Street Address *</label>
            <div class="input-with-icon">
              <span class="input-icon-slot">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </span>
              <input type="text" id="checkout-address" class="form-input" placeholder="Suite, Street name, Building No." required />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 16px;">
            <div class="form-group">
              <label class="form-label" for="checkout-city">City / Region *</label>
              <input type="text" id="checkout-city" class="form-input" placeholder="e.g. San Francisco, CA" style="padding-left: 16px;" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="checkout-zip">Postal / Zip Code *</label>
              <input type="text" id="checkout-zip" class="form-input" placeholder="e.g. 94103" style="padding-left: 16px;" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Payment Method</label>
            <div class="payment-options-grid">
              <label class="payment-radio-label">
                <input type="radio" name="checkout-payment" value="Cash on Delivery (COD)" checked />
                <span>Cash on Delivery</span>
              </label>
              <label class="payment-radio-label">
                <input type="radio" name="checkout-payment" value="Credit / Debit Card" />
                <span>Credit / Debit Card</span>
              </label>
              <label class="payment-radio-label">
                <input type="radio" name="checkout-payment" value="Instant UPI / Wallet" />
                <span>Digital Wallet / UPI</span>
              </label>
            </div>
          </div>

          <div style="margin-top: 24px;">
            <button type="submit" class="btn btn-primary btn-block btn-lg" id="confirm-order-btn">
              <span>Confirm & Place Order</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Order Placed Successfully Celebration Modal -->
    <div class="modal-overlay" id="order-success-modal">
      <div class="order-success-dialog">
        <div class="order-success-icon-wrapper">
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <h2 style="font-size: 2rem; margin-bottom: 6px;">Order Placed Successfully!</h2>
        <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 16px;">
          Thank you for choosing LUMINA. Your acoustic order has been confirmed and is being prepped for express dispatch.
        </p>

        <div id="order-success-badge-container">
          <!-- Order ID Pill -->
        </div>

        <div class="order-receipt-summary" id="order-success-receipt">
          <!-- Dynamic details injected here -->
        </div>

        <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-secondary btn-lg" onclick="closeOrderSuccessModal()">
            Continue Shopping
          </button>
          <a href="auth.html#orders" class="btn btn-primary btn-lg" onclick="closeOrderSuccessModal()">
            View in My Account
          </a>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  // Close modals on overlay backdrop click
  const checkoutModal = document.getElementById("checkout-modal");
  if (checkoutModal) {
    checkoutModal.addEventListener("click", e => {
      if (e.target === checkoutModal) closeCheckoutModal();
    });
  }
}

function openCheckoutModal() {
  const cart = getCart();
  if (cart.length === 0) {
    if (typeof showToast === "function") {
      showToast("Your shopping cart is empty.", "warning");
    }
    return;
  }

  ensureCheckoutModalsExist();
  closeCartDrawer();

  // Populate preview summary
  const summaryEl = document.getElementById("checkout-order-summary");
  const totalAmount = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const totalItems = cart.reduce((acc, i) => acc + i.quantity, 0);

  if (summaryEl) {
    summaryEl.innerHTML = `
      <div class="checkout-items-row">
        <span>Order Summary (${totalItems} items):</span>
        <span class="checkout-items-total">$${totalAmount.toFixed(2)}</span>
      </div>
      <div style="font-size: 0.78rem; color: var(--cyan); margin-top: 6px;">
        Includes Complimentary Carbon-Neutral Express Shipping & 3-Year Lumina Care Warranty
      </div>
    `;
  }

  // Pre-fill if user is logged in
  const user = typeof getCurrentUser === "function" ? getCurrentUser() : null;
  if (user) {
    const nameInput = document.getElementById("checkout-name");
    const emailInput = document.getElementById("checkout-email");
    const mobileInput = document.getElementById("checkout-mobile");
    const addressInput = document.getElementById("checkout-address");

    if (nameInput) nameInput.value = user.fullName || user.username || "";
    if (emailInput) emailInput.value = user.email || "";
    if (mobileInput && user.phone && user.phone !== "Not provided") {
      mobileInput.value = user.phone;
    }
    if (addressInput && user.address && !user.address.includes("No shipping address")) {
      addressInput.value = user.address;
    }
  }

  const modal = document.getElementById("checkout-modal");
  if (modal) {
    modal.classList.add("open");
    document.body.classList.add("body-locked");
  }
}

function closeCheckoutModal() {
  const modal = document.getElementById("checkout-modal");
  if (modal) {
    modal.classList.remove("open");
    document.body.classList.remove("body-locked");
  }
}

function closeOrderSuccessModal() {
  const modal = document.getElementById("order-success-modal");
  if (modal) {
    modal.classList.remove("open");
    document.body.classList.remove("body-locked");
  }
}

function handleCheckoutFormSubmit(event) {
  event.preventDefault();
  const cart = getCart();
  if (cart.length === 0) return;

  const name = document.getElementById("checkout-name").value.trim();
  const mobile = document.getElementById("checkout-mobile").value.trim();
  const email = document.getElementById("checkout-email").value.trim();
  const address = document.getElementById("checkout-address").value.trim();
  const city = document.getElementById("checkout-city").value.trim();
  const zip = document.getElementById("checkout-zip").value.trim();
  
  const paymentMethodEl = document.querySelector("input[name='checkout-payment']:checked");
  const paymentMethod = paymentMethodEl ? paymentMethodEl.value : "Cash on Delivery";

  if (!name || !mobile || !email || !address || !city || !zip) {
    if (typeof showToast === "function") {
      showToast("Please complete all required fields.", "warning");
    }
    return;
  }

  const orderId = "ORD-" + Math.floor(10000 + Math.random() * 90000);
  const totalAmount = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const fullAddress = `${address}, ${city} ${zip}`;

  const orderObj = {
    id: orderId,
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    status: "Processing",
    items: cart.map(i => `${i.name} (x${i.quantity})`).join(", "),
    total: `$${totalAmount.toFixed(2)}`,
    customerName: name,
    customerPhone: mobile,
    customerEmail: email,
    shippingAddress: fullAddress,
    paymentMethod: paymentMethod
  };

  // If user is authenticated, attach order to their account profile
  const user = typeof getCurrentUser === "function" ? getCurrentUser() : null;
  if (user) {
    const users = typeof getUsers === "function" ? getUsers() : [];
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      if (!users[idx].orders) users[idx].orders = [];
      users[idx].orders.unshift(orderObj);
      users[idx].phone = mobile;
      users[idx].address = fullAddress;
      localStorage.setItem("lumina_users_db", JSON.stringify(users));
      setCurrentUser(users[idx]);
    }
  }

  // Also save in general orders list
  try {
    const allOrders = JSON.parse(localStorage.getItem("lumina_all_orders")) || [];
    allOrders.unshift(orderObj);
    localStorage.setItem("lumina_all_orders", JSON.stringify(allOrders));
  } catch (e) {
    console.error(e);
  }

  // Clear shopping cart
  clearCart();
  closeCheckoutModal();

  // Populate Order Success Celebration Dialog
  const badgeContainer = document.getElementById("order-success-badge-container");
  const receiptContainer = document.getElementById("order-success-receipt");

  if (badgeContainer) {
    badgeContainer.innerHTML = `
      <span class="order-id-pill">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        Order Ref: ${orderId}
      </span>
    `;
  }

  if (receiptContainer) {
    receiptContainer.innerHTML = `
      <div class="receipt-row">
        <span class="receipt-label">Recipient:</span>
        <span class="receipt-val">${name}</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-label">Contact:</span>
        <span class="receipt-val">${mobile} (${email})</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-label">Deliver To:</span>
        <span class="receipt-val">${fullAddress}</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-label">Payment:</span>
        <span class="receipt-val">${paymentMethod}</span>
      </div>
      <div class="receipt-row" style="border-top: 1px solid var(--border-subtle); padding-top: 8px; margin-top: 4px;">
        <span class="receipt-label" style="font-weight: 700; color: var(--text-primary);">Total Amount:</span>
        <span class="receipt-val" style="color: var(--cyan); font-size: 1.1rem; font-weight: 800;">$${totalAmount.toFixed(2)}</span>
      </div>
    `;
  }

  const successModal = document.getElementById("order-success-modal");
  if (successModal) {
    successModal.classList.add("open");
    document.body.classList.add("body-locked");
  }

  if (typeof showToast === "function") {
    showToast(`Order #${orderId} confirmed! Details sent to ${email}.`, "success");
  }
}

// Ensure DOM elements for drawer exist or attach event bindings
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  renderCartDrawer();
  ensureCheckoutModalsExist();

  // Bind close buttons
  const closeBtn = document.getElementById("close-cart-btn");
  const backdrop = document.getElementById("cart-backdrop");
  if (closeBtn) closeBtn.addEventListener("click", closeCartDrawer);
  if (backdrop) backdrop.addEventListener("click", closeCartDrawer);

  const checkoutBtn = document.getElementById("cart-checkout-btn");
  if (checkoutBtn) checkoutBtn.addEventListener("click", openCheckoutModal);
});
