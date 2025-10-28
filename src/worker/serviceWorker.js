/**
 * ContextGuard - Service Worker
 * Orchestrates AI operations and manages extension lifecycle
 */

// Import AI adapters (in service worker context, we need to use importScripts)
importScripts('aiAdapters.js');

const aiAdapters = new AIAdapters();

/**
 * Extension installation
 */
chrome.runtime.onInstalled.addListener((details) => {
  console.log('ContextGuard installed:', details.reason);

  // Set default preferences
  chrome.storage.local.set({
    tone: 'neutral',
    readingLevel: 'intermediate',
    targetLanguage: 'es'
  });

  // Create context menus
  createContextMenus();
});

/**
 * Create context menu items
 */
function createContextMenus() {
  // Remove existing menus
  chrome.contextMenus.removeAll(() => {
    // Add context menu for images
    chrome.contextMenus.create({
      id: 'contextguard-alt-text',
      title: 'Generate Alt Text',
      contexts: ['image']
    });

    // Add context menu for selected text
    chrome.contextMenus.create({
      id: 'contextguard-summarize',
      title: 'Summarize with ContextGuard',
      contexts: ['selection']
    });

    chrome.contextMenus.create({
      id: 'contextguard-rewrite',
      title: 'Rewrite with ContextGuard',
      contexts: ['selection']
    });

    chrome.contextMenus.create({
      id: 'contextguard-proofread',
      title: 'Proofread with ContextGuard',
      contexts: ['selection']
    });

    chrome.contextMenus.create({
      id: 'contextguard-translate',
      title: 'Translate with ContextGuard',
      contexts: ['selection']
    });
  });
}

/**
 * Handle context menu clicks
 */
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const action = info.menuItemId.replace('contextguard-', '');
  
  if (action === 'alt-text') {
    // Send message to content script to handle image
    chrome.tabs.sendMessage(tab.id, {
      type: 'CONTEXT_MENU_ACTION',
      action: 'generateAltText'
    });
  } else {
    // For text operations, process the selected text directly
    if (info.selectionText) {
      processAIRequest(tab.id, {
        action: action.replace('-text', ''),
        text: info.selectionText,
        preferences: {},
        hasSelection: true
      });
    }
  }
});

/**
 * Handle messages from content scripts
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PROCESS_AI') {
    processAIRequest(sender.tab.id, message);
    return true; // Keep channel open for async response
  }

  if (message.type === 'OPEN_OPTIONS') {
    chrome.runtime.openOptionsPage();
    return true;
  }

  if (message.type === 'GET_AI_STATUS') {
    aiAdapters.getStatus().then(status => {
      sendResponse(status);
    });
    return true;
  }
});

/**
 * Process AI request
 */
async function processAIRequest(tabId, request) {
  const { action, text, imageData, preferences, hasSelection } = request;

  try {
    let result;

    // Get preferences from storage
    const prefs = await chrome.storage.local.get({
      tone: 'neutral',
      readingLevel: 'intermediate',
      targetLanguage: 'es'
    });

    // Merge with request preferences
    const options = { ...prefs, ...preferences };

    // Route to appropriate AI adapter
    switch (action) {
      case 'summarize':
        result = await aiAdapters.summarize(text, options);
        break;

      case 'rewrite':
        result = await aiAdapters.rewrite(text, {
          tone: options.tone,
          readingLevel: options.readingLevel
        });
        break;

      case 'proofread':
        result = await aiAdapters.proofread(text, options);
        break;

      case 'translate':
        result = await aiAdapters.translate(text, options.targetLanguage, options);
        break;

      case 'generateAlt':
        result = await aiAdapters.generateAltText(imageData, options);
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // Send result back to content script
    chrome.tabs.sendMessage(tabId, {
      type: 'AI_RESULT',
      result: result,
      action: action
    });

  } catch (error) {
    console.error('AI processing error:', error);
    
    // Send error back to content script
    chrome.tabs.sendMessage(tabId, {
      type: 'AI_ERROR',
      error: error.message || 'An error occurred while processing your request.'
    });
  }
}

/**
 * Handle extension icon click
 */
chrome.action.onClicked.addListener((tab) => {
  // Open side panel
  chrome.sidePanel.open({ windowId: tab.windowId });
});

/**
 * Handle keyboard shortcuts (if defined in manifest)
 */
chrome.commands.onCommand.addListener((command) => {
  if (command === 'quick-summarize') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'QUICK_ACTION',
          action: 'summarize'
        });
      }
    });
  }
});

/**
 * Monitor AI API availability
 */
chrome.runtime.onStartup.addListener(() => {
  console.log('ContextGuard: Service worker started');
  aiAdapters.checkCapabilities();
});

// Check capabilities on install
aiAdapters.checkCapabilities().then(() => {
  console.log('ContextGuard: AI capabilities checked');
});
