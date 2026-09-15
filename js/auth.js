/**
 * LUMINA Authentication & Session Management
 * Provides client-side persistent auth using localStorage.
 */

const AUTH_STORAGE_KEY = "lumina_users_db";
const SESSION_STORAGE_KEY = "lumina_current_session";

// Initialize default seed user if not present
function initAuthDatabase() {
  const existingUsers = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!existingUsers) {
    const defaultUsers = [
      {
        id: "usr_demo_01",
        username: "demo_user",
        fullName: "Alex Mercer",
        email: "alex.mercer@lumina.io",
        password: "password123",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        tier: "Diamond Pioneer",
        joinedDate: "October 2024",
        address: "742 Evergreen Terrace, Sector 4, Silicon Valley, CA 94025",
        phone: "+1 (555) 382-9012",
        orders: [
          {
            id: "ORD-94821",
            date: "Nov 12, 2024",
            status: "Delivered",
            items: "Lumina Pro Wireless ANC (x1)",
            total: "$349.00"
          },
          {
            id: "ORD-87103",
            date: "Oct 28, 2024",
            status: "Delivered",
            items: "Lumina Magnetic 3-in-1 Power Stand (x1)",
            total: "$119.00"
          }
        ]
      }
    ];
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultUsers));
  }
}

// Get all registered users
function getUsers() {
  initAuthDatabase();
  try {
    return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

// Get current logged-in user
function getCurrentUser() {
  try {
    const session = localStorage.getItem(SESSION_STORAGE_KEY);
    return session ? JSON.parse(session) : null;
  } catch (e) {
    return null;
  }
}

// Save active session
function setCurrentUser(user) {
  if (user) {
    // Exclude raw password from session
    const { password, ...safeUser } = user;
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(safeUser));
  } else {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }
  updateGlobalHeaderAuth();
}

// Register user
function registerUser(fullName, username, email, password) {
  initAuthDatabase();
  const users = getUsers();
  
  // Validation
  if (!username || username.trim().length < 3) {
    return { success: false, message: "Username must be at least 3 characters long." };
  }
  if (!email || !email.includes("@") || !email.includes(".")) {
    return { success: false, message: "Please provide a valid email address." };
  }
  if (!password || password.length < 6) {
    return { success: false, message: "Password must be at least 6 characters." };
  }

  const normalizedUsername = username.trim().toLowerCase();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some(u => u.username.toLowerCase() === normalizedUsername)) {
    return { success: false, message: "This username is already taken. Try another." };
  }
  if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
    return { success: false, message: "An account with this email already exists." };
  }

  const newUser = {
    id: "usr_" + Date.now(),
    username: username.trim(),
    fullName: fullName.trim() || username.trim(),
    email: email.trim(),
    password: password,
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username.trim()}`,
    tier: "Explorer Member",
    joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    address: "No shipping address set yet.",
    phone: "Not provided",
    orders: []
  };

  users.push(newUser);
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(users));
  
  // Auto login
  setCurrentUser(newUser);
  return { success: true, user: newUser };
}

// Login user
function loginUser(identifier, password) {
  initAuthDatabase();
  const users = getUsers();
  const cleanId = (identifier || "").trim().toLowerCase();

  const user = users.find(u => 
    (u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId) &&
    u.password === password
  );

  if (!user) {
    return { success: false, message: "Invalid username/email or password." };
  }

  setCurrentUser(user);
  return { success: true, user };
}

// Quick demo login
function loginDemoUser() {
  return loginUser("demo_user", "password123");
}

// Logout user
function logoutUser() {
  setCurrentUser(null);
  window.dispatchEvent(new CustomEvent("lumina:auth-changed", { detail: null }));
  if (typeof showToast === "function") {
    showToast("You have been signed out.", "info");
  }
  // If on auth page, re-render
  if (window.location.pathname.includes("auth.html")) {
    renderAuthPage();
  }
}

// Update user details
function updateUserProfile(updatedFields) {
  const current = getCurrentUser();
  if (!current) return false;

  const users = getUsers();
  const idx = users.findIndex(u => u.id === current.id);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...updatedFields };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(users));
    setCurrentUser(users[idx]);
    return true;
  }
  return false;
}

// Global header auth status update across all 5 pages
function updateGlobalHeaderAuth() {
  const user = getCurrentUser();
  const authNavElements = document.querySelectorAll(".nav-auth-slot");

  authNavElements.forEach(slot => {
    if (user) {
      slot.innerHTML = `
        <div class="user-pill-dropdown">
          <a href="auth.html" class="user-pill" title="My Account (${user.username})">
            <span class="user-avatar-badge">${user.username.charAt(0).toUpperCase()}</span>
            <span class="user-pill-name">${user.fullName || user.username}</span>
          </a>
          <div class="user-menu-flyout">
            <div class="user-menu-header">
              <span class="user-menu-email">${user.email}</span>
              <span class="badge-tier">${user.tier || "Member"}</span>
            </div>
            <a href="auth.html" class="user-menu-link">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              My Account
            </a>
            <a href="auth.html#orders" class="user-menu-link">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              Orders & Tracking
            </a>
            <button onclick="logoutUser()" class="user-menu-logout-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign Out
            </button>
          </div>
        </div>
      `;
    } else {
      slot.innerHTML = `
        <a href="auth.html" class="btn btn-sm btn-outline-glow">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Sign In
        </a>
      `;
    }
  });
}

// Attach listener on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  initAuthDatabase();
  updateGlobalHeaderAuth();
});
