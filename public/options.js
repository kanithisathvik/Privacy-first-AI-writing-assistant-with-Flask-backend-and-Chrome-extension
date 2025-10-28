/**
 * ContextGuard - Options Page Script
 */

// Load saved options
function loadOptions() {
  chrome.storage.local.get({
    tone: 'neutral',
    readingLevel: 'intermediate',
    targetLanguage: 'es'
  }, (items) => {
    // Set tone
    document.querySelector(`input[name="tone"][value="${items.tone}"]`).checked = true;
    
    // Set reading level
    document.querySelector(`input[name="readingLevel"][value="${items.readingLevel}"]`).checked = true;
    
    // Set target language
    document.getElementById('targetLanguage').value = items.targetLanguage;
  });

  // Check AI status
  checkAIStatus();
}

// Save options
function saveOptions() {
  const tone = document.querySelector('input[name="tone"]:checked').value;
  const readingLevel = document.querySelector('input[name="readingLevel"]:checked').value;
  const targetLanguage = document.getElementById('targetLanguage').value;

  chrome.storage.local.set({
    tone,
    readingLevel,
    targetLanguage
  }, () => {
    // Show save confirmation
    const status = document.getElementById('saveStatus');
    status.textContent = '✓ Settings saved!';
    status.style.opacity = '1';
    
    setTimeout(() => {
      status.style.opacity = '0';
    }, 2000);
  });
}

// Check AI API availability
async function checkAIStatus() {
  const statusDot = document.getElementById('aiStatus');
  const statusText = document.getElementById('aiStatusText');

  try {
    // Send message to service worker to check AI status
    chrome.runtime.sendMessage({ type: 'GET_AI_STATUS' }, (response) => {
      if (response && response.available) {
        statusDot.className = 'status-dot status-online';
        statusText.textContent = 'Chrome AI is available and ready';
        
        // Show which capabilities are available
        const caps = response.capabilities;
        const available = [];
        if (caps.summarizer) available.push('Summarizer');
        if (caps.rewriter) available.push('Rewriter');
        if (caps.translator) available.push('Translator');
        if (caps.languageModel) available.push('Language Model');
        
        if (available.length > 0) {
          statusText.textContent += ` (${available.join(', ')})`;
        }
      } else {
        statusDot.className = 'status-dot status-offline';
        statusText.textContent = 'Chrome AI not detected - using fallback methods';
      }
    });
  } catch (error) {
    statusDot.className = 'status-dot status-offline';
    statusText.textContent = 'Unable to check AI status';
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('saveBtn').addEventListener('click', saveOptions);

// Auto-save on change (optional)
document.querySelectorAll('input[type="radio"], select').forEach(element => {
  element.addEventListener('change', () => {
    // Visual feedback
    element.closest('.section')?.classList.add('changed');
    setTimeout(() => {
      element.closest('.section')?.classList.remove('changed');
    }, 300);
  });
});
