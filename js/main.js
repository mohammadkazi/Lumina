/**
 * LUMINA Main Application Controller
 * Handles UI interactions, toasts, modals, responsive navigation, and page-specific handlers.
 */

// Toast notification helper
function showToast(message, type = "info") {
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  let iconSvg = "";
  if (type === "success") {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
  } else if (type === "warning") {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
  } else if (type === "danger") {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
  } else {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
  }

  toast.innerHTML = `
    <div class="toast-icon">${iconSvg}</div>
    <div class="toast-text">${message}</div>
    <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("toast-show");
  }, 20);

  setTimeout(() => {
    toast.classList.remove("toast-show");
    setTimeout(() => toast.remove(), 400);
  }, 4200);
}

// Quick View Modal
function openQuickView(productId) {
  if (typeof PRODUCTS_DATA === "undefined") return;
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById("quickview-modal");
  const modalBody = document.getElementById("quickview-body");
  if (!modal || !modalBody) return;

  const featuresList = (product.features || []).map(f => `<li><span class="bullet-dot"></span>${f}</li>`).join("");

  modalBody.innerHTML = `
    <div class="quickview-grid">
      <div class="quickview-media">
        <img src="${product.image}" alt="${product.name}" class="quickview-img" />
        <span class="product-badge-pill">${product.badge || "Featured"}</span>
      </div>
      <div class="quickview-info">
        <span class="product-category-sub">${product.category.toUpperCase()}</span>
        <h2 class="quickview-title">${product.name}</h2>
        <div class="product-rating-row">
          <span class="stars">★★★★★</span>
          <span class="score">${product.rating}</span>
          <span class="count">(${product.reviewsCount} verified reviews)</span>
        </div>
        <div class="quickview-price-row">
          <span class="quickview-price">$${product.price.toFixed(2)}</span>
          ${product.originalPrice ? `<span class="quickview-old-price">$${product.originalPrice.toFixed(2)}</span>` : ""}
          <span class="stock-tag in-stock">In Stock</span>
        </div>
        <p class="quickview-desc">${product.description}</p>
        <div class="quickview-highlights">
          <h5>Key Specifications</h5>
          <ul class="specs-list">${featuresList}</ul>
        </div>
        <div class="quickview-actions">
          <button class="btn btn-primary btn-lg" onclick="addToCart('${product.id}'); closeQuickView();">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            Add to Shopping Bag
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add("open");
  document.body.classList.add("body-locked");
}

function closeQuickView() {
  const modal = document.getElementById("quickview-modal");
  if (modal) {
    modal.classList.remove("open");
    document.body.classList.remove("body-locked");
  }
}

// Wishlist toggle
function toggleWishlist(btn, productId) {
  btn.classList.toggle("active");
  const isWished = btn.classList.contains("active");
  if (isWished) {
    showToast("Added to your wishlist!", "success");
  } else {
    showToast("Removed from wishlist.", "info");
  }
}

// Mobile navigation menu
function setupMobileMenu() {
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const navDrawer = document.getElementById("mobile-nav-drawer");
  const backdrop = document.getElementById("mobile-nav-backdrop");

  if (!toggleBtn || !navDrawer) return;

  function toggle() {
    navDrawer.classList.toggle("open");
    if (backdrop) backdrop.classList.toggle("open");
    document.body.classList.toggle("body-locked");
  }

  toggleBtn.addEventListener("click", toggle);
  if (backdrop) backdrop.addEventListener("click", toggle);
}

// Setup FAQ Accordion (Contact page)
function setupFaqAccordion() {
  const accordions = document.querySelectorAll(".faq-item-header");
  accordions.forEach(header => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains("active");
      
      // Close others
      document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("active"));
      
      if (!isOpen) {
        item.classList.add("active");
      }
    });
  });
}

// Highlight active page link
function highlightActiveNav() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// Setup newsletter forms
function setupNewsletterForms() {
  const forms = document.querySelectorAll(".newsletter-form");
  forms.forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const input = form.querySelector("input[type='email']");
      if (input && input.value) {
        showToast(`Thank you for subscribing! Check ${input.value} for your 15% discount code.`, "success");
        input.value = "";
      }
    });
  });
}

// Initialize on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  highlightActiveNav();
  setupNewsletterForms();
  setupFaqAccordion();

  // Quickview modal backdrop click
  const quickviewModal = document.getElementById("quickview-modal");
  if (quickviewModal) {
    quickviewModal.addEventListener("click", (e) => {
      if (e.target === quickviewModal) closeQuickView();
    });
  }
});
