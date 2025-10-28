// Content script - runs on web pages to detect and extract text

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSelectedText') {
    const selectedText = window.getSelection().toString().trim();
    sendResponse({ text: selectedText });
  }
  return true;
});

// Optional: Add context menu support for selected text
document.addEventListener('mouseup', () => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    // Store selected text for potential use
    chrome.storage.local.set({ lastSelectedText: selectedText });
  }
});
