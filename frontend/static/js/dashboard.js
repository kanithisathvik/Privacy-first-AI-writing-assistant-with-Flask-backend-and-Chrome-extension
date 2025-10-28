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
    
    // Initialize drag-and-drop
    initDragAndDrop();
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
    
    // Show export options modal
    showExportModal(resultText.textContent);
}

/**
 * Show export modal with format options
 */
function showExportModal(resultContent) {
    const modal = document.createElement('div');
    modal.className = 'export-modal';
    modal.innerHTML = `
        <div class="export-content">
            <h2>📥 Export Result</h2>
            <p>Choose your preferred format:</p>
            <div class="export-options">
                <button class="export-btn" data-format="txt">
                    <span class="export-icon">📄</span>
                    <span class="export-label">Plain Text (.txt)</span>
                </button>
                <button class="export-btn" data-format="markdown">
                    <span class="export-icon">📝</span>
                    <span class="export-label">Markdown (.md)</span>
                </button>
                <button class="export-btn" data-format="json">
                    <span class="export-icon">📊</span>
                    <span class="export-label">JSON (.json)</span>
                </button>
                <button class="export-btn" data-format="pdf">
                    <span class="export-icon">📕</span>
                    <span class="export-label">PDF Document</span>
                </button>
            </div>
            <button class="cancel-export-btn" onclick="this.closest('.export-modal').remove()">
                Cancel
            </button>
        </div>
    `;
    
    // Add click handlers for export buttons
    modal.querySelectorAll('.export-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const format = btn.dataset.format;
            exportInFormat(format, resultContent);
            modal.remove();
        });
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    document.body.appendChild(modal);
}

/**
 * Export content in specified format
 */
async function exportInFormat(format, content) {
    try {
        showStatus('Preparing export...', 'loading');
        
        const exportData = {
            format: format,
            action: currentAction || 'unknown',
            original: inputText.value,
            result: content,
            metadata: {
                timestamp: new Date().toISOString(),
                user_agent: navigator.userAgent
            }
        };
        
        const response = await fetch('/api/export', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(exportData)
        });
        
        if (!response.ok) {
            throw new Error('Export failed');
        }
        
        // Download the file
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contextguard_export_${currentAction}.${format === 'markdown' ? 'md' : format}`;
        a.click();
        URL.revokeObjectURL(url);
        
        showStatus(`Exported as ${format.toUpperCase()}!`, 'success');
        
    } catch (error) {
        console.error('Export error:', error);
        showStatus('Export failed. Falling back to simple download.', 'warning');
        
        // Fallback to simple text download
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contextguard-${currentAction}-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Add export modal styles
const exportModalStyle = document.createElement('style');
exportModalStyle.textContent = `
    .export-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.2s ease;
    }
    
    .export-content {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        animation: slideUp 0.3s ease;
    }
    
    .export-content h2 {
        margin-top: 0;
        margin-bottom: 0.5rem;
        color: #333;
    }
    
    .export-content > p {
        margin-bottom: 1.5rem;
        color: #666;
    }
    
    .export-options {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .export-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 1.5rem 1rem;
        background: #f8f9fa;
        border: 2px solid transparent;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .export-btn:hover {
        background: white;
        border-color: #667eea;
        transform: translateY(-2px);
    }
    
    .export-icon {
        font-size: 2rem;
    }
    
    .export-label {
        font-size: 0.9rem;
        color: #333;
        text-align: center;
    }
    
    .cancel-export-btn {
        width: 100%;
        padding: 0.75rem;
        background: #f8f9fa;
        color: #666;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.2s ease;
    }
    
    .cancel-export-btn:hover {
        background: #e9ecef;
    }
`;
document.head.appendChild(exportModalStyle);

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

// ==================== DRAG AND DROP FILE UPLOAD ====================

/**
 * Initialize drag and drop functionality
 */
function initDragAndDrop() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadFile');
    
    if (!dropZone || !fileInput) return;
    
    // Upload button click
    uploadBtn?.addEventListener('click', () => {
        fileInput.click();
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFile(file);
        }
    });
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    // Highlight drop zone when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('drag-active');
        }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('drag-active');
        }, false);
    });
    
    // Handle dropped files
    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            handleFile(files[0]);
        }
    }, false);
}

/**
 * Prevent default drag behaviors
 */
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

/**
 * Handle file upload
 */
async function handleFile(file) {
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        showStatus('File too large. Maximum size is 5MB.', 'error');
        return;
    }
    
    // Check file type
    const validTypes = [
        'text/plain',
        'text/markdown',
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    const validExtensions = ['.txt', '.md', '.pdf', '.docx'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
        showStatus('Unsupported file type. Please use .txt, .md, .pdf, or .docx', 'error');
        return;
    }
    
    showStatus('Reading file...', 'loading');
    
    try {
        let text = '';
        
        if (file.type === 'text/plain' || file.type === 'text/markdown' || fileExtension === '.txt' || fileExtension === '.md') {
            // Simple text file
            text = await readTextFile(file);
        } else if (file.type === 'application/pdf' || fileExtension === '.pdf') {
            // PDF file - we'll need to send to backend
            text = await extractTextFromPDF(file);
        } else if (fileExtension === '.docx') {
            // DOCX file - send to backend
            text = await extractTextFromDOCX(file);
        }
        
        if (text.trim()) {
            inputText.value = text.substring(0, 10000); // Respect max length
            updateCharCount();
            validateInput();
            showStatus(`Loaded ${file.name}`, 'success');
        } else {
            showStatus('Could not extract text from file', 'error');
        }
        
    } catch (error) {
        console.error('File reading error:', error);
        showStatus('Error reading file: ' + error.message, 'error');
    }
}

/**
 * Read text file
 */
function readTextFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}

/**
 * Extract text from PDF
 */
async function extractTextFromPDF(file) {
    // For now, we'll use a simple approach
    // In production, you'd use pdf.js or send to backend
    showStatus('PDF support coming soon. For now, please copy/paste text.', 'warning');
    return '';
}

/**
 * Extract text from DOCX
 */
async function extractTextFromDOCX(file) {
    // For now, we'll use a simple approach
    // In production, you'd use mammoth.js or send to backend
    showStatus('DOCX support coming soon. For now, please copy/paste text.', 'warning');
    return '';
}

// Add drop zone styles
const dropZoneStyle = document.createElement('style');
dropZoneStyle.textContent = `
    .drop-zone {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(102, 126, 234, 0.95);
        border-radius: 12px;
        z-index: 100;
        align-items: center;
        justify-content: center;
    }
    
    .drop-zone.drag-active {
        display: flex;
    }
    
    .drop-zone-content {
        text-align: center;
        color: white;
        pointer-events: none;
    }
    
    .drop-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
        animation: bounce 1s infinite;
    }
    
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
    
    .drop-zone-content p {
        margin: 0.5rem 0;
        font-size: 1.2rem;
    }
    
    .drop-hint {
        font-size: 0.9rem;
        opacity: 0.8;
    }
    
    .workspace-panel {
        position: relative;
    }
`;
document.head.appendChild(dropZoneStyle);

// ==================== KEYBOARD SHORTCUTS ====================

// Keyboard shortcuts configuration
const shortcuts = {
    'summarize': 'Ctrl+Shift+S',
    'rewrite': 'Ctrl+Shift+R',
    'proofread': 'Ctrl+Shift+P',
    'translate': 'Ctrl+Shift+T',
    'process': 'Ctrl+Enter',
    'clear': 'Escape',
    'help': 'Ctrl+/',
};

// Initialize keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Check for Ctrl+Shift combinations
    if (e.ctrlKey && e.shiftKey) {
        switch(e.key.toLowerCase()) {
            case 's':
                e.preventDefault();
                selectAction('summarize');
                break;
            case 'r':
                e.preventDefault();
                selectAction('rewrite');
                break;
            case 'p':
                e.preventDefault();
                selectAction('proofread');
                break;
            case 't':
                e.preventDefault();
                selectAction('translate');
                break;
        }
    }
    
    // Check for Ctrl+Enter (process)
    if (e.ctrlKey && e.key === 'Enter' && !isProcessing && inputText.value.trim()) {
        e.preventDefault();
        processText();
    }
    
    // Check for Escape (clear)
    if (e.key === 'Escape' && !isProcessing) {
        inputText.value = '';
        outputText.textContent = '';
        updateCharCount();
        validateInput();
    }
    
    // Check for Ctrl+/ (help)
    if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        showShortcutsHelp();
    }
});

/**
 * Show keyboard shortcuts help modal
 */
function showShortcutsHelp() {
    const modal = document.createElement('div');
    modal.className = 'shortcuts-modal';
    modal.innerHTML = `
        <div class="shortcuts-content">
            <h2>⌨️ Keyboard Shortcuts</h2>
            <div class="shortcuts-list">
                <div class="shortcut-item">
                    <span class="shortcut-key">Ctrl + Shift + S</span>
                    <span class="shortcut-desc">Summarize</span>
                </div>
                <div class="shortcut-item">
                    <span class="shortcut-key">Ctrl + Shift + R</span>
                    <span class="shortcut-desc">Rewrite</span>
                </div>
                <div class="shortcut-item">
                    <span class="shortcut-key">Ctrl + Shift + P</span>
                    <span class="shortcut-desc">Proofread</span>
                </div>
                <div class="shortcut-item">
                    <span class="shortcut-key">Ctrl + Shift + T</span>
                    <span class="shortcut-desc">Translate</span>
                </div>
                <div class="shortcut-item">
                    <span class="shortcut-key">Ctrl + Enter</span>
                    <span class="shortcut-desc">Process Text</span>
                </div>
                <div class="shortcut-item">
                    <span class="shortcut-key">Escape</span>
                    <span class="shortcut-desc">Clear All</span>
                </div>
                <div class="shortcut-item">
                    <span class="shortcut-key">Ctrl + /</span>
                    <span class="shortcut-desc">Show This Help</span>
                </div>
            </div>
            <button class="close-modal-btn" onclick="this.closest('.shortcuts-modal').remove()">
                Got it!
            </button>
        </div>
    `;
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    document.body.appendChild(modal);
}

// Add modal styles
const modalStyle = document.createElement('style');
modalStyle.textContent = `
    .shortcuts-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.2s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .shortcuts-content {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        animation: slideUp 0.3s ease;
    }
    
    @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    .shortcuts-content h2 {
        margin-top: 0;
        margin-bottom: 1.5rem;
        color: #333;
        text-align: center;
    }
    
    .shortcuts-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
    }
    
    .shortcut-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        background: #f8f9fa;
        border-radius: 8px;
    }
    
    .shortcut-key {
        font-family: 'Courier New', monospace;
        background: white;
        padding: 0.25rem 0.75rem;
        border-radius: 4px;
        border: 1px solid #ddd;
        font-weight: 600;
        color: #667eea;
    }
    
    .shortcut-desc {
        color: #666;
    }
    
    .close-modal-btn {
        width: 100%;
        padding: 0.75rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s ease;
    }
    
    .close-modal-btn:hover {
        transform: translateY(-2px);
    }
`;
document.head.appendChild(modalStyle);

// Show shortcuts hint on first visit
if (!localStorage.getItem('contextguard_shortcuts_shown')) {
    setTimeout(() => {
        const hint = document.createElement('div');
        hint.className = 'shortcuts-hint';
        hint.innerHTML = `
            <div class="hint-content">
                💡 <strong>Tip:</strong> Press <kbd>Ctrl</kbd> + <kbd>/</kbd> to see all keyboard shortcuts
                <button onclick="this.closest('.shortcuts-hint').remove()" style="margin-left: 1rem; padding: 0.25rem 0.75rem; border: none; background: white; border-radius: 4px; cursor: pointer;">Got it</button>
            </div>
        `;
        
        const hintStyle = document.createElement('style');
        hintStyle.textContent = `
            .shortcuts-hint {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                z-index: 9999;
                animation: slideIn 0.5s ease;
            }
            
            @keyframes slideIn {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            .hint-content {
                display: flex;
                align-items: center;
            }
            
            .shortcuts-hint kbd {
                background: rgba(255,255,255,0.3);
                padding: 0.2rem 0.5rem;
                border-radius: 4px;
                font-family: 'Courier New', monospace;
                margin: 0 0.25rem;
            }
        `;
        document.head.appendChild(hintStyle);
        document.body.appendChild(hint);
        
        localStorage.setItem('contextguard_shortcuts_shown', 'true');
        
        // Auto-remove after 8 seconds
        setTimeout(() => hint.remove(), 8000);
    }, 2000);
}
