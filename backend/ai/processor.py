"""
ContextGuard Backend - AI Processing Module
Handles all AI operations with multiple fallbacks
"""

import os
import re
import logging
from typing import Dict, Optional
from langdetect import detect
import nltk
from nltk.tokenize import sent_tokenize
from nltk.corpus import stopwords

# Download NLTK data if not present
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', quiet=True)

logger = logging.getLogger(__name__)


class AIProcessor:
    """
    AI Processing engine with multiple backends
    Priority: Google Gemini > Local Models > Fallback Heuristics
    """
    
    def __init__(self):
        self.gemini_available = False
        self.api_key = os.getenv('GOOGLE_API_KEY')
        
        if self.api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel('gemini-pro')
                self.gemini_available = True
                logger.info("Google Gemini AI initialized successfully")
            except Exception as e:
                logger.warning(f"Gemini initialization failed: {e}")
                self.gemini_available = False
    
    async def summarize(self, text: str, options: Dict = None) -> Dict:
        """Summarize text using AI or fallback"""
        try:
            options = options or {}
            summary_type = options.get('type', 'key-points')
            length = options.get('length', 'medium')
            
            # Try Gemini API
            if self.gemini_available:
                prompt = f"""Summarize the following text in {length} length focusing on {summary_type}.
                
Text: {text[:5000]}

Provide a clear, concise summary:"""
                
                response = self.model.generate_content(prompt)
                return {
                    'success': True,
                    'result': response.text,
                    'method': 'gemini'
                }
            
            # Fallback to extractive summarization
            summary = self._extractive_summarize(text, length)
            return {
                'success': True,
                'result': summary,
                'method': 'extractive'
            }
            
        except Exception as e:
            logger.error(f"Summarization error: {e}")
            return {
                'success': False,
                'error': str(e),
                'result': self._extractive_summarize(text, length)
            }
    
    async def rewrite(self, text: str, options: Dict = None) -> Dict:
        """Rewrite text with specified tone and reading level"""
        try:
            options = options or {}
            tone = options.get('tone', 'neutral')
            reading_level = options.get('readingLevel', 'intermediate')
            
            # Try Gemini API
            if self.gemini_available:
                prompt = f"""Rewrite the following text with a {tone} tone at a {reading_level} reading level.
Keep the meaning the same but adjust the style and vocabulary appropriately.

Text: {text}

Rewritten version:"""
                
                response = self.model.generate_content(prompt)
                return {
                    'success': True,
                    'result': response.text,
                    'method': 'gemini'
                }
            
            # Fallback to simple rewriting
            rewritten = self._simple_rewrite(text, tone)
            return {
                'success': True,
                'result': rewritten,
                'method': 'heuristic'
            }
            
        except Exception as e:
            logger.error(f"Rewrite error: {e}")
            return {
                'success': False,
                'error': str(e),
                'result': self._simple_rewrite(text, tone)
            }
    
    async def proofread(self, text: str, options: Dict = None) -> Dict:
        """Proofread and correct text"""
        try:
            # Try Gemini API
            if self.gemini_available:
                prompt = f"""Proofread and correct the following text. Fix spelling, grammar, and punctuation errors.
Return ONLY the corrected text, no explanations.

Text: {text}

Corrected version:"""
                
                response = self.model.generate_content(prompt)
                return {
                    'success': True,
                    'result': response.text,
                    'method': 'gemini'
                }
            
            # Fallback to basic corrections
            corrected = self._basic_proofread(text)
            return {
                'success': True,
                'result': corrected,
                'method': 'basic'
            }
            
        except Exception as e:
            logger.error(f"Proofread error: {e}")
            return {
                'success': False,
                'error': str(e),
                'result': self._basic_proofread(text)
            }
    
    async def translate(self, text: str, target_lang: str, options: Dict = None) -> Dict:
        """Translate text to target language"""
        try:
            lang_names = {
                'es': 'Spanish', 'fr': 'French', 'de': 'German',
                'it': 'Italian', 'pt': 'Portuguese', 'ja': 'Japanese',
                'zh': 'Chinese', 'ko': 'Korean', 'ru': 'Russian', 'ar': 'Arabic'
            }
            
            target_name = lang_names.get(target_lang, target_lang)
            
            # Try Gemini API
            if self.gemini_available:
                prompt = f"""Translate the following English text to {target_name}.
Return ONLY the translation, no explanations.

Text: {text}

{target_name} translation:"""
                
                response = self.model.generate_content(prompt)
                return {
                    'success': True,
                    'result': response.text,
                    'method': 'gemini',
                    'target_language': target_lang
                }
            
            # Fallback message
            return {
                'success': False,
                'result': f"[Translation to {target_name} requires API key. Original: {text}]",
                'method': 'none',
                'target_language': target_lang
            }
            
        except Exception as e:
            logger.error(f"Translation error: {e}")
            return {
                'success': False,
                'error': str(e),
                'result': f"[Translation failed: {text}]"
            }
    
    async def generate_alt_text(self, context: str, current_alt: str = "", options: Dict = None) -> Dict:
        """Generate image alt text based on context"""
        try:
            # Try Gemini API
            if self.gemini_available:
                prompt = f"""Generate descriptive alt text for an image (max 125 characters).

Context: {context[:500]}
Current alt text: {current_alt}

Provide improved alt text:"""
                
                response = self.model.generate_content(prompt)
                alt_text = response.text[:125]  # Enforce limit
                
                return {
                    'success': True,
                    'result': alt_text,
                    'method': 'gemini'
                }
            
            # Fallback
            if current_alt:
                return {'success': True, 'result': current_alt, 'method': 'existing'}
            
            alt_text = f"Image: {context[:100]}" if context else "Image description unavailable"
            return {
                'success': True,
                'result': alt_text,
                'method': 'context'
            }
            
        except Exception as e:
            logger.error(f"Alt text generation error: {e}")
            return {
                'success': False,
                'error': str(e),
                'result': current_alt or "Image"
            }
    
    async def eli5(self, text: str, options: Dict = None) -> Dict:
        """Explain Like I'm 5 - Simplify text for beginners"""
        try:
            if self.gemini_available:
                prompt = f"""Explain the following text in very simple terms, as if explaining to a 5-year-old child. Use simple words, short sentences, and everyday examples.

Text: {text}

Simple explanation:"""
                
                response = self.model.generate_content(prompt)
                return {
                    'success': True,
                    'result': response.text,
                    'method': 'gemini'
                }
            
            # Fallback: Simple text simplification
            simplified = self._simple_simplify(text)
            return {
                'success': True,
                'result': simplified,
                'method': 'basic'
            }
            
        except Exception as e:
            logger.error(f"ELI5 error: {e}")
            return {
                'success': False,
                'error': str(e),
                'result': text
            }
    
    async def side_by_side_translate(self, text: str, target_lang: str, options: Dict = None) -> Dict:
        """Translate with side-by-side comparison"""
        try:
            translation_result = await self.translate(text, target_lang, options)
            
            # Split into lines for side-by-side view
            original_lines = text.split('\n')
            translated_lines = translation_result.get('result', '').split('\n')
            
            # Align lines
            aligned = []
            max_lines = max(len(original_lines), len(translated_lines))
            for i in range(max_lines):
                original = original_lines[i] if i < len(original_lines) else ''
                translated = translated_lines[i] if i < len(translated_lines) else ''
                aligned.append({
                    'original': original,
                    'translated': translated
                })
            
            return {
                'success': True,
                'aligned': aligned,
                'original': text,
                'translated': translation_result.get('result'),
                'method': translation_result.get('method'),
                'target_language': target_lang
            }
            
        except Exception as e:
            logger.error(f"Side-by-side translation error: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    async def generate_quiz(self, text: str, options: Dict = None) -> Dict:
        """Generate quiz questions from text"""
        try:
            options = options or {}
            num_questions = options.get('num_questions', 5)
            
            if self.gemini_available:
                prompt = f"""Generate {num_questions} multiple-choice quiz questions based on the following text. 
Each question should have 4 options with one correct answer.
Format as JSON array with structure: [{{"question": "...", "options": ["A", "B", "C", "D"], "correct": 0}}]

Text: {text[:3000]}

Quiz questions (JSON):"""
                
                response = self.model.generate_content(prompt)
                import json
                questions = json.loads(response.text)
                
                return {
                    'success': True,
                    'questions': questions,
                    'method': 'gemini'
                }
            
            # Fallback: Generate simple questions
            questions = self._generate_simple_quiz(text, num_questions)
            return {
                'success': True,
                'questions': questions,
                'method': 'basic'
            }
            
        except Exception as e:
            logger.error(f"Quiz generation error: {e}")
            return {
                'success': False,
                'error': str(e),
                'questions': []
            }
    
    def _simple_simplify(self, text: str) -> str:
        """Basic text simplification"""
        # Replace complex words with simpler ones
        simplifications = {
            'utilize': 'use',
            'commence': 'start',
            'terminate': 'end',
            'approximately': 'about',
            'consequently': 'so',
            'therefore': 'so',
            'however': 'but',
            'nevertheless': 'but',
            'additionally': 'also',
            'furthermore': 'also'
        }
        
        result = text
        for complex_word, simple_word in simplifications.items():
            result = re.sub(r'\b' + complex_word + r'\b', simple_word, result, flags=re.IGNORECASE)
        
        return result
    
    def _generate_simple_quiz(self, text: str, num_questions: int) -> list:
        """Generate basic quiz questions from text"""
        sentences = sent_tokenize(text)
        questions = []
        
        for i, sentence in enumerate(sentences[:num_questions]):
            words = sentence.split()
            if len(words) > 5:
                # Create fill-in-the-blank question
                blank_index = len(words) // 2
                correct_word = words[blank_index]
                question_text = ' '.join(words[:blank_index] + ['_____'] + words[blank_index+1:])
                
                questions.append({
                    'question': question_text,
                    'options': [correct_word, 'option1', 'option2', 'option3'],
                    'correct': 0
                })
        
        return questions
    
    # Fallback methods
    
    def _extractive_summarize(self, text: str, length: str = 'medium') -> str:
        """Extractive summarization using sentence scoring"""
        try:
            sentences = sent_tokenize(text)
            if len(sentences) <= 3:
                return text
            
            # Score sentences by word frequency and position
            stop_words = set(stopwords.words('english'))
            word_freq = {}
            
            for sentence in sentences:
                words = re.findall(r'\w+', sentence.lower())
                for word in words:
                    if word not in stop_words:
                        word_freq[word] = word_freq.get(word, 0) + 1
            
            # Score sentences
            sentence_scores = []
            for i, sentence in enumerate(sentences):
                words = re.findall(r'\w+', sentence.lower())
                score = sum(word_freq.get(word, 0) for word in words if word not in stop_words)
                score += (len(sentences) - i) * 0.3  # Position bonus
                sentence_scores.append((sentence, score))
            
            # Select top sentences
            num_sentences = {'short': 2, 'medium': 3, 'long': 5}.get(length, 3)
            num_sentences = min(num_sentences, len(sentences))
            
            top_sentences = sorted(sentence_scores, key=lambda x: x[1], reverse=True)[:num_sentences]
            top_sentences = sorted(top_sentences, key=lambda x: sentences.index(x[0]))
            
            return ' '.join(s[0] for s in top_sentences)
            
        except Exception as e:
            logger.error(f"Extractive summarization error: {e}")
            return text[:500] + "..." if len(text) > 500 else text
    
    def _simple_rewrite(self, text: str, tone: str) -> str:
        """Simple rewriting using pattern replacement"""
        result = text
        
        if tone == 'formal':
            replacements = {
                r"\bdon't\b": "do not", r"\bcan't\b": "cannot",
                r"\bwon't\b": "will not", r"\bit's\b": "it is",
                r"\bthat's\b": "that is", r"\bI'm\b": "I am"
            }
        elif tone == 'friendly':
            replacements = {
                r"\bdo not\b": "don't", r"\bcannot\b": "can't",
                r"\bwill not\b": "won't", r"\bit is\b": "it's",
                r"\bthat is\b": "that's", r"\bI am\b": "I'm"
            }
        else:
            return text
        
        for pattern, replacement in replacements.items():
            result = re.sub(pattern, replacement, result, flags=re.IGNORECASE)
        
        return result
    
    def _basic_proofread(self, text: str) -> str:
        """Basic proofreading corrections"""
        result = text
        
        # Fix multiple spaces
        result = re.sub(r'\s+', ' ', result)
        
        # Fix space before punctuation
        result = re.sub(r'\s+([.,!?;:])', r'\1', result)
        
        # Fix missing space after punctuation
        result = re.sub(r'([.,!?;:])([A-Z])', r'\1 \2', result)
        
        # Fix lowercase 'i'
        result = re.sub(r'\bi\b', 'I', result)
        
        # Capitalize first letter of sentences
        result = re.sub(r'(^\w|[.!?]\s+\w)', lambda m: m.group(0).upper(), result)
        
        # Trim
        result = result.strip()
        
        return result


# Global instance
ai_processor = AIProcessor()
