// Background service worker for Chrome extension
// Handles context menu and message passing

const API_BASE_URL = 'http://127.0.0.1:5000/api';

// Create context menu items
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'check-grammar',
    title: 'Check Grammar',
    contexts: ['selection']
  });

  chrome.contextMenus.create({
    id: 'rewrite-formal',
    title: 'Rewrite (Formal)',
    contexts: ['selection']
  });

  chrome.contextMenus.create({
    id: 'rewrite-casual',
    title: 'Rewrite (Casual)',
    contexts: ['selection']
  });

  chrome.contextMenus.create({
    id: 'rewrite-concise',
    title: 'Rewrite (Concise)',
    contexts: ['selection']
  });

  chrome.contextMenus.create({
    id: 'summarize',
    title: 'Summarize',
    contexts: ['selection']
  });

  chrome.contextMenus.create({
    id: 'improve',
    title: 'Improve Text',
    contexts: ['selection']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const selectedText = info.selectionText;

  if (!selectedText) {
    return;
  }

  // Send message to content script
  chrome.tabs.sendMessage(tab.id, {
    action: 'showLoading'
  });

  // Process based on menu item
  switch (info.menuItemId) {
    case 'check-grammar':
      checkGrammar(selectedText, tab.id);
      break;
    case 'rewrite-formal':
      rewriteText(selectedText, 'formal', tab.id);
      break;
    case 'rewrite-casual':
      rewriteText(selectedText, 'casual', tab.id);
      break;
    case 'rewrite-concise':
      rewriteText(selectedText, 'concise', tab.id);
      break;
    case 'summarize':
      summarizeText(selectedText, tab.id);
      break;
    case 'improve':
      improveText(selectedText, tab.id);
      break;
  }
});

// API Functions
async function checkGrammar(text, tabId) {
  try {
    const response = await fetch(`${API_BASE_URL}/check-grammar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });

    const data = await response.json();

    if (data.success) {
      chrome.tabs.sendMessage(tabId, {
        action: 'showResult',
        type: 'grammar',
        result: data.result
      });
    } else {
      chrome.tabs.sendMessage(tabId, {
        action: 'showError',
        error: data.error || 'Failed to check grammar'
      });
    }
  } catch (error) {
    chrome.tabs.sendMessage(tabId, {
      action: 'showError',
      error: 'Failed to connect to AI service. Make sure the Flask backend is running.'
    });
  }
}

async function rewriteText(text, style, tabId) {
  try {
    const response = await fetch(`${API_BASE_URL}/rewrite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text, style })
    });

    const data = await response.json();

    if (data.success) {
      chrome.tabs.sendMessage(tabId, {
        action: 'showResult',
        type: 'rewrite',
        result: {
          original: data.original,
          text: data.rewritten,
          style: data.style
        }
      });
    } else {
      chrome.tabs.sendMessage(tabId, {
        action: 'showError',
        error: data.error || 'Failed to rewrite text'
      });
    }
  } catch (error) {
    chrome.tabs.sendMessage(tabId, {
      action: 'showError',
      error: 'Failed to connect to AI service. Make sure the Flask backend is running.'
    });
  }
}

async function summarizeText(text, tabId) {
  try {
    const response = await fetch(`${API_BASE_URL}/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text, max_sentences: 3 })
    });

    const data = await response.json();

    if (data.success) {
      chrome.tabs.sendMessage(tabId, {
        action: 'showResult',
        type: 'summarize',
        result: {
          original: data.original,
          text: data.summary
        }
      });
    } else {
      chrome.tabs.sendMessage(tabId, {
        action: 'showError',
        error: data.error || 'Failed to summarize text'
      });
    }
  } catch (error) {
    chrome.tabs.sendMessage(tabId, {
      action: 'showError',
      error: 'Failed to connect to AI service. Make sure the Flask backend is running.'
    });
  }
}

async function improveText(text, tabId) {
  try {
    const response = await fetch(`${API_BASE_URL}/improve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });

    const data = await response.json();

    if (data.success) {
      chrome.tabs.sendMessage(tabId, {
        action: 'showResult',
        type: 'improve',
        result: {
          original: data.original,
          text: data.improved,
          fixes: data.grammar_fixes
        }
      });
    } else {
      chrome.tabs.sendMessage(tabId, {
        action: 'showError',
        error: data.error || 'Failed to improve text'
      });
    }
  } catch (error) {
    chrome.tabs.sendMessage(tabId, {
      action: 'showError',
      error: 'Failed to connect to AI service. Make sure the Flask backend is running.'
    });
  }
}

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'processText') {
    const { text, operation, style } = request;
    
    // Process based on operation type
    switch (operation) {
      case 'grammar':
        checkGrammar(text, sender.tab.id);
        break;
      case 'rewrite':
        rewriteText(text, style || 'formal', sender.tab.id);
        break;
      case 'summarize':
        summarizeText(text, sender.tab.id);
        break;
      case 'improve':
        improveText(text, sender.tab.id);
        break;
    }
    
    return true; // Keep message channel open for async response
  }
});
