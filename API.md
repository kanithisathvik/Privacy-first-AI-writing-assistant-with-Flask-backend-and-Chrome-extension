# API Documentation

## Base URL

```
http://127.0.0.1:5000
```

## Endpoints

### Health Check

Check if the API is running and get version information.

**Endpoint**: `GET /`

**Response**:
```json
{
  "status": "ok",
  "message": "Privacy-first AI Writing Assistant API",
  "version": "1.0.0",
  "privacy": "All processing is done locally. No data is logged or sent to external servers."
}
```

**Example**:
```bash
curl http://127.0.0.1:5000/
```

---

### Comprehensive Text Analysis

Analyze text for grammar, readability, tone, and get writing suggestions.

**Endpoint**: `POST /api/analyze`

**Request Body**:
```json
{
  "text": "Your text to analyze goes here."
}
```

**Response**:
```json
{
  "grammar": [
    {
      "message": "Possible typo: you repeated a whitespace",
      "context": "text to  analyze",
      "offset": 10,
      "length": 2,
      "replacements": [" "],
      "rule": "DOUBLE_SPACE",
      "category": "Formatting"
    }
  ],
  "readability": {
    "flesch_reading_ease": 62.64,
    "flesch_kincaid_grade": 6.7,
    "smog_index": 9.7,
    "coleman_liau_index": 11.68,
    "automated_readability_index": 8.4,
    "difficulty": "Standard"
  },
  "statistics": {
    "word_count": 26,
    "sentence_count": 3,
    "character_count": 139,
    "paragraph_count": 1,
    "avg_word_length": 5.35,
    "avg_sentence_length": 8.67
  },
  "suggestions": [
    {
      "type": "passive_voice",
      "message": "Consider using active voice for more direct writing",
      "sentence": "The report was written by the team."
    }
  ],
  "tone": {
    "formality": "neutral",
    "sentiment": "neutral",
    "formal_keyword_count": 0,
    "informal_keyword_count": 0,
    "positive_keyword_count": 0,
    "negative_keyword_count": 0
  },
  "privacy_notice": "This analysis was performed locally. Your data was not sent to any external server."
}
```

**Error Responses**:

- `400 Bad Request` - No text provided or empty text
  ```json
  {
    "error": "No text provided"
  }
  ```

- `500 Internal Server Error` - Analysis failed
  ```json
  {
    "error": "An error occurred during text analysis. Please try again."
  }
  ```

**Example**:
```bash
curl -X POST http://127.0.0.1:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "This is a sample text for analysis. It contains multiple sentences."}'
```

**Python Example**:
```python
import requests

response = requests.post(
    'http://127.0.0.1:5000/api/analyze',
    json={'text': 'Your text here'}
)
result = response.json()
print(result)
```

**JavaScript Example**:
```javascript
fetch('http://127.0.0.1:5000/api/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: 'Your text here'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

---

### Grammar Checking Only

Get only grammar and spelling issues.

**Endpoint**: `POST /api/grammar`

**Request Body**:
```json
{
  "text": "Your text to check for grammar issues."
}
```

**Response**:
```json
{
  "issues": [
    {
      "message": "Sentence should start with a capital letter",
      "context": "your text to check",
      "offset": 0,
      "length": 1,
      "replacements": ["Y"],
      "rule": "UPPERCASE_SENTENCE_START",
      "category": "Capitalization"
    }
  ],
  "count": 1
}
```

**Example**:
```bash
curl -X POST http://127.0.0.1:5000/api/grammar \
  -H "Content-Type: application/json" \
  -d '{"text": "this sentence has grammar issues"}'
```

---

### Readability Analysis Only

Get only readability metrics.

**Endpoint**: `POST /api/readability`

**Request Body**:
```json
{
  "text": "Your text for readability analysis."
}
```

**Response**:
```json
{
  "flesch_reading_ease": 74.86,
  "flesch_kincaid_grade": 4.1,
  "smog_index": 0.0,
  "coleman_liau_index": 7.93,
  "automated_readability_index": 2.9,
  "difficulty": "Fairly Easy"
}
```

**Error Response** (text too short):
```json
{
  "error": "Could not analyze readability",
  "message": "Text may be too short or contain invalid characters"
}
```

**Example**:
```bash
curl -X POST http://127.0.0.1:5000/api/readability \
  -H "Content-Type: application/json" \
  -d '{"text": "This is a simple text. It should be easy to read."}'
```

---

## Response Field Descriptions

### Grammar Issues

- `message`: Description of the grammar issue
- `context`: The surrounding text where the issue occurs
- `offset`: Character position where the issue starts
- `length`: Length of the problematic text
- `replacements`: Suggested corrections (up to 3)
- `rule`: The grammar rule identifier
- `category`: Category of the issue (e.g., "Spelling", "Grammar")

### Readability Metrics

- `flesch_reading_ease`: 0-100 scale (higher = easier to read)
  - 90-100: Very Easy (5th grade)
  - 80-90: Easy (6th grade)
  - 70-80: Fairly Easy (7th grade)
  - 60-70: Standard (8th-9th grade)
  - 50-60: Fairly Difficult (10th-12th grade)
  - 30-50: Difficult (College)
  - 0-30: Very Difficult (College graduate)

- `flesch_kincaid_grade`: US school grade level
- `smog_index`: Years of education needed to understand
- `coleman_liau_index`: Grade level based on characters
- `automated_readability_index`: Another grade level metric
- `difficulty`: Human-readable difficulty level

### Statistics

- `word_count`: Total number of words
- `sentence_count`: Total number of sentences
- `character_count`: Total characters (excluding spaces)
- `paragraph_count`: Number of paragraphs (separated by double newlines)
- `avg_word_length`: Average characters per word
- `avg_sentence_length`: Average words per sentence

### Suggestions

- `type`: Type of suggestion
  - `passive_voice`: Detected passive voice
  - `long_sentence`: Sentence is too long (>25 words)
  - `repeated_words`: Unnecessary word repetition
- `message`: Description of the suggestion
- `sentence`: The sentence with the issue

### Tone Analysis

- `formality`: "formal", "informal", or "neutral"
- `sentiment`: "positive", "negative", or "neutral"
- `formal_keyword_count`: Number of formal keywords detected
- `informal_keyword_count`: Number of informal keywords detected
- `positive_keyword_count`: Number of positive keywords detected
- `negative_keyword_count`: Number of negative keywords detected

---

## Rate Limiting

Currently, there is no rate limiting implemented. The API is designed for local use only.

## CORS

CORS is enabled for all origins to allow the Chrome extension to communicate with the API.

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `400`: Bad request (missing or invalid input)
- `500`: Internal server error

Error responses always include an `error` field with a description.

## Privacy

All text processing is done locally. No data is:
- Sent to external servers
- Logged to files
- Stored in databases
- Transmitted over the network (except localhost)

## Examples Directory

See `example_usage.py` in the repository for a complete working example of using the API.

---

*Last Updated*: October 28, 2025
