/**
 * ContextGuard - Main JavaScript
 */

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Check auth status
    checkAuthStatus();
});

/**
 * Check user authentication status
 */
async function checkAuthStatus() {
    try {
        const response = await fetch('/auth/user/status');
        const data = await response.json();
        
        updateAuthUI(data.authenticated, data);
    } catch (error) {
        console.error('Auth status check failed:', error);
    }
}

/**
 * Update auth UI based on status
 */
function updateAuthUI(isAuthenticated, userData = {}) {
    const navAuth = document.getElementById('navAuth');
    const authStatus = document.getElementById('authStatus');
    
    if (isAuthenticated) {
        // User is signed in
        navAuth.innerHTML = `
            <span class="user-email">${userData.email || 'User'}</span>
            <button class="btn btn-outline" id="signOutBtn">Sign Out</button>
        `;
        
        document.getElementById('signOutBtn')?.addEventListener('click', signOut);
        
        if (authStatus) {
            authStatus.textContent = `Signed in as ${userData.email}`;
        }
    } else {
        // User is not signed in
        navAuth.innerHTML = `
            <button class="btn btn-outline" id="signInBtn">Sign In</button>
        `;
        
        document.getElementById('signInBtn')?.addEventListener('click', showSignInModal);
        
        if (authStatus) {
            authStatus.textContent = 'Not signed in - using default settings';
        }
    }
}

/**
 * Show sign in modal (simplified - Firebase UI would be better)
 */
function showSignInModal() {
    alert('Sign in functionality will open Firebase Auth UI. This is a demo placeholder.');
    // In production, integrate Firebase UI or custom auth flow
}

/**
 * Sign out user
 */
async function signOut() {
    try {
        if (firebase.auth) {
            await firebase.auth().signOut();
        }
        
        await fetch('/auth/logout', { method: 'POST' });
        
        updateAuthUI(false);
        window.location.reload();
    } catch (error) {
        console.error('Sign out error:', error);
    }
}

/**
 * Display notification
 */
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    
    .user-email {
        padding: 8px 16px;
        background: var(--light);
        border-radius: 20px;
        font-size: 0.9rem;
    }
`;
document.head.appendChild(style);
