/**
 * ContextGuard - Popup Script
 */

// Action buttons
document.getElementById('summarizeBtn').addEventListener('click', () => {
  sendActionToActiveTab('summarize');
});

document.getElementById('rewriteBtn').addEventListener('click', () => {
  sendActionToActiveTab('rewrite');
});

document.getElementById('proofreadBtn').addEventListener('click', () => {
  sendActionToActiveTab('proofread');
});

document.getElementById('translateBtn').addEventListener('click', () => {
  sendActionToActiveTab('translate');
});

document.getElementById('optionsBtn').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
  window.close();
});

document.getElementById('learnMore').addEventListener('click', (e) => {
  e.preventDefault();
  chrome.tabs.create({ url: 'https://github.com/yourusername/contextguard' });
  window.close();
});

/**
 * Send action message to active tab
 */
function sendActionToActiveTab(action) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'QUICK_ACTION',
        action: action
      });
      window.close();
    }
  });
}
