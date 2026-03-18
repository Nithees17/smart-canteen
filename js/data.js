// data.js - Handles local storage logic and initial seed data

const SEED_DATA = [
    // --- SNACKS (12 ITEMS) ---
    { id: 's1', name: 'Samosa', price: 15, category: 'snacks', available: true, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 's2', name: 'Vada', price: 10, category: 'snacks', available: true, image: 'https://images.unsplash.com/photo-1589301773822-7775bfa60ebf?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 's3', name: 'Onion Bonda', price: 12, category: 'snacks', available: true, image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 's4', name: 'Veg Puff', price: 20, category: 'snacks', available: true, image: 'https://images.unsplash.com/photo-1628198758804-94c3d115e51d?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 's5', name: 'Egg Puff', price: 25, category: 'snacks', available: true, image: 'https://images.unsplash.com/photo-1632778149955-e71f9f257bf8?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 's6', name: 'Cutlet', price: 15, category: 'snacks', available: true, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 's7', name: 'Banana Bajji', price: 10, category: 'snacks', available: true, image: 'https://images.unsplash.com/photo-1541592102775-7c00e6231d87?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 's8', name: 'Potato Chips', price: 20, category: 'snacks', available: true, image: 'https://images.unsplash.com/photo-1566478989037-eadebbce90f4?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 's9', name: 'French Fries', price: 40, category: 'snacks', available: true, image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 's10', name: 'Onion Pakoda', price: 25, category: 'snacks', available: true, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 's11', name: 'Spring Roll', price: 30, category: 'snacks', available: true, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 's12', name: 'Veg Sandwich', price: 35, category: 'snacks', available: true, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=200&h=200' },

    // --- FOOD (12 ITEMS) ---
    { id: 'f1', name: 'Veg Meals', price: 60, category: 'food', available: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'f2', name: 'Chicken Biryani', price: 120, category: 'food', available: true, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'f3', name: 'Veg Biryani', price: 80, category: 'food', available: true, image: 'https://images.unsplash.com/photo-1589301773812-32a22ba359f4?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'f4', name: 'Chapati (2 pcs)', price: 30, category: 'food', available: true, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'f5', name: 'Parotta (2 pcs)', price: 40, category: 'food', available: true, image: 'https://images.unsplash.com/photo-1626074961596-fdd28b5eecb2?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'f6', name: 'Masala Dosa', price: 50, category: 'food', available: true, image: 'https://images.unsplash.com/photo-1605333396593-3ea3391d7ef4?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'f7', name: 'Idli (3 pcs)', price: 30, category: 'food', available: true, image: 'https://images.unsplash.com/photo-1589301773822-7775bfa60ebf?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'f8', name: 'Ghee Pongal', price: 45, category: 'food', available: true, image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'f9', name: 'Poori (3 pcs)', price: 40, category: 'food', available: true, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'f10', name: 'Veg Fried Rice', price: 70, category: 'food', available: true, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'f11', name: 'Egg Noodles', price: 80, category: 'food', available: true, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'f12', name: 'Lemon Rice', price: 45, category: 'food', available: true, image: 'https://images.unsplash.com/photo-1604152135912-00a2024b1f63?auto=format&fit=crop&q=80&w=200&h=200' },

    // --- DRINKS (12 ITEMS) ---
    { id: 'd1', name: 'Tea', price: 15, category: 'drinks', available: true, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'd2', name: 'Filter Coffee', price: 20, category: 'drinks', available: true, image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'd3', name: 'Hot Milk', price: 20, category: 'drinks', available: true, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'd4', name: 'Rose Milk', price: 35, category: 'drinks', available: true, image: 'https://images.unsplash.com/photo-1517093602195-b40af9688b46?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'd5', name: 'Badam Milk', price: 40, category: 'drinks', available: true, image: 'https://images.unsplash.com/photo-1514748119043-4a1b02b54546?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'd6', name: 'Fresh Lemon Juice', price: 25, category: 'drinks', available: true, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'd7', name: 'Apple Juice', price: 50, category: 'drinks', available: true, image: 'https://images.unsplash.com/photo-1598614187854-26a60e982dc4?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'd8', name: 'Grape Juice', price: 45, category: 'drinks', available: true, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451b62?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'd9', name: 'Mango Juice', price: 50, category: 'drinks', available: true, image: 'https://images.unsplash.com/photo-1622485579974-968b5558d04a?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'd10', name: 'Orange Juice', price: 45, category: 'drinks', available: true, image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'd11', name: 'Water Bottle (1L)', price: 20, category: 'drinks', available: true, image: 'https://images.unsplash.com/photo-1605349774133-fb1ecde88fc9?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'd12', name: 'Coca Cola', price: 40, category: 'drinks', available: true, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=200&h=200' },

    // --- BISCUITS (12 ITEMS) ---
    { id: 'b1', name: 'Marie Gold', price: 10, category: 'biscuits', available: true, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'b2', name: 'Good Day', price: 20, category: 'biscuits', available: true, image: 'https://images.unsplash.com/photo-1557089706-68fbabd836e5?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'b3', name: 'Oreo', price: 30, category: 'biscuits', available: true, image: 'https://images.unsplash.com/photo-1556910110-a5a63dfd393c?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'b4', name: 'Bourbon', price: 20, category: 'biscuits', available: true, image: 'https://images.unsplash.com/photo-1605927546416-d3a98ec510d9?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'b5', name: 'Milk Bikis', price: 15, category: 'biscuits', available: true, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'b6', name: '50-50 Sweet & Salty', price: 10, category: 'biscuits', available: true, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'b7', name: 'Krack Jack', price: 10, category: 'biscuits', available: true, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'b8', name: 'Hide & Seek', price: 30, category: 'biscuits', available: true, image: 'https://images.unsplash.com/photo-1605927546416-d3a98ec510d9?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'b9', name: 'Dark Fantasy', price: 35, category: 'biscuits', available: true, image: 'https://images.unsplash.com/photo-1605927546416-d3a98ec510d9?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'b10', name: 'Nutri Choice Oats', price: 25, category: 'biscuits', available: true, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'b11', name: 'Anmol Dream Lite', price: 15, category: 'biscuits', available: true, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'b12', name: 'Cream Cracker', price: 20, category: 'biscuits', available: true, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=200&h=200' }
];

// Initialize local storage if empty
function initializeDatabase() {
    if (!localStorage.getItem('scms_menu')) {
        localStorage.setItem('scms_menu', JSON.stringify(SEED_DATA));
    }
    if (!localStorage.getItem('scms_users')) {
        // Create default admin
        const users = [
            { id: 'admin1', name: 'Admin Staff', staffId: 'ADMIN', password: 'admin', role: 'admin' }
        ];
        localStorage.setItem('scms_users', JSON.stringify(users));
    }
    if (!localStorage.getItem('scms_orders')) {
        localStorage.setItem('scms_orders', JSON.stringify([]));
    }
    if (!localStorage.getItem('scms_sales_report')) {
        localStorage.setItem('scms_sales_report', JSON.stringify({
            totalOrders: 0,
            revenue: 0,
            itemsSold: 0
        }));
    }
}

// Global functions for DB access
window.db = {
    getMenu: () => JSON.parse(localStorage.getItem('scms_menu') || '[]'),
    getMenuByCategory: (category) => window.db.getMenu().filter(i => i.category === category),
    saveMenu: (m) => localStorage.setItem('scms_menu', JSON.stringify(m)),
    
    getUsers: () => JSON.parse(localStorage.getItem('scms_users') || '[]'),
    saveUsers: (u) => localStorage.setItem('scms_users', JSON.stringify(u)),
    
    getOrders: () => JSON.parse(localStorage.getItem('scms_orders') || '[]'),
    saveOrders: (o) => {
        localStorage.setItem('scms_orders', JSON.stringify(o));
        window.dispatchEvent(new Event('ordersUpdated'));
    },
    
    getSalesReport: () => JSON.parse(localStorage.getItem('scms_sales_report') || '{}'),
    updateSalesReport: (orderTotal, itemCount) => {
        let stats = window.db.getSalesReport();
        stats.totalOrders += 1;
        stats.revenue += orderTotal;
        stats.itemsSold += itemCount;
        localStorage.setItem('scms_sales_report', JSON.stringify(stats));
    },

    clearDB: () => localStorage.clear()
};

// Auto initialize on load
initializeDatabase();
