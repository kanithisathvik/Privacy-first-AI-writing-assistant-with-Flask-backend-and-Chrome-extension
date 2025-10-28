// Background service worker for Chrome extension

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Privacy-First AI Writing Assistant installed');
  
  // Create context menu for analyzing selected text
  chrome.contextMenus.create({
    id: 'analyzeText',
    title: 'Analyze with Writing Assistant',
    contexts: ['selection']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'analyzeText' && info.selectionText) {
    // Store the selected text
    chrome.storage.local.set({ savedText: info.selectionText });
    
    // Open the popup (this will trigger the analysis)
    chrome.action.openPopup();
  }
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkBackend') {
    // Helper function to check backend status
    fetch('http://127.0.0.1:5000/')
      .then(response => response.json())
      .then(data => {
        sendResponse({ status: 'online', data });
      })
      .catch(error => {
        sendResponse({ status: 'offline', error: error.message });
      });
    return true; // Keep channel open for async response
  }
});
