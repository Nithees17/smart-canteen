// js/auth.js - Authentication Logic

// Utility for showing toasts
window.showToast = function(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = type === 'success' ? '<i class="fa-solid fa-circle-check" style="color:var(--success-color)"></i>' : '<i class="fa-solid fa-circle-exclamation" style="color:var(--danger-color)"></i>';
    
    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);
    
    // Auto remove after 3s
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// Toggle between Student Login and Register forms
window.switchStudentTab = function(tab) {
    const loginForm = document.getElementById('student-login-form');
    const registerForm = document.getElementById('student-register-form');
    const btnLogin = document.getElementById('tab-student-login');
    const btnRegister = document.getElementById('tab-student-register');

    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        btnLogin.classList.add('active');
        btnRegister.classList.remove('active');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        btnLogin.classList.remove('active');
        btnRegister.classList.add('active');
    }
};

// Prevent back button issues if logged in
document.addEventListener('DOMContentLoaded', () => {
    try {
        const userStr = sessionStorage.getItem('scms_current_user');
        if (userStr) {
            const currentUser = JSON.parse(userStr);
            if (currentUser) {
                if (currentUser.role === 'admin') window.location.href = 'admin.html';
                else window.location.href = 'student.html';
            }
        }
    } catch (e) {
        console.error('Error parsing user session:', e);
        sessionStorage.removeItem('scms_current_user');
    }
});

// Student Registration
document.getElementById('student-register-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const roll = document.getElementById('reg-roll').value.trim().toUpperCase();
    const pass = document.getElementById('reg-pass').value;

    let users = window.db.getUsers();
    
    if (users.find(u => u.rollNo === roll)) {
        showToast('Roll Number already registered!', 'error');
        return;
    }

    const newUser = {
        id: 'user_' + Date.now(),
        name,
        rollNo: roll,
        password: pass,
        role: 'student'
    };

    users.push(newUser);
    window.db.saveUsers(users);
    
    showToast('Registration successful! Logging in...');
    setTimeout(() => {
        sessionStorage.setItem('scms_current_user', JSON.stringify(newUser));
        window.location.href = 'student.html';
    }, 1000);
});

// Student Login
document.getElementById('student-login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const roll = document.getElementById('login-roll').value.trim().toUpperCase();
    const pass = document.getElementById('login-pass').value;

    const users = window.db.getUsers();
    const user = users.find(u => u.rollNo === roll && u.password === pass && u.role === 'student');

    if (user) {
        showToast('Login successful!');
        sessionStorage.setItem('scms_current_user', JSON.stringify(user));
        setTimeout(() => window.location.href = 'student.html', 800);
    } else {
        showToast('Invalid Roll Number or Password', 'error');
    }
});

// Admin Login
document.getElementById('admin-login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const staffId = document.getElementById('admin-id').value.trim();
    const pass = document.getElementById('admin-pass').value;

    const users = window.db.getUsers();
    // In our seed data, rollNo is used for students, staffId for admins. 
    // Data seed had staffId: 'ADMIN'
    const admin = users.find(u => u.staffId === staffId && u.password === pass && u.role === 'admin');

    if (admin) {
        showToast('Welcome back, Admin!');
        sessionStorage.setItem('scms_current_user', JSON.stringify(admin));
        setTimeout(() => window.location.href = 'admin.html', 800);
    } else {
        showToast('Invalid Staff ID or Password', 'error');
    }
});
