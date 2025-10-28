/**
 * ContextGuard - Content Script
 * Main orchestrator for the extension's page-level functionality
 */

(function() {
  'use strict';

  // Initialize components
  const domSelection = new DOMSelection();
  const overlayUI = new OverlayUI();

  // Current operation context
  let currentContext = null;

  /**
   * Initialize the extension on page load
   */
  function init() {
    overlayUI.init();
    setupMessageListeners();
    setupContextMenus();
    console.log('ContextGuard: Initialized on', window.location.href);
  }

  /**
   * Setup message listeners for communication
   */
  function setupMessageListeners() {
    // Listen for messages from overlay UI
    window.addEventListener('message', (event) => {
      // Only accept messages from same window
      if (event.source !== window) return;

      const { type, action, result } = event.data;

      if (type === 'CONTEXTGUARD_ACTION') {
        handleAction(action);
      } else if (type === 'CONTEXTGUARD_APPLY') {
        applyResult(result);
      }
    });

    // Listen for messages from service worker
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'AI_RESULT') {
        overlayUI.showResult(message.result, message.action);
      } else if (message.type === 'AI_ERROR') {
        overlayUI.showError(message.error);
      }
      return true;
    });
  }

  /**
   * Setup context menus (triggered from service worker)
   */
  function setupContextMenus() {
    // Context menus are created in service worker, but we handle responses here
    document.addEventListener('contextmenu', (e) => {
      // Store the clicked element for potential AI operations
      if (e.target.tagName === 'IMG') {
        currentContext = {
          type: 'image',
          element: e.target,
          data: domSelection.getImageContext(e.target)
        };
      }
    });
  }

  /**
   * Handle AI action request
   */
  async function handleAction(action) {
    try {
      // Get selection or context
      const context = domSelection.getSelectionOrContext();
      currentContext = context;

      if (!context.text || context.text.length < 10) {
        overlayUI.showError('Not enough content to process. Please select text or navigate to a page with content.');
        return;
      }

      // Get user preferences
      const preferences = await getPreferences();

      // Send to service worker for AI processing
      chrome.runtime.sendMessage({
        type: 'PROCESS_AI',
        action: action,
        text: context.text,
        preferences: preferences,
        hasSelection: context.hasSelection
      });

    } catch (error) {
      console.error('ContextGuard: Action failed', error);
      overlayUI.showError('Failed to process request. Please try again.');
    }
  }

  /**
   * Apply result to selection
   */
  function applyResult(result) {
    if (!currentContext || !currentContext.hasSelection) {
      overlayUI.showError('Cannot apply: No text was selected. Use Copy instead.');
      return;
    }

    const success = domSelection.replaceSelection(result);
    
    if (success) {
      overlayUI.showNotification('✓ Text replaced successfully');
    } else {
      overlayUI.showNotification('✗ Failed to apply changes', true);
    }

    // Clear context
    currentContext = null;
    domSelection.clearSelection();
  }

  /**
   * Get user preferences from storage
   */
  async function getPreferences() {
    return new Promise((resolve) => {
      chrome.storage.local.get({
        tone: 'neutral',
        readingLevel: 'intermediate',
        targetLanguage: 'es'
      }, (items) => {
        resolve(items);
      });
    });
  }

  /**
   * Handle context menu actions (from service worker)
   */
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'CONTEXT_MENU_ACTION') {
      handleContextMenuAction(message.action);
    }
  });

  /**
   * Handle context menu specific actions
   */
  async function handleContextMenuAction(action) {
    if (action === 'generateAltText' && currentContext?.type === 'image') {
      overlayUI.openPanel();
      overlayUI.showLoading('Generating alt text...');

      const preferences = await getPreferences();

      chrome.runtime.sendMessage({
        type: 'PROCESS_AI',
        action: 'generateAlt',
        imageData: currentContext.data,
        preferences: preferences
      });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    overlayUI.destroy();
  });

})();
