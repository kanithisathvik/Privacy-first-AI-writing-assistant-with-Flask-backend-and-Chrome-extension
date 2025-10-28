/**
 * ContextGuard - DOM Selection Handler
 * Manages text selection detection and extraction from the page
 */

class DOMSelection {
  constructor() {
    this.currentSelection = null;
    this.selectionRange = null;
  }

  /**
   * Get currently selected text or fallback to nearest content block
   * @returns {Object} { text, element, hasSelection }
   */
  getSelectionOrContext() {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText) {
      // User has selected text
      this.currentSelection = selectedText;
      this.selectionRange = selection.getRangeAt(0);
      
      return {
        text: selectedText,
        element: this.selectionRange.commonAncestorContainer,
        hasSelection: true,
        range: this.selectionRange
      };
    }

    // No selection - get nearest content block
    const nearestBlock = this.getNearestContentBlock();
    
    return {
      text: nearestBlock.text,
      element: nearestBlock.element,
      hasSelection: false,
      range: null
    };
  }

  /**
   * Find the nearest meaningful content block
   * Priority: article > main > largest p > body text
   */
  getNearestContentBlock() {
    // Try semantic HTML elements first
    const article = document.querySelector('article');
    if (article && article.textContent.trim().length > 100) {
      return {
        text: this.extractCleanText(article),
        element: article
      };
    }

    const main = document.querySelector('main');
    if (main && main.textContent.trim().length > 100) {
      return {
        text: this.extractCleanText(main),
        element: main
      };
    }

    // Find largest paragraph or content block
    const paragraphs = Array.from(document.querySelectorAll('p, div[class*="content"], div[class*="article"]'));
    const largest = paragraphs.reduce((max, el) => {
      const text = el.textContent.trim();
      return text.length > (max?.textContent?.trim()?.length || 0) ? el : max;
    }, null);

    if (largest && largest.textContent.trim().length > 50) {
      return {
        text: this.extractCleanText(largest),
        element: largest
      };
    }

    // Fallback to body text (first 1000 chars)
    const bodyText = document.body.textContent.trim().slice(0, 1000);
    return {
      text: bodyText || 'No content found on this page.',
      element: document.body
    };
  }

  /**
   * Extract clean text from an element (remove scripts, styles, etc.)
   */
  extractCleanText(element) {
    const clone = element.cloneNode(true);
    
    // Remove unwanted elements
    const unwanted = clone.querySelectorAll('script, style, nav, header, footer, aside, [aria-hidden="true"]');
    unwanted.forEach(el => el.remove());

    let text = clone.textContent || clone.innerText || '';
    
    // Clean up whitespace
    text = text.replace(/\s+/g, ' ').trim();
    
    // Limit to reasonable length (10000 chars for AI processing)
    return text.slice(0, 10000);
  }

  /**
   * Replace selected text with new content
   * Only works if there's an actual selection
   */
  replaceSelection(newText) {
    if (!this.selectionRange) {
      return false;
    }

    try {
      // Check if the range is still valid
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(this.selectionRange);

      // Replace the content
      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      const textNode = document.createTextNode(newText);
      range.insertNode(textNode);

      // Clear selection
      selection.removeAllRanges();
      
      return true;
    } catch (error) {
      console.error('ContextGuard: Failed to replace selection', error);
      return false;
    }
  }

  /**
   * Highlight the current selection temporarily
   */
  highlightSelection() {
    if (!this.selectionRange) return null;

    try {
      const span = document.createElement('span');
      span.className = 'contextguard-highlight';
      this.selectionRange.surroundContents(span);
      
      return span;
    } catch (error) {
      // Selection might span multiple elements, skip highlighting
      return null;
    }
  }

  /**
   * Remove highlight
   */
  removeHighlight(highlightElement) {
    if (!highlightElement) return;

    const parent = highlightElement.parentNode;
    if (parent) {
      while (highlightElement.firstChild) {
        parent.insertBefore(highlightElement.firstChild, highlightElement);
      }
      parent.removeChild(highlightElement);
    }
  }

  /**
   * Check if selection is in an editable field
   */
  isEditableContext() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return false;

    const container = selection.getRangeAt(0).commonAncestorContainer;
    const element = container.nodeType === 3 ? container.parentNode : container;

    return (
      element.isContentEditable ||
      element.tagName === 'INPUT' ||
      element.tagName === 'TEXTAREA'
    );
  }

  /**
   * Get alt text context for an image element
   */
  getImageContext(imgElement) {
    return {
      src: imgElement.src,
      currentAlt: imgElement.alt || '',
      width: imgElement.width,
      height: imgElement.height,
      context: this.getSurroundingText(imgElement)
    };
  }

  /**
   * Get surrounding text context for an element
   */
  getSurroundingText(element, maxLength = 200) {
    const parent = element.parentNode;
    if (!parent) return '';

    const text = parent.textContent.trim();
    return text.slice(0, maxLength);
  }

  /**
   * Clear stored selection
   */
  clearSelection() {
    this.currentSelection = null;
    this.selectionRange = null;
  }
}

// Export for use in content script
window.DOMSelection = DOMSelection;
