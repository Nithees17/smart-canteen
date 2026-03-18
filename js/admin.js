// js/admin.js - Admin Dashboard Logic

let currentUser = null;

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
    if (currentUser.role !== 'admin') {
        window.location.href = 'index.html';
        return;
    }
    
    document.getElementById('admin-greeting').innerText = `Welcome, Staff [${currentUser.staffId}]`;
    
    // Initial Render
    renderOrders();
    renderMenu();
    renderStats();

    // Listen to changes from Students (simulated real-time)
    window.addEventListener('storage', (e) => {
        if (e.key === 'scms_orders' || e.key === 'scms_sales_report') {
            renderOrders();
            renderStats();
        }
    });

    // Handle Menu Form Submit
    document.getElementById('menu-form').addEventListener('submit', handleMenuSubmit);
});

window.logout = function() {
    sessionStorage.removeItem('scms_current_user');
    window.location.href = 'index.html';
};

// Tabs
window.switchTab = function(tabName) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    document.getElementById(`tab-${tabName}`).classList.add('active');
    document.getElementById(`content-${tabName}`).classList.add('active');
};

// --- ORDERS MANAGEMENT ---

function renderOrders() {
    const container = document.getElementById('admin-orders-container');
    const allOrders = window.db.getOrders()
        .sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)); // Newest first

    if (allOrders.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted);">No orders yet.</p>';
        return;
    }

    container.innerHTML = '';
    
    allOrders.forEach(order => {
        const time = new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        let actionButtons = '';
        if (order.status === 'ordered') {
            actionButtons = `<button class="btn btn-primary" style="width: 100%; border-radius: 8px; padding: 0.5rem;" onclick="updateOrderStatus('${order.id}', 'preparing')"><i class="fa-solid fa-fire-burner"></i> Start Preparing</button>`;
        } else if (order.status === 'preparing') {
            actionButtons = `<button class="btn btn-success" style="width: 100%; border-radius: 8px; padding: 0.5rem;" onclick="updateOrderStatus('${order.id}', 'ready')"><i class="fa-solid fa-bell-concierge"></i> Mark Ready</button>`;
        } else if (order.status === 'ready') {
            actionButtons = `<button class="btn" style="width: 100%; border-radius: 8px; padding: 0.5rem; background: var(--primary-color); color: white;" onclick="promptCollectOtp('${order.id}')"><i class="fa-solid fa-hand-holding-hand"></i> Mark Collected</button>`;
        } else {
            actionButtons = `<button class="btn" style="width: 100%; border-radius: 8px; padding: 0.5rem; background: #e2e8f0; color: #475569; pointer-events: none;"><i class="fa-solid fa-check-double"></i> Collected</button>`;
        }

        container.innerHTML += `
            <div class="order-card fade-in">
                <div class="order-header">
                    <div>
                        <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary-color);">TOKEN #${order.tokenNumber}</div>
                        <div style="font-size: 0.85rem; color: var(--text-muted);">${order.userName} (${order.userRoll})</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">${time}</div>
                    </div>
                    <span class="order-status-badge order-status-${order.status}">${order.status}</span>
                </div>
                
                <div style="font-size: 0.95rem; line-height: 1.5;">
                    ${order.items.map(i => `
                        <div style="display: flex; justify-content: space-between;">
                            <span>${i.qty}x ${i.name}</span>
                            <span style="color: var(--text-muted);">₹${i.price * i.qty}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div style="text-align: right; font-weight: 800; font-size: 1.1rem; border-top: 1px dashed rgba(0,0,0,0.1); padding-top: 0.5rem;">
                    Total: ₹${order.totalAmount}
                </div>
                
                <div class="order-actions">
                    ${actionButtons}
                </div>
            </div>
        `;
    });
}

window.updateOrderStatus = function(orderId, newStatus) {
    const orders = window.db.getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        // Generate Collection OTP when transitioning to 'ready'
        if (newStatus === 'ready' && !orders[orderIndex].collectionOtp) {
            orders[orderIndex].collectionOtp = Math.floor(1000 + Math.random() * 9000).toString();
        }

        orders[orderIndex].status = newStatus;
        window.db.saveOrders(orders);
        renderOrders();
        showToast(`Order #${orders[orderIndex].tokenNumber} marked as ${newStatus}`);
    }
};

let currentCollectingOrderId = null;

window.promptCollectOtp = function(orderId) {
    currentCollectingOrderId = orderId;
    document.getElementById('collect-otp-input').value = '';
    document.getElementById('otp-modal').classList.add('active');
};

window.closeOtpModal = function() {
    currentCollectingOrderId = null;
    document.getElementById('otp-modal').classList.remove('active');
};

window.verifyCollectOtp = function() {
    const inputOtp = document.getElementById('collect-otp-input').value;
    if (!inputOtp || inputOtp.length !== 4) {
        showToast('Please enter a valid 4-digit OTP', 'error');
        return;
    }

    const orders = window.db.getOrders();
    const order = orders.find(o => o.id === currentCollectingOrderId);
    
    if (order && order.collectionOtp === inputOtp) {
        updateOrderStatus(currentCollectingOrderId, 'collected');
        closeOtpModal();
        showToast('Order successfully collected!');
    } else {
        showToast('Incorrect OTP. Collection denied.', 'error');
    }
};

// --- MENU MANAGEMENT ---

function renderMenu() {
    const tbody = document.getElementById('admin-menu-table');
    const menu = window.db.getMenu();

    tbody.innerHTML = '';
    
    menu.forEach(item => {
        const toggleClass = item.available ? 'btn-success' : 'btn-secondary';
        const toggleText = item.available ? 'Available' : 'Unavailable';
        
        tbody.innerHTML += `
            <tr class="fade-in">
                <td><img src="${item.image}" alt="${item.name}" class="menu-item-img"></td>
                <td style="font-weight: 600;">${item.name}</td>
                <td style="text-transform: capitalize;">${item.category}</td>
                <td style="font-family: monospace; font-size: 1.1rem;">₹${item.price}</td>
                <td>
                    <span class="active-dot ${item.available}"></span> 
                    ${item.available ? 'Yes' : 'No'}
                </td>
                <td>
                    <div style="display:flex; gap: 0.5rem;">
                        <button class="btn ${toggleClass}" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="toggleAvailability('${item.id}')">
                            <i class="fa-solid fa-power-off"></i>
                        </button>
                        <button class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="editMenu('${item.id}')">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="btn" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; background: var(--danger-color); color: white;" onclick="deleteMenu('${item.id}')">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
}

window.toggleAvailability = function(id) {
    const menu = window.db.getMenu();
    const item = menu.find(i => i.id === id);
    if (item) {
        item.available = !item.available;
        window.db.saveMenu(menu);
        renderMenu();
        showToast(`Changed availability for ${item.name}`);
    }
}

window.deleteMenu = function(id) {
    if(!confirm("Are you sure you want to delete this item?")) return;
    let menu = window.db.getMenu();
    menu = menu.filter(i => i.id !== id);
    window.db.saveMenu(menu);
    renderMenu();
    showToast("Item deleted", "error");
}

// Menu Modal
window.openAddMenuModal = function() {
    document.getElementById('menu-form').reset();
    document.getElementById('menu-id').value = '';
    document.getElementById('menu-modal-title').innerText = 'Add Menu Item';
    document.getElementById('menu-modal').classList.add('active');
}

window.closeAddMenuModal = function() {
    document.getElementById('menu-modal').classList.remove('active');
}

window.editMenu = function(id) {
    const menu = window.db.getMenu();
    const item = menu.find(i => i.id === id);
    if (item) {
        document.getElementById('menu-id').value = item.id;
        document.getElementById('menu-name').value = item.name;
        document.getElementById('menu-price').value = item.price;
        document.getElementById('menu-category').value = item.category;
        document.getElementById('menu-img-url').value = item.image;
        document.getElementById('menu-avail').checked = item.available;
        document.getElementById('menu-modal-title').innerText = 'Edit Menu Item';
        document.getElementById('menu-modal').classList.add('active');
    }
}

function handleMenuSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('menu-id').value;
    const name = document.getElementById('menu-name').value;
    const price = parseInt(document.getElementById('menu-price').value);
    const category = document.getElementById('menu-category').value;
    const image = document.getElementById('menu-img-url').value;
    const available = document.getElementById('menu-avail').checked;

    let menu = window.db.getMenu();

    if (id) {
        // Edit
        const idx = menu.findIndex(i => i.id === id);
        if(idx !== -1) {
            menu[idx] = { id, name, price, category, image, available };
            showToast('Item updated successfully');
        }
    } else {
        // Add
        const newId = 'item_' + Date.now();
        menu.push({ id: newId, name, price, category, image, available });
        showToast('New item added');
    }

    window.db.saveMenu(menu);
    renderMenu();
    closeAddMenuModal();
}

// --- SALES REPORT ---

function renderStats() {
    const dateInput = document.getElementById('report-date-filter');
    
    // Set default date to today if empty
    if (!dateInput.value) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }
    
    const selectedDate = dateInput.value;
    const allOrders = window.db.getOrders();
    
    let totalRevenue = 0;
    let totalOrders = 0;
    let itemsSold = 0;

    allOrders.forEach(order => {
        // order.timestamp is an ISO string, e.g. "2026-03-12T17:00:27+05:30"
        // Convert to YYYY-MM-DD for reliable comparison
        const orderDateObj = new Date(order.timestamp);
        // We use local format parsing carefully to match the JS date input behavior
        const orderDateStr = orderDateObj.getFullYear() + '-' + String(orderDateObj.getMonth() + 1).padStart(2, '0') + '-' + String(orderDateObj.getDate()).padStart(2, '0');

        if (orderDateStr === selectedDate) {
            totalOrders += 1;
            totalRevenue += order.totalAmount;
            const orderItemCount = order.items.reduce((sum, item) => sum + item.qty, 0);
            itemsSold += orderItemCount;
        }
    });

    document.getElementById('stats-revenue').innerText = `₹${totalRevenue.toLocaleString()}`;
    document.getElementById('stats-orders').innerText = totalOrders.toLocaleString();
    document.getElementById('stats-items').innerText = itemsSold.toLocaleString();
}
