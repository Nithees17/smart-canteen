let currentUser = null;
let cart = [];
let currentCategory = 'all';
let selectedPaymentMethod = 'Cash';

// Toast Utility
window.showToast = function(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    let icon = type === 'success' ? '<i class="fa-solid fa-circle-check" style="color:var(--success-color)"></i>' : '<i class="fa-solid fa-circle-exclamation" style="color:var(--danger-color)"></i>';
    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};


// Check Auth
document.addEventListener('DOMContentLoaded', () => {
    const userStr = sessionStorage.getItem('scms_current_user');
    if (!userStr) {
        window.location.href = 'index.html';
        return;
    }
    currentUser = JSON.parse(userStr);
    if (currentUser.role !== 'student') {
        window.location.href = 'index.html';
        return;
    }
    
    document.getElementById('user-name-display').innerText = currentUser.name;
    document.getElementById('user-roll-display').innerText = currentUser.rollNo;
    
    renderMenu();
    renderOrders();

    // Listen to changes from Admin (simulated real-time)
    window.addEventListener('storage', (e) => {
        if (e.key === 'scms_orders') renderOrders();
        if (e.key === 'scms_menu') renderMenu();
    });
});

window.logout = function() {
    sessionStorage.removeItem('scms_current_user');
    window.location.href = 'index.html';
};

// Profile Menu
window.toggleProfileMenu = function() {
    document.getElementById('profile-menu').classList.toggle('active');
};

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.profile-container')) {
        const menu = document.getElementById('profile-menu');
        if (menu && menu.classList.contains('active')) {
            menu.classList.remove('active');
        }
    }
});

// Menu Rendering
window.filterMenu = function(category) {
    currentCategory = category;
    
    // Update active tab styling
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.toLowerCase().includes(category) || (category === 'all' && btn.innerText.includes('All'))) {
            btn.classList.add('active');
        }
    });

    renderMenu();
};

window.searchMenu = function() {
    renderMenu();
};

function renderMenu() {
    const container = document.getElementById('menu-container');
    const fullMenu = window.db.getMenu();
    const searchQuery = (document.getElementById('search-input')?.value || '').toLowerCase();
    
    let filteredMenu = fullMenu;
    if (currentCategory !== 'all') {
        filteredMenu = fullMenu.filter(item => item.category === currentCategory);
    }

    if (searchQuery) {
        filteredMenu = filteredMenu.filter(item => item.name.toLowerCase().includes(searchQuery));
    }

    container.innerHTML = '';
    
    filteredMenu.forEach(item => {
        if (!item.available) return; // Skip disabled items
        
        const card = document.createElement('div');
        card.className = 'menu-card fade-in';
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="menu-img" loading="lazy">
            <div class="menu-info">
                <div class="menu-title">${item.name}</div>
                <div class="menu-price">₹${item.price}</div>
                <button class="btn btn-primary" style="margin-top:auto;" onclick="addToCart('${item.id}')">
                    <i class="fa-solid fa-plus"></i> Add
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Cart Logic
window.addToCart = function(itemId) {
    const fullMenu = window.db.getMenu();
    const item = fullMenu.find(i => i.id === itemId);
    
    const existingPdt = cart.find(c => c.id === itemId);
    if (existingPdt) {
        existingPdt.qty += 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    
    showToast(`Added ${item.name} to cart`);
    renderCart();
};

window.updateQty = function(itemId, change) {
    const item = cart.find(c => c.id === itemId);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) {
            cart = cart.filter(c => c.id !== itemId);
        }
    }
    renderCart();
};

function renderCart() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (cart.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">Your cart is empty. Add some delicious food!</p>';
        totalEl.innerText = '₹0';
        checkoutBtn.disabled = true;
        return;
    }

    container.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += (item.price * item.qty);
        container.innerHTML += `
            <div class="cart-item fade-in">
                <div>
                    <div style="font-weight: 600;">${item.name}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">₹${item.price} x ${item.qty}</div>
                </div>
                <div class="cart-item-controls">
                    <button onclick="updateQty('${item.id}', -1)"><i class="fa-solid fa-minus" style="font-size: 10px;"></i></button>
                    <span>${item.qty}</span>
                    <button onclick="updateQty('${item.id}', 1)"><i class="fa-solid fa-plus" style="font-size: 10px;"></i></button>
                </div>
            </div>
        `;
    });

    totalEl.innerText = `₹${total}`;
    checkoutBtn.disabled = false;
}

// Payment Flow
window.checkout = function() {
    if (cart.length === 0) return;
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    document.getElementById('payment-amount').innerText = `₹${total}`;
    selectPayment('Cash'); // Default
    document.getElementById('payment-modal').classList.add('active');
};

window.selectPayment = function(method) {
    selectedPaymentMethod = method;
    document.getElementById('lbl-cash').style.borderColor = method === 'Cash' ? 'var(--success-color)' : 'transparent';
    document.getElementById('lbl-online').style.borderColor = method === 'Online' ? 'var(--primary-color)' : 'transparent';
    document.querySelector(`input[value="${method}"]`).checked = true;
};

window.closePaymentModal = function() {
    document.getElementById('payment-modal').classList.remove('active');
};

window.confirmPayment = function() {
    // Generate Order
    const orders = window.db.getOrders();
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    
    // Simple 4 digit token 1000-9999
    const tokenNumber = Math.floor(1000 + Math.random() * 9000); 

    const newOrder = {
        id: 'ord_' + Date.now(),
        userId: currentUser.id,
        userRoll: currentUser.rollNo,
        userName: currentUser.name,
        items: cart,
        totalAmount: total,
        tokenNumber: tokenNumber,
        paymentMethod: selectedPaymentMethod,
        status: 'ordered', // ordered -> preparing -> ready
        timestamp: new Date().toISOString()
    };

    orders.push(newOrder);
    window.db.saveOrders(orders);
    
    // Update Sales Report
    window.db.updateSalesReport(total, totalItems);

    cart = [];
    renderCart();
    closePaymentModal();
    renderOrders();
    
    // Show Confirmation Modal
    document.getElementById('confirmed-token').innerText = `#${tokenNumber}`;
    document.getElementById('confirmation-modal').classList.add('active');
};

window.closeConfirmationModal = function() {
    document.getElementById('confirmation-modal').classList.remove('active');
};

// Orders Rendering
function renderOrders() {
    const container = document.getElementById('active-orders-container');
    const pastContainer = document.getElementById('past-orders-container');
    const allOrders = window.db.getOrders();
    
    // Get only my orders, sort by latest
    const myOrders = allOrders
        .filter(o => o.userId === currentUser.id)
        .sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));

    const activeOrders = myOrders.filter(o => o.status !== 'collected');
    const pastOrders = myOrders.filter(o => o.status === 'collected');

    // Render Active
    if (activeOrders.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">No active orders.</p>';
    } else {
        container.innerHTML = '';
        activeOrders.forEach(order => {
            const time = new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            let otpBlock = '';
            
            if (order.status === 'ready' && order.collectionOtp) {
                otpBlock = `
                    <div style="background: rgba(16, 185, 129, 0.1); border: 1px dashed var(--success-color); padding: 0.75rem; border-radius: 8px; margin-top: 1rem; text-align: center;">
                        <span style="font-size: 0.85rem; color: var(--success-color); font-weight: 700; text-transform: uppercase;">Collection OTP</span>
                        <div style="font-size: 1.8rem; font-weight: 900; color: var(--text-main); letter-spacing: 4px;">${order.collectionOtp}</div>
                    </div>
                `;
            }

            container.innerHTML += `
                <div style="background: rgba(255,255,255,0.6); padding: 1rem; border-radius: 12px; margin-bottom: 1rem; border: 1px solid var(--glass-border);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <div style="font-size: 1.2rem; font-weight: 800; color: var(--primary-color);">Token #${order.tokenNumber}</div>
                        <span class="order-badge status-${order.status}">${order.status}</span>
                    </div>
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">Placed at ${time} · Paid via ${order.paymentMethod || 'Online'}</div>
                    <div style="font-size: 0.9rem;">
                        ${order.items.map(i => `${i.qty}x ${i.name}`).join(', ')}
                    </div>
                    <div style="margin-top: 0.5rem; font-weight: 700; text-align: right;">Total: ₹${order.totalAmount}</div>
                    ${otpBlock}
                </div>
            `;
        });
    }

    // Render Past
    if (pastOrders.length === 0) {
        if(pastContainer) pastContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 1rem; text-align: center; padding: 2rem;">No past orders yet.</p>';
    } else {
        if(pastContainer) {
            pastContainer.innerHTML = '';
            pastOrders.forEach(order => {
                const date = new Date(order.timestamp).toLocaleDateString();
                const time = new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                pastContainer.innerHTML += `
                    <div style="background: rgba(255,255,255,0.6); padding: 1rem; border-radius: 12px; margin-bottom: 1rem; border: 1px solid var(--glass-border); display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-size: 1.1rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.2rem;">Token #${order.tokenNumber}</div>
                            <div style="font-size: 0.85rem; color: var(--text-muted);">${date} ${time} · ₹${order.totalAmount}</div>
                            <div style="font-size: 0.85rem; margin-top: 0.2rem; color: var(--text-main);">
                                ${order.items.map(i => `${i.qty}x ${i.name}`).join(', ')}
                            </div>
                        </div>
                        <span class="order-badge status-collected">Delivered</span>
                    </div>
                `;
            });
        }
    }
}

// Past Orders Nav
window.openPastOrders = function() {
    toggleProfileMenu(); // close menu
    document.getElementById('past-orders-modal').classList.add('active');
};

window.closePastOrders = function() {
    document.getElementById('past-orders-modal').classList.remove('active');
};
