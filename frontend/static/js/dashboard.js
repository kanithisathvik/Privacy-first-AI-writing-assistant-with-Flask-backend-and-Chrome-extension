/**
 * ContextGuard - Dashboard functionality
 */

let currentAction = null;
let isProcessing = false;

// DOM Elements
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const actionButtons = document.querySelectorAll('.action-btn');
const processBtn = document.getElementById('processBtn');
const charCount = document.getElementById('charCount');
const statusBar = document.getElementById('statusBar');
const statusText = document.getElementById('statusText');
const resultInfo = document.getElementById('resultInfo');

// Option elements
const toneOption = document.getElementById('toneOption');
const levelOption = document.getElementById('levelOption');
const lengthOption = document.getElementById('lengthOption');
const langOption = document.getElementById('langOption');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Action button clicks
    actionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            selectAction(btn.dataset.action);
        });
    });

    // Input text changes
    inputText.addEventListener('input', () => {
        updateCharCount();
        validateInput();
    });

    // Process button
    processBtn.addEventListener('click', () => {
        processText();
    });

    // Clear input
    document.getElementById('clearInput')?.addEventListener('click', () => {
        inputText.value = '';
        updateCharCount();
        validateInput();
    });

    // Copy result
    document.getElementById('copyResult')?.addEventListener('click', () => {
        copyResult();
    });

    // Download result
    document.getElementById('downloadResult')?.addEventListener('click', () => {
        downloadResult();
    });

    // Auto-save preferences on change
    ['tone', 'readingLevel', 'targetLanguage'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', savePreferences);
    });
});

/**
 * Select an action
 */
function selectAction(action) {
    currentAction = action;
    
    // Update button states
    actionButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.action === action);
    });

    // Show/hide relevant options
    toneOption.style.display = action === 'rewrite' ? 'block' : 'none';
    levelOption.style.display = action === 'rewrite' ? 'block' : 'none';
    lengthOption.style.display = action === 'summarize' ? 'block' : 'none';
    langOption.style.display = action === 'translate' ? 'block' : 'none';

    // Update button text
    const actionNames = {
        summarize: 'Summarize',
        rewrite: 'Rewrite',
        proofread: 'Proofread',
        translate: 'Translate'
    };
    document.getElementById('processBtnText').textContent = actionNames[action] || 'Process';

    validateInput();
}

/**
 * Update character count
 */
function updateCharCount() {
    const count = inputText.value.length;
    charCount.textContent = `${count.toLocaleString()} characters`;
}

/**
 * Validate input
 */
function validateInput() {
    const text = inputText.value.trim();
    const isValid = text.length >= 10 && currentAction !== null && !isProcessing;
    processBtn.disabled = !isValid;
}

/**
 * Process text with selected action
 */
async function processText() {
    if (isProcessing) return;

    const text = inputText.value.trim();
    if (!text || !currentAction) return;

    isProcessing = true;
    processBtn.disabled = true;
    showStatus('Processing...');

    try {
        const options = {
            text: text,
            tone: document.getElementById('tone')?.value || 'neutral',
            readingLevel: document.getElementById('readingLevel')?.value || 'intermediate',
            length: document.getElementById('summaryLength')?.value || 'medium',
            targetLanguage: document.getElementById('targetLanguage')?.value || 'es'
        };

        const response = await fetch(`/ai/${currentAction}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(options)
        });

        const data = await response.json();

        if (data.success) {
            displayResult(data.result, data.method);
        } else {
            displayError(data.error || 'Processing failed');
        }
    } catch (error) {
        console.error('Process error:', error);
        displayError('Network error. Please try again.');
    } finally {
        isProcessing = false;
        hideStatus();
        validateInput();
    }
}

/**
 * Display result
 */
function displayResult(result, method) {
    outputText.innerHTML = `<div class="result-text">${escapeHtml(result)}</div>`;
    
    // Show result info
    resultInfo.style.display = 'flex';
    resultInfo.querySelector('.result-method').textContent = `Processed with: ${method}`;

    // Enable copy and download buttons
    document.getElementById('copyResult').disabled = false;
    document.getElementById('downloadResult').disabled = false;

    showNotification('Processing complete!', 'success');
}

/**
 * Display error
 */
function displayError(message) {
    outputText.innerHTML = `
        <div class="output-error">
            <div class="error-icon">⚠️</div>
            <p><strong>Error:</strong> ${escapeHtml(message)}</p>
        </div>
    `;
    
    resultInfo.style.display = 'none';
    document.getElementById('copyResult').disabled = true;
    document.getElementById('downloadResult').disabled = true;

    showNotification('Processing failed', 'error');
}

/**
 * Copy result to clipboard
 */
async function copyResult() {
    const resultText = outputText.querySelector('.result-text');
    if (!resultText) return;

    try {
        await navigator.clipboard.writeText(resultText.textContent);
        showNotification('Copied to clipboard!', 'success');
    } catch (error) {
        console.error('Copy error:', error);
        showNotification('Failed to copy', 'error');
    }
}

/**
 * Download result as text file
 */
function downloadResult() {
    const resultText = outputText.querySelector('.result-text');
    if (!resultText) return;

    const blob = new Blob([resultText.textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contextguard-${currentAction}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification('Downloaded!', 'success');
}

/**
 * Show status bar
 */
function showStatus(message) {
    statusText.textContent = message;
    statusBar.style.display = 'flex';
}

/**
 * Hide status bar
 */
function hideStatus() {
    statusBar.style.display = 'none';
}

/**
 * Save preferences
 */
async function savePreferences() {
    const prefs = {
        tone: document.getElementById('tone')?.value || 'neutral',
        readingLevel: document.getElementById('readingLevel')?.value || 'intermediate',
        targetLanguage: document.getElementById('targetLanguage')?.value || 'es'
    };

    // Try to save to backend if logged in
    try {
        await saveUserPreferences(prefs);
    } catch (error) {
        // If not logged in, just save locally
        console.log('Preferences not saved (not logged in)');
    }
}

/**
 * Escape HTML
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add error display styles
const style = document.createElement('style');
style.textContent = `
    .result-text {
        white-space: pre-wrap;
        word-wrap: break-word;
        line-height: 1.8;
    }

    .output-error {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 300px;
        color: var(--danger);
    }

    .error-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
    }

    .output-error p {
        text-align: center;
        max-width: 400px;
    }
`;
document.head.appendChild(style);
