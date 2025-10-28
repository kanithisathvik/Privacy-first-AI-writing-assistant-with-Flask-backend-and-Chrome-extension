/**
 * ContextGuard - Overlay UI Manager
 * Creates and manages the floating button, menu, and side panel
 */

class OverlayUI {
  constructor() {
    this.fab = null;
    this.menu = null;
    this.badge = null;
    this.panel = null;
    this.isMenuOpen = false;
    this.isPanelOpen = false;
    this.currentAction = null;
    this.currentResult = null;
  }

  /**
   * Initialize the overlay UI components
   */
  init() {
    this.createFAB();
    this.createBadge();
    this.createMenu();
    this.createPanel();
    this.attachEventListeners();
  }

  /**
   * Create floating action button
   */
  createFAB() {
    this.fab = document.createElement('button');
    this.fab.id = 'contextguard-fab';
    this.fab.innerHTML = '⚡';
    this.fab.title = 'ContextGuard AI Assistant';
    this.fab.setAttribute('aria-label', 'Open ContextGuard AI Assistant');
    document.body.appendChild(this.fab);
  }

  /**
   * Create privacy badge
   */
  createBadge() {
    this.badge = document.createElement('div');
    this.badge.id = 'contextguard-badge';
    this.badge.innerHTML = '🔒 Runs locally';
    this.badge.title = 'Your data never leaves your device';
    document.body.appendChild(this.badge);
  }

  /**
   * Create action menu
   */
  createMenu() {
    this.menu = document.createElement('div');
    this.menu.id = 'contextguard-menu';
    this.menu.innerHTML = `
      <div class="contextguard-menu-item" data-action="summarize">
        <span class="icon">📝</span>
        <span>Summarize</span>
      </div>
      <div class="contextguard-menu-item" data-action="rewrite">
        <span class="icon">✍️</span>
        <span>Rewrite</span>
      </div>
      <div class="contextguard-menu-item" data-action="proofread">
        <span class="icon">✅</span>
        <span>Proofread</span>
      </div>
      <div class="contextguard-menu-item" data-action="translate">
        <span class="icon">🌐</span>
        <span>Translate</span>
      </div>
      <div class="contextguard-menu-divider"></div>
      <div class="contextguard-menu-item" data-action="settings">
        <span class="icon">⚙️</span>
        <span>Settings</span>
      </div>
    `;
    document.body.appendChild(this.menu);
  }

  /**
   * Create side panel
   */
  createPanel() {
    this.panel = document.createElement('div');
    this.panel.id = 'contextguard-sidepanel';
    this.panel.innerHTML = `
      <div class="contextguard-panel-header">
        <h2>ContextGuard</h2>
        <button class="contextguard-close-btn" aria-label="Close panel">×</button>
      </div>
      <div class="contextguard-panel-content">
        <div class="contextguard-loading">
          <div class="contextguard-spinner"></div>
          <p>Processing...</p>
        </div>
      </div>
      <div class="contextguard-panel-actions">
        <button class="contextguard-btn contextguard-btn-secondary" id="contextguard-copy-btn">
          Copy
        </button>
        <button class="contextguard-btn contextguard-btn-primary" id="contextguard-apply-btn">
          Apply
        </button>
      </div>
    `;
    document.body.appendChild(this.panel);
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // FAB click - toggle menu
    this.fab.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMenu();
    });

    // Menu item clicks
    this.menu.querySelectorAll('.contextguard-menu-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = item.dataset.action;
        this.handleAction(action);
      });
    });

    // Close panel button
    this.panel.querySelector('.contextguard-close-btn').addEventListener('click', () => {
      this.closePanel();
    });

    // Copy button
    document.getElementById('contextguard-copy-btn').addEventListener('click', () => {
      this.copyResult();
    });

    // Apply button
    document.getElementById('contextguard-apply-btn').addEventListener('click', () => {
      this.applyResult();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && !this.menu.contains(e.target) && e.target !== this.fab) {
        this.closeMenu();
      }
    });

    // Escape key closes panel
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isPanelOpen) {
        this.closePanel();
      }
    });
  }

  /**
   * Toggle menu visibility
   */
  toggleMenu() {
    if (this.isMenuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  /**
   * Open menu
   */
  openMenu() {
    this.menu.classList.add('show');
    this.badge.classList.add('show');
    this.isMenuOpen = true;
  }

  /**
   * Close menu
   */
  closeMenu() {
    this.menu.classList.remove('show');
    this.badge.classList.remove('show');
    this.isMenuOpen = false;
  }

  /**
   * Handle action selection
   */
  handleAction(action) {
    this.closeMenu();

    if (action === 'settings') {
      chrome.runtime.sendMessage({ type: 'OPEN_OPTIONS' });
      return;
    }

    this.currentAction = action;
    this.openPanel();
    this.showLoading(`${this.capitalizeFirst(action)}ing...`);

    // Dispatch to content script for processing
    window.postMessage({
      type: 'CONTEXTGUARD_ACTION',
      action: action
    }, '*');
  }

  /**
   * Open side panel
   */
  openPanel() {
    this.panel.classList.add('show');
    this.isPanelOpen = true;
  }

  /**
   * Close side panel
   */
  closePanel() {
    this.panel.classList.remove('show');
    this.isPanelOpen = false;
    this.currentResult = null;
  }

  /**
   * Show loading state
   */
  showLoading(message = 'Processing...') {
    const content = this.panel.querySelector('.contextguard-panel-content');
    content.innerHTML = `
      <div class="contextguard-loading">
        <div class="contextguard-spinner"></div>
        <p>${message}</p>
      </div>
    `;

    // Disable action buttons
    this.setActionButtonsState(true);
  }

  /**
   * Show result
   */
  showResult(result, action) {
    this.currentResult = result;
    
    const content = this.panel.querySelector('.contextguard-panel-content');
    content.innerHTML = `
      <div class="contextguard-result">${this.escapeHtml(result)}</div>
      <p style="color: #666; font-size: 12px; margin-top: 8px;">
        <strong>${this.capitalizeFirst(action)}</strong> completed using Chrome's built-in AI.
      </p>
    `;

    // Enable action buttons
    this.setActionButtonsState(false);
  }

  /**
   * Show error
   */
  showError(message) {
    const content = this.panel.querySelector('.contextguard-panel-content');
    content.innerHTML = `
      <div class="contextguard-error">
        <strong>⚠️ Error</strong><br>
        ${this.escapeHtml(message)}
      </div>
      <p style="color: #666; font-size: 12px;">
        This might happen if Chrome's AI features are not yet available on your device.
        Try updating Chrome or check chrome://flags for AI features.
      </p>
    `;

    // Disable action buttons
    this.setActionButtonsState(true);
  }

  /**
   * Copy result to clipboard
   */
  async copyResult() {
    if (!this.currentResult) return;

    try {
      await navigator.clipboard.writeText(this.currentResult);
      this.showNotification('✓ Copied to clipboard');
    } catch (error) {
      this.showNotification('✗ Failed to copy', true);
    }
  }

  /**
   * Apply result (send to content script)
   */
  applyResult() {
    if (!this.currentResult) return;

    window.postMessage({
      type: 'CONTEXTGUARD_APPLY',
      result: this.currentResult
    }, '*');

    this.showNotification('✓ Applied');
    setTimeout(() => this.closePanel(), 1000);
  }

  /**
   * Show temporary notification
   */
  showNotification(message, isError = false) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 24px;
      right: 24px;
      background: ${isError ? '#fee' : '#efe'};
      color: ${isError ? '#c33' : '#363'};
      padding: 12px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      animation: slideDown 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  /**
   * Set action buttons enabled/disabled state
   */
  setActionButtonsState(disabled) {
    document.getElementById('contextguard-copy-btn').disabled = disabled;
    document.getElementById('contextguard-apply-btn').disabled = disabled;
  }

  /**
   * Utility: Capitalize first letter
   */
  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Utility: Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Clean up (remove all elements)
   */
  destroy() {
    this.fab?.remove();
    this.menu?.remove();
    this.badge?.remove();
    this.panel?.remove();
  }
}

// Export for use in content script
window.OverlayUI = OverlayUI;
