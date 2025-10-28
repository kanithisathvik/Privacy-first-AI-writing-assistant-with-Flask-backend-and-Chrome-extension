/**
 * ContextGuard - Side Panel Script
 */

// Handle action card clicks
document.querySelectorAll('.action-card').forEach(card => {
  card.addEventListener('click', () => {
    const action = card.dataset.action;
    sendActionToActiveTab(action);
  });
});

/**
 * Send action to active tab's content script
 */
function sendActionToActiveTab(action) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'QUICK_ACTION',
        action: action
      });
    }
  });
}
