// Content script for displaying results on the page

let resultBox = null;

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'showLoading':
      showLoading();
      break;
    case 'showResult':
      showResult(request.type, request.result);
      break;
    case 'showError':
      showError(request.error);
      break;
  }
});

function createResultBox() {
  if (resultBox) {
    document.body.removeChild(resultBox);
  }

  resultBox = document.createElement('div');
  resultBox.id = 'ai-writing-assistant-result';
  resultBox.className = 'ai-writing-assistant-box';
  document.body.appendChild(resultBox);

  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'ai-close-btn';
  closeBtn.innerHTML = '×';
  closeBtn.onclick = () => {
    if (resultBox && resultBox.parentNode) {
      document.body.removeChild(resultBox);
      resultBox = null;
    }
  };
  resultBox.appendChild(closeBtn);

  return resultBox;
}

function showLoading() {
  const box = createResultBox();
  box.innerHTML += `
    <div class="ai-loading">
      <div class="ai-spinner"></div>
      <p>Processing your text...</p>
      <p class="ai-privacy-note">🔒 Your text is processed locally - no data is stored</p>
    </div>
  `;
}

function showResult(type, result) {
  const box = createResultBox();
  
  let content = '';
  let textToCopy = '';
  
  switch (type) {
    case 'grammar':
      textToCopy = result.has_issues ? result.corrected : '';
      content = `
        <div class="ai-result">
          <h3>Grammar Check Results</h3>
          ${result.has_issues ? `
            <div class="ai-issues">
              <p><strong>Issues found:</strong> ${result.suggestions.length}</p>
              <div class="ai-suggestions">
                ${result.suggestions.map(s => `
                  <div class="ai-suggestion">
                    <span class="ai-original">${escapeHtml(s.original)}</span>
                    →
                    <span class="ai-improved">${escapeHtml(s.suggestion)}</span>
                    <span class="ai-message">${escapeHtml(s.message)}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : '<p class="ai-success">✓ No grammar issues found!</p>'}
          
          ${result.has_issues ? `
            <div class="ai-corrected">
              <h4>Corrected Text:</h4>
              <div class="ai-text-box">
                <p>${escapeHtml(result.corrected)}</p>
                <button class="ai-copy-btn" data-copy-text>Copy</button>
              </div>
            </div>
          ` : ''}
        </div>
      `;
      break;
      
    case 'rewrite':
      textToCopy = result.text;
      content = `
        <div class="ai-result">
          <h3>Rewritten Text (${result.style})</h3>
          <div class="ai-text-box">
            <p>${escapeHtml(result.text)}</p>
            <button class="ai-copy-btn" data-copy-text>Copy</button>
          </div>
        </div>
      `;
      break;
      
    case 'summarize':
      textToCopy = result.text;
      content = `
        <div class="ai-result">
          <h3>Summary</h3>
          <div class="ai-text-box">
            <p>${escapeHtml(result.text)}</p>
            <button class="ai-copy-btn" data-copy-text>Copy</button>
          </div>
        </div>
      `;
      break;
      
    case 'improve':
      textToCopy = result.text;
      content = `
        <div class="ai-result">
          <h3>Improved Text</h3>
          <p class="ai-info">Applied ${result.fixes} grammar fixes and style improvements</p>
          <div class="ai-text-box">
            <p>${escapeHtml(result.text)}</p>
            <button class="ai-copy-btn" data-copy-text>Copy</button>
          </div>
        </div>
      `;
      break;
  }
  
  content += '<p class="ai-privacy-note">🔒 Privacy-first: Your text was processed locally and not stored</p>';
  
  box.innerHTML += content;
  
  // Add event listener for copy button
  const copyBtn = box.querySelector('[data-copy-text]');
  if (copyBtn && textToCopy) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      }).catch(() => {
        copyBtn.textContent = '✗ Failed';
        setTimeout(() => {
          copyBtn.textContent = 'Copy';
        }, 2000);
      });
    });
  }
}

function showError(error) {
  const box = createResultBox();
  box.innerHTML += `
    <div class="ai-error">
      <h3>Error</h3>
      <p>${escapeHtml(error)}</p>
    </div>
  `;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Add keyboard shortcut listener (Ctrl+Shift+A to open popup)
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'A') {
    chrome.runtime.sendMessage({ action: 'openPopup' });
  }
});
