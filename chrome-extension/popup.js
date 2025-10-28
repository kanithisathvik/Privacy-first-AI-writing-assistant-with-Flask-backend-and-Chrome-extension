// Backend API URL
const API_URL = 'http://127.0.0.1:5000';

// DOM elements
const textInput = document.getElementById('textInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const analyzeSelectedBtn = document.getElementById('analyzeSelectedBtn');
const clearBtn = document.getElementById('clearBtn');
const resultsDiv = document.getElementById('results');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  checkBackendStatus();
  loadSavedText();
  
  analyzeBtn.addEventListener('click', analyzeText);
  analyzeSelectedBtn.addEventListener('click', analyzeSelectedText);
  clearBtn.addEventListener('click', clearText);
  
  // Auto-save text
  textInput.addEventListener('input', () => {
    chrome.storage.local.set({ savedText: textInput.value });
  });
});

// Check if backend is running
async function checkBackendStatus() {
  try {
    const response = await fetch(`${API_URL}/`);
    const data = await response.json();
    
    if (data.status === 'ok') {
      statusIndicator.classList.add('online');
      statusText.textContent = 'Backend connected';
      analyzeBtn.disabled = false;
      analyzeSelectedBtn.disabled = false;
    }
  } catch (error) {
    statusIndicator.classList.add('offline');
    statusText.textContent = 'Backend offline - Please start Flask server';
    analyzeBtn.disabled = true;
    analyzeSelectedBtn.disabled = true;
    showError('Backend is not running. Please start the Flask server on port 5000.');
  }
}

// Load saved text from storage
function loadSavedText() {
  chrome.storage.local.get(['savedText'], (result) => {
    if (result.savedText) {
      textInput.value = result.savedText;
    }
  });
}

// Analyze text from textarea
async function analyzeText() {
  const text = textInput.value.trim();
  
  if (!text) {
    showError('Please enter some text to analyze.');
    return;
  }
  
  showLoading();
  
  try {
    const response = await fetch(`${API_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text })
    });
    
    if (!response.ok) {
      throw new Error('Analysis failed');
    }
    
    const data = await response.json();
    displayResults(data);
  } catch (error) {
    showError('Failed to analyze text. Please make sure the backend is running.');
  }
}

// Analyze selected text from page
function analyzeSelectedText() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getSelectedText' }, (response) => {
      if (response && response.text) {
        textInput.value = response.text;
        chrome.storage.local.set({ savedText: response.text });
        analyzeText();
      } else {
        showError('No text selected on the page.');
      }
    });
  });
}

// Clear text and results
function clearText() {
  textInput.value = '';
  resultsDiv.style.display = 'none';
  chrome.storage.local.remove('savedText');
}

// Show loading state
function showLoading() {
  resultsDiv.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Analyzing your text locally...</p>
    </div>
  `;
  resultsDiv.style.display = 'block';
}

// Display analysis results
function displayResults(data) {
  resultsDiv.style.display = 'block';
  resultsDiv.innerHTML = '';
  
  // Statistics
  if (data.statistics) {
    const statsSection = createResultSection('📊 Statistics', createStatistics(data.statistics));
    resultsDiv.appendChild(statsSection);
  }
  
  // Readability
  if (data.readability) {
    const readabilitySection = createResultSection('📖 Readability', createReadability(data.readability));
    resultsDiv.appendChild(readabilitySection);
  }
  
  // Grammar issues
  if (data.grammar) {
    const grammarSection = createResultSection('✏️ Grammar Issues', createGrammarIssues(data.grammar));
    resultsDiv.appendChild(grammarSection);
  }
  
  // Suggestions
  if (data.suggestions) {
    const suggestionsSection = createResultSection('💡 Suggestions', createSuggestions(data.suggestions));
    resultsDiv.appendChild(suggestionsSection);
  }
  
  // Tone
  if (data.tone) {
    const toneSection = createResultSection('🎭 Tone Analysis', createTone(data.tone));
    resultsDiv.appendChild(toneSection);
  }
}

// Create result section
function createResultSection(title, content) {
  const section = document.createElement('div');
  section.className = 'result-section';
  
  const heading = document.createElement('h3');
  heading.textContent = title;
  section.appendChild(heading);
  
  section.appendChild(content);
  
  return section;
}

// Create statistics display
function createStatistics(stats) {
  const container = document.createElement('div');
  container.className = 'stats-grid';
  
  const statItems = [
    { label: 'Words', value: stats.word_count },
    { label: 'Sentences', value: stats.sentence_count },
    { label: 'Characters', value: stats.character_count },
    { label: 'Paragraphs', value: stats.paragraph_count }
  ];
  
  statItems.forEach(item => {
    const statDiv = document.createElement('div');
    statDiv.className = 'stat-item';
    statDiv.innerHTML = `
      <div class="stat-value">${item.value}</div>
      <div class="stat-label">${item.label}</div>
    `;
    container.appendChild(statDiv);
  });
  
  return container;
}

// Create readability display
function createReadability(readability) {
  const container = document.createElement('div');
  
  if (readability.error) {
    container.innerHTML = `<div class="empty-state">${readability.message}</div>`;
    return container;
  }
  
  const metrics = [
    { label: 'Reading Ease', value: `${readability.flesch_reading_ease} (${readability.difficulty})` },
    { label: 'Grade Level', value: readability.flesch_kincaid_grade },
    { label: 'SMOG Index', value: readability.smog_index }
  ];
  
  metrics.forEach(metric => {
    const item = document.createElement('div');
    item.className = 'metric-item';
    item.innerHTML = `
      <span class="metric-label">${metric.label}:</span>
      <span class="metric-value">${metric.value}</span>
    `;
    container.appendChild(item);
  });
  
  return container;
}

// Create grammar issues display
function createGrammarIssues(issues) {
  const container = document.createElement('div');
  
  if (issues.length === 0) {
    container.innerHTML = '<div class="empty-state">✓ No grammar issues found!</div>';
    return container;
  }
  
  issues.slice(0, 5).forEach(issue => {
    const issueDiv = document.createElement('div');
    issueDiv.className = 'issue-item';
    
    let replacementsHtml = '';
    if (issue.replacements && issue.replacements.length > 0) {
      replacementsHtml = `
        <div class="replacements">
          ${issue.replacements.map(r => `<span class="replacement">${r}</span>`).join('')}
        </div>
      `;
    }
    
    issueDiv.innerHTML = `
      <div class="issue-message">${issue.message}</div>
      <div class="issue-context">${issue.context}</div>
      ${replacementsHtml}
    `;
    
    container.appendChild(issueDiv);
  });
  
  if (issues.length > 5) {
    const more = document.createElement('div');
    more.className = 'empty-state';
    more.textContent = `+ ${issues.length - 5} more issues`;
    container.appendChild(more);
  }
  
  return container;
}

// Create suggestions display
function createSuggestions(suggestions) {
  const container = document.createElement('div');
  
  if (suggestions.length === 0) {
    container.innerHTML = '<div class="empty-state">✓ No suggestions at this time!</div>';
    return container;
  }
  
  suggestions.slice(0, 5).forEach(suggestion => {
    const suggestionDiv = document.createElement('div');
    suggestionDiv.className = 'suggestion-item';
    suggestionDiv.innerHTML = `
      <div class="suggestion-message">${suggestion.message}</div>
      <div class="suggestion-sentence">${suggestion.sentence}</div>
    `;
    container.appendChild(suggestionDiv);
  });
  
  return container;
}

// Create tone display
function createTone(tone) {
  const container = document.createElement('div');
  
  const toneItems = [
    { label: 'Formality', value: tone.formality },
    { label: 'Sentiment', value: tone.sentiment }
  ];
  
  toneItems.forEach(item => {
    const div = document.createElement('div');
    div.className = 'tone-item';
    div.innerHTML = `
      <span class="tone-label">${item.label}:</span>
      <span class="tone-value">${item.value}</span>
    `;
    container.appendChild(div);
  });
  
  return container;
}

// Show error message
function showError(message) {
  const existingError = document.querySelector('.error');
  if (existingError) {
    existingError.remove();
  }
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error';
  errorDiv.textContent = message;
  
  const container = document.querySelector('.container');
  const section = document.querySelector('.section');
  container.insertBefore(errorDiv, section);
  
  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}
