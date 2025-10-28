/**
 * ContextGuard - Quick Actions Floating Toolbar
 * Shows contextual actions on text selection
 */

let quickActionsBar = null;
let selectedText = '';

/**
 * Initialize quick actions toolbar
 */
function initQuickActions() {
    // Create the toolbar element
    quickActionsBar = document.createElement('div');
    quickActionsBar.id = 'quickActionsBar';
    quickActionsBar.className = 'quick-actions-bar hidden';
    quickActionsBar.innerHTML = `
        <div class="quick-actions-content">
            <button class="quick-action-btn" data-action="summarize" title="Summarize">
                📝 Summarize
            </button>
            <button class="quick-action-btn" data-action="rewrite" title="Rewrite">
                ✏️ Rewrite
            </button>
            <button class="quick-action-btn" data-action="proofread" title="Proofread">
                ✓ Proofread
            </button>
            <button class="quick-action-btn" data-action="translate" title="Translate">
                🌐 Translate
            </button>
            <button class="quick-action-btn" data-action="eli5" title="Explain Like I'm 5">
                🎓 ELI5
            </button>
            <div class="quick-actions-divider"></div>
            <button class="quick-action-btn quick-action-close" title="Close">
                ✕
            </button>
        </div>
    `;
    
    document.body.appendChild(quickActionsBar);
    
    // Add click handlers
    quickActionsBar.querySelectorAll('.quick-action-btn[data-action]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const action = btn.dataset.action;
            handleQuickAction(action);
        });
    });
    
    // Close button
    quickActionsBar.querySelector('.quick-action-close').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        hideQuickActions();
    });
    
    // Text selection handler
    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('touchend', handleTextSelection);
    
    // Hide on scroll or click outside
    document.addEventListener('scroll', hideQuickActions, true);
    document.addEventListener('click', (e) => {
        if (!quickActionsBar.contains(e.target)) {
            hideQuickActions();
        }
    });
}

/**
 * Handle text selection
 */
function handleTextSelection(e) {
    // Small delay to ensure selection is complete
    setTimeout(() => {
        const selection = window.getSelection();
        const text = selection.toString().trim();
        
        // Only show if text is selected and not in the toolbar itself
        if (text && text.length > 10 && !quickActionsBar.contains(e.target)) {
            selectedText = text;
            showQuickActions(e.clientX, e.clientY);
        } else if (!text) {
            hideQuickActions();
        }
    }, 10);
}

/**
 * Show quick actions toolbar
 */
function showQuickActions(x, y) {
    const toolbar = quickActionsBar;
    
    // Position the toolbar
    toolbar.style.left = `${x}px`;
    toolbar.style.top = `${y - 60}px`; // Show above the selection
    
    // Show the toolbar
    toolbar.classList.remove('hidden');
    toolbar.classList.add('visible');
    
    // Adjust position if it goes off screen
    setTimeout(() => {
        const rect = toolbar.getBoundingClientRect();
        
        // Check right edge
        if (rect.right > window.innerWidth) {
            toolbar.style.left = `${window.innerWidth - rect.width - 10}px`;
        }
        
        // Check left edge
        if (rect.left < 0) {
            toolbar.style.left = '10px';
        }
        
        // Check top edge
        if (rect.top < 0) {
            toolbar.style.top = `${y + 30}px`; // Show below instead
        }
    }, 0);
}

/**
 * Hide quick actions toolbar
 */
function hideQuickActions() {
    if (quickActionsBar) {
        quickActionsBar.classList.remove('visible');
        quickActionsBar.classList.add('hidden');
    }
}

/**
 * Handle quick action
 */
async function handleQuickAction(action) {
    hideQuickActions();
    
    // If we're on the dashboard page, use the existing functionality
    if (typeof selectAction === 'function' && typeof inputText !== 'undefined') {
        inputText.value = selectedText;
        selectAction(action);
        
        // Scroll to dashboard
        document.querySelector('.actions-grid')?.scrollIntoView({ behavior: 'smooth' });
        
        // Update character count
        if (typeof updateCharCount === 'function') {
            updateCharCount();
        }
        
        // Trigger validation
        if (typeof validateInput === 'function') {
            validateInput();
        }
        
    } else {
        // On other pages, redirect to dashboard with the action
        sessionStorage.setItem('contextguard_quick_action', action);
        sessionStorage.setItem('contextguard_quick_text', selectedText);
        window.location.href = '/dashboard';
    }
}

/**
 * Check for quick action from other pages
 */
function checkQuickActionRedirect() {
    const action = sessionStorage.getItem('contextguard_quick_action');
    const text = sessionStorage.getItem('contextguard_quick_text');
    
    if (action && text) {
        // Clear the stored data
        sessionStorage.removeItem('contextguard_quick_action');
        sessionStorage.removeItem('contextguard_quick_text');
        
        // Execute the action
        setTimeout(() => {
            if (typeof inputText !== 'undefined') {
                inputText.value = text;
                selectAction(action);
                
                if (typeof updateCharCount === 'function') {
                    updateCharCount();
                }
                if (typeof validateInput === 'function') {
                    validateInput();
                }
            }
        }, 100);
    }
}

// Add styles for quick actions bar
const quickActionsStyle = document.createElement('style');
quickActionsStyle.textContent = `
    .quick-actions-bar {
        position: fixed;
        z-index: 9999;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.1);
        padding: 0.5rem;
        transition: opacity 0.2s ease, transform 0.2s ease;
        pointer-events: auto;
    }
    
    .quick-actions-bar.hidden {
        opacity: 0;
        transform: translateY(-10px);
        pointer-events: none;
    }
    
    .quick-actions-bar.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .quick-actions-content {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    
    .quick-action-btn {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.5rem 0.75rem;
        background: transparent;
        border: none;
        border-radius: 6px;
        font-size: 0.85rem;
        color: #333;
        cursor: pointer;
        transition: background 0.2s ease;
        white-space: nowrap;
    }
    
    .quick-action-btn:hover {
        background: #f8f9fa;
    }
    
    .quick-action-btn:active {
        background: #e9ecef;
    }
    
    .quick-actions-divider {
        width: 1px;
        height: 24px;
        background: #e0e0e0;
        margin: 0 0.25rem;
    }
    
    .quick-action-close {
        color: #999;
        padding: 0.5rem;
    }
    
    .quick-action-close:hover {
        color: #333;
        background: #ffebee;
    }
    
    /* Arrow pointing to selection */
    .quick-actions-bar::after {
        content: '';
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid white;
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
        .quick-action-btn {
            padding: 0.5rem;
            font-size: 0.8rem;
        }
        
        .quick-action-btn span {
            display: none;
        }
        
        .quick-actions-bar {
            padding: 0.25rem;
        }
    }
`;
document.head.appendChild(quickActionsStyle);

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuickActions);
} else {
    initQuickActions();
}

// Check for redirected quick action
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkQuickActionRedirect);
} else {
    checkQuickActionRedirect();
}
