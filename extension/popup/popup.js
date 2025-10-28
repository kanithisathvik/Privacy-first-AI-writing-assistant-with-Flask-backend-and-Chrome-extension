// Popup script for AI Writing Assistant

const API_BASE_URL = 'http://127.0.0.1:5000/api';

// Get DOM elements
const textInput = document.getElementById('textInput');
const charCount = document.getElementById('charCount');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');
const resultSection = document.getElementById('resultSection');
const resultBox = document.getElementById('resultBox');
const copyBtn = document.getElementById('copyBtn');

// Action buttons
const checkGrammarBtn = document.getElementById('checkGrammar');
const improveTxtBtn = document.getElementById('improveTxt');
const rewriteFormalBtn = document.getElementById('rewriteFormal');
const rewriteCasualBtn = document.getElementById('rewriteCasual');
const rewriteConciseBtn = document.getElementById('rewriteConcise');
const summarizeBtn = document.getElementById('summarize');

let currentResult = '';

// Check API connection status
async function checkConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    
    if (data.status === 'healthy') {
      statusIndicator.classList.add('connected');
      statusIndicator.classList.remove('error');
      statusText.textContent = 'Connected to AI service';
      enableButtons(true);
    }
  } catch (error) {
    statusIndicator.classList.add('error');
    statusIndicator.classList.remove('connected');
    statusText.textContent = 'Not connected - Start Flask backend';
    enableButtons(false);
  }
}

function enableButtons(enabled) {
  const buttons = [checkGrammarBtn, improveTxtBtn, rewriteFormalBtn, 
                   rewriteCasualBtn, rewriteConciseBtn, summarizeBtn];
  buttons.forEach(btn => btn.disabled = !enabled);
}

// Update character count
textInput.addEventListener('input', () => {
  const length = textInput.value.length;
  charCount.textContent = length;
  
  if (length > 10000) {
    charCount.style.color = '#dc3545';
  } else {
    charCount.style.color = '#666';
  }
});

// Show loading state
function showLoading() {
  resultSection.style.display = 'block';
  resultBox.innerHTML = '<div class="loading">Processing your text</div>';
  copyBtn.style.display = 'none';
}

// Show result
function showResult(text, type = 'success') {
  resultSection.style.display = 'block';
  
  if (type === 'error') {
    resultBox.innerHTML = `<div class="error-message">${text}</div>`;
    copyBtn.style.display = 'none';
  } else {
    resultBox.textContent = text;
    currentResult = text;
    copyBtn.style.display = 'block';
  }
}

// Copy result to clipboard
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(currentResult);
    const originalText = copyBtn.textContent;
    copyBtn.textContent = '✓ Copied!';
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 2000);
  } catch (error) {
    showResult('Failed to copy to clipboard', 'error');
  }
});

// API call functions
async function callAPI(endpoint, data) {
  const text = textInput.value.trim();
  
  if (!text) {
    showResult('Please enter some text first', 'error');
    return;
  }
  
  if (text.length > 10000) {
    showResult('Text is too long (max 10000 characters)', 'error');
    return;
  }
  
  showLoading();
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text, ...data })
    });
    
    const result = await response.json();
    
    if (result.success) {
      return result;
    } else {
      showResult(result.error || 'An error occurred', 'error');
      return null;
    }
  } catch (error) {
    showResult('Failed to connect to AI service. Make sure the Flask backend is running.', 'error');
    return null;
  }
}

// Button event listeners
checkGrammarBtn.addEventListener('click', async () => {
  const result = await callAPI('/check-grammar');
  if (result) {
    const grammarResult = result.result;
    if (grammarResult.has_issues) {
      let output = `Found ${grammarResult.suggestions.length} issue(s):\n\n`;
      grammarResult.suggestions.forEach((s, i) => {
        output += `${i + 1}. "${s.original}" → "${s.suggestion}" (${s.message})\n`;
      });
      output += `\nCorrected text:\n${grammarResult.corrected}`;
      showResult(output);
    } else {
      showResult('✓ No grammar issues found!');
    }
  }
});

improveTxtBtn.addEventListener('click', async () => {
  const result = await callAPI('/improve');
  if (result) {
    showResult(result.improved);
  }
});

rewriteFormalBtn.addEventListener('click', async () => {
  const result = await callAPI('/rewrite', { style: 'formal' });
  if (result) {
    showResult(result.rewritten);
  }
});

rewriteCasualBtn.addEventListener('click', async () => {
  const result = await callAPI('/rewrite', { style: 'casual' });
  if (result) {
    showResult(result.rewritten);
  }
});

rewriteConciseBtn.addEventListener('click', async () => {
  const result = await callAPI('/rewrite', { style: 'concise' });
  if (result) {
    showResult(result.rewritten);
  }
});

summarizeBtn.addEventListener('click', async () => {
  const result = await callAPI('/summarize', { max_sentences: 3 });
  if (result) {
    showResult(result.summary);
  }
});

// Initialize
checkConnection();

// Check connection every 5 seconds
setInterval(checkConnection, 5000);
