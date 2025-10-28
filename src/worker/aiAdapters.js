/**
 * ContextGuard - AI Adapters
 * Wraps Chrome's built-in AI APIs with fallback heuristics
 */

class AIAdapters {
  constructor() {
    this.capabilities = {
      summarizer: false,
      rewriter: false,
      languageModel: false,
      translator: false
    };
    this.checkCapabilities();
  }

  /**
   * Check which AI capabilities are available
   */
  async checkCapabilities() {
    try {
      // Check for AI APIs (Chrome 128+)
      if ('ai' in window) {
        this.capabilities.languageModel = await window.ai?.languageModel?.capabilities() || false;
        this.capabilities.summarizer = await window.ai?.summarizer?.capabilities() || false;
        this.capabilities.rewriter = await window.ai?.rewriter?.capabilities() || false;
        this.capabilities.translator = await window.ai?.translator?.capabilities() || false;
      }
    } catch (error) {
      console.log('ContextGuard: AI APIs not available, using fallbacks');
    }
  }

  /**
   * Summarize text
   */
  async summarize(text, options = {}) {
    try {
      // Try native Summarizer API
      if (this.capabilities.summarizer && window.ai?.summarizer) {
        const summarizer = await window.ai.summarizer.create({
          type: options.type || 'key-points',
          length: options.length || 'medium'
        });
        const result = await summarizer.summarize(text);
        summarizer.destroy();
        return result;
      }

      // Fallback: Extract key sentences using heuristics
      return this.fallbackSummarize(text, options);
    } catch (error) {
      console.error('Summarize error:', error);
      return this.fallbackSummarize(text, options);
    }
  }

  /**
   * Fallback summarizer using extractive method
   */
  fallbackSummarize(text, options = {}) {
    const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
    
    // Score sentences by keyword density and position
    const scored = sentences.map((sentence, index) => {
      const words = sentence.toLowerCase().split(/\s+/);
      const score = words.length * 0.5 + (sentences.length - index) * 0.3;
      return { sentence: sentence.trim(), score };
    });

    // Sort by score and take top sentences
    const topSentences = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.max(3, Math.ceil(sentences.length * 0.3)))
      .map(item => item.sentence);

    return topSentences.join(' ');
  }

  /**
   * Rewrite text with specified tone
   */
  async rewrite(text, options = {}) {
    const { tone = 'neutral', readingLevel = 'intermediate' } = options;

    try {
      // Try native Rewriter API
      if (this.capabilities.rewriter && window.ai?.rewriter) {
        const rewriter = await window.ai.rewriter.create({
          tone: tone,
          length: 'as-is'
        });
        const result = await rewriter.rewrite(text);
        rewriter.destroy();
        return result;
      }

      // Try Language Model API with prompt
      if (this.capabilities.languageModel && window.ai?.languageModel) {
        const session = await window.ai.languageModel.create();
        const prompt = `Rewrite the following text in a ${tone} tone at a ${readingLevel} reading level. Keep the meaning the same but adjust the style:\n\n${text}`;
        const result = await session.prompt(prompt);
        session.destroy();
        return result;
      }

      // Fallback: Simple style adjustments
      return this.fallbackRewrite(text, tone);
    } catch (error) {
      console.error('Rewrite error:', error);
      return this.fallbackRewrite(text, tone);
    }
  }

  /**
   * Fallback rewriter with basic transformations
   */
  fallbackRewrite(text, tone) {
    let result = text;

    switch (tone) {
      case 'formal':
        result = result
          .replace(/\bdon't\b/gi, 'do not')
          .replace(/\bcan't\b/gi, 'cannot')
          .replace(/\bwon't\b/gi, 'will not')
          .replace(/\bit's\b/gi, 'it is')
          .replace(/\bthat's\b/gi, 'that is');
        break;
      case 'friendly':
        result = result
          .replace(/\bdo not\b/gi, "don't")
          .replace(/\bcannot\b/gi, "can't")
          .replace(/\bit is\b/gi, "it's");
        break;
      case 'neutral':
      default:
        // Keep as is
        break;
    }

    return result;
  }

  /**
   * Proofread text
   */
  async proofread(text, options = {}) {
    try {
      // Try Language Model API with proofread prompt
      if (this.capabilities.languageModel && window.ai?.languageModel) {
        const session = await window.ai.languageModel.create();
        const prompt = `Proofread and correct the following text. Fix spelling, grammar, and punctuation errors. Return only the corrected text:\n\n${text}`;
        const result = await session.prompt(prompt);
        session.destroy();
        return result;
      }

      // Fallback: Basic corrections
      return this.fallbackProofread(text);
    } catch (error) {
      console.error('Proofread error:', error);
      return this.fallbackProofread(text);
    }
  }

  /**
   * Fallback proofreader with basic fixes
   */
  fallbackProofread(text) {
    let result = text;

    // Fix common issues
    result = result
      .replace(/\s+/g, ' ') // Multiple spaces
      .replace(/\s+([.,!?;:])/g, '$1') // Space before punctuation
      .replace(/([.,!?;:])([A-Z])/g, '$1 $2') // Missing space after punctuation
      .replace(/\bi\b/g, 'I') // Lowercase I
      .replace(/\b([a-z])\.([A-Z])/g, '$1. $2') // Missing space after period
      .trim();

    // Capitalize first letter of sentences
    result = result.replace(/(^\w|[.!?]\s+\w)/g, match => match.toUpperCase());

    return result;
  }

  /**
   * Translate text
   */
  async translate(text, targetLang = 'es', options = {}) {
    try {
      // Try native Translator API
      if (this.capabilities.translator && window.ai?.translator) {
        const canTranslate = await window.ai.translator.capabilities({
          sourceLanguage: 'en',
          targetLanguage: targetLang
        });

        if (canTranslate !== 'no') {
          const translator = await window.ai.translator.create({
            sourceLanguage: 'en',
            targetLanguage: targetLang
          });
          const result = await translator.translate(text);
          translator.destroy();
          return result;
        }
      }

      // Try Language Model API with translation prompt
      if (this.capabilities.languageModel && window.ai?.languageModel) {
        const session = await window.ai.languageModel.create();
        const langName = this.getLanguageName(targetLang);
        const prompt = `Translate the following English text to ${langName}. Return only the translation:\n\n${text}`;
        const result = await session.prompt(prompt);
        session.destroy();
        return result;
      }

      // Fallback message
      return `[Translation to ${targetLang} not available. Chrome AI Translator is still in development. The original text: ${text}]`;
    } catch (error) {
      console.error('Translate error:', error);
      return `[Translation failed: ${error.message}]`;
    }
  }

  /**
   * Generate alt text for images (multimodal stretch goal)
   */
  async generateAltText(imageData, options = {}) {
    try {
      // Note: Multimodal API not yet available in Chrome's built-in AI
      // This is a placeholder for future functionality

      if (this.capabilities.languageModel && window.ai?.languageModel) {
        const session = await window.ai.languageModel.create();
        const context = imageData.context || '';
        const prompt = `Generate descriptive alt text for an image. Context: ${context}. Current alt text: "${imageData.currentAlt}". Suggest improved alt text (max 125 characters):`;
        const result = await session.prompt(prompt);
        session.destroy();
        return result;
      }

      // Fallback: Suggest improvement based on context
      if (imageData.currentAlt) {
        return imageData.currentAlt;
      }
      
      return `Image from ${new URL(imageData.src).hostname}${imageData.context ? ': ' + imageData.context.slice(0, 100) : ''}`;
    } catch (error) {
      console.error('Alt text generation error:', error);
      return 'Image description unavailable';
    }
  }

  /**
   * Get full language name from code
   */
  getLanguageName(code) {
    const languages = {
      es: 'Spanish',
      fr: 'French',
      de: 'German',
      it: 'Italian',
      pt: 'Portuguese',
      ja: 'Japanese',
      zh: 'Chinese',
      ko: 'Korean',
      ru: 'Russian',
      ar: 'Arabic'
    };
    return languages[code] || code;
  }

  /**
   * Get AI status and capabilities
   */
  async getStatus() {
    await this.checkCapabilities();
    return {
      available: Object.values(this.capabilities).some(v => v !== false),
      capabilities: this.capabilities
    };
  }
}

// Export for service worker
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AIAdapters;
}
