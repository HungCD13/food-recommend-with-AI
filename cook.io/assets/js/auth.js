"use strict";

/**
 * Authentication module for login and registration
 * Uses localStorage to store user data (for demo purposes)
 */

// Get users from localStorage or initialize empty array
function getUsers() {
    const users = localStorage.getItem('cookio-users');
    return users ? JSON.parse(users) : [];
}

// Save users to localStorage
function saveUsers(users) {
    localStorage.setItem('cookio-users', JSON.stringify(users));
}

// Get current logged in user
function getCurrentUser() {
    return localStorage.getItem('cookio-current-user');
}

// Set current logged in user
function setCurrentUser(email) {
    localStorage.setItem('cookio-current-user', email);
}

// Clear current user (logout)
function clearCurrentUser() {
    localStorage.removeItem('cookio-current-user');
}

// Show error message
function showError(errorElement, errorTextElement, message) {
    errorElement.style.display = 'flex';
    errorTextElement.textContent = message;
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

// Handle login form submission
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        const errorElement = document.getElementById('loginError');
        const errorTextElement = document.getElementById('loginErrorText');

        // Get users from storage
        const users = getUsers();

        // Find user by email
        const user = users.find(u => u.email === email);

        if (!user) {
            showError(errorElement, errorTextElement, 'Email not found. Please register first.');
            return;
        }

        if (user.password !== password) {
            showError(errorElement, errorTextElement, 'Incorrect password. Please try again.');
            return;
        }

        // Login successful
        setCurrentUser(email);
        
        // Show success message
        if (window.showNotification) {
            window.showNotification('Login successful! Welcome back.');
        }

        // Redirect to home page after short delay
        setTimeout(() => {
            window.location.href = './index.html';
        }, 500);
    });
}

// Handle registration form submission
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;
        const errorElement = document.getElementById('registerError');
        const errorTextElement = document.getElementById('registerErrorText');

        // Validation
        if (password.length < 6) {
            showError(errorElement, errorTextElement, 'Password must be at least 6 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            showError(errorElement, errorTextElement, 'Passwords do not match. Please try again.');
            return;
        }

        if (!agreeTerms) {
            showError(errorElement, errorTextElement, 'Please agree to the Terms and Conditions.');
            return;
        }

        // Get users from storage
        const users = getUsers();

        // Check if email already exists
        if (users.find(u => u.email === email)) {
            showError(errorElement, errorTextElement, 'Email already registered. Please sign in instead.');
            return;
        }

        // Create new user
        const newUser = {
            name: name,
            email: email,
            password: password,
            createdAt: new Date().toISOString()
        };

        // Add user to array
        users.push(newUser);

        // Save to localStorage
        saveUsers(users);

        // Set as current user
        setCurrentUser(email);

        // Show success message
        if (window.showNotification) {
            window.showNotification('Registration successful! Welcome to Cook.io.');
        }

        // Redirect to home page after short delay
        setTimeout(() => {
            window.location.href = './index.html';
        }, 500);
    });
}

// Check if user is logged in and update UI accordingly
function checkAuthStatus() {
    const currentUser = getCurrentUser();
    const headerAuth = document.getElementById('headerAuth');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (currentUser) {
        // User is logged in - hide login/register buttons, show logout button
        if (headerAuth) {
            headerAuth.classList.add('hidden');
        }
        if (logoutBtn) {
            logoutBtn.classList.remove('hidden');
        }
    } else {
        // User is not logged in - show login/register buttons, hide logout button
        if (headerAuth) {
            headerAuth.classList.remove('hidden');
        }
        if (logoutBtn) {
            logoutBtn.classList.add('hidden');
        }
    }
}

// Handle logout
function handleLogout() {
    clearCurrentUser();
    
    // Show success message
    if (window.showNotification) {
        window.showNotification('Logged out successfully');
    }
    
    // Redirect to login page
    setTimeout(() => {
        window.location.href = './login.html';
    }, 500);
}

// Add logout button event listener
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
}

// Initialize auth check on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        checkAuthStatus();
        // Re-attach logout listener after DOM loads
        const logoutBtnAfterLoad = document.getElementById('logoutBtn');
        if (logoutBtnAfterLoad) {
            logoutBtnAfterLoad.addEventListener('click', handleLogout);
        }
    });
} else {
    checkAuthStatus();
}

// Export functions for use in other modules
window.auth = {
    getCurrentUser,
    setCurrentUser,
    clearCurrentUser,
    getUsers,
    checkAuthStatus,
    handleLogout
};

