# AI Agent Configuration Guide

## 🎯 Quick Config for Testing (5 minutes)

### Step 1: Get Free Groq API Key

1. Visit [console.groq.com](https://console.groq.com)
2. Sign up with Google/GitHub (free, no credit card required)
3. Click "API Keys" in left sidebar
4. Click "Create API Key"
5. Copy the key (starts with `gsk_`)

### Step 2: Update agent.html

Open `agent.html` and find the `CONFIG` section (around line 605):

```javascript
// BEFORE
const CONFIG = {
    apiUrl: 'YOUR_FLYIO_BACKEND_URL_HERE',
    groqApiKey: 'YOUR_GROQ_API_KEY_HERE',
    useDirectGroq: true
};

// AFTER (paste your actual key)
const CONFIG = {
    apiUrl: 'YOUR_FLYIO_BACKEND_URL_HERE',
    groqApiKey: 'gsk_abc123...your_actual_key',  // ✅ Your key here
    useDirectGroq: true  // ✅ Keep as true for testing
};
```

### Step 3: Test It!

```bash
# Open terminal in the brunose.github.io directory
python -m http.server 8000
```

Visit `http://localhost:8000/agent.html` and try asking:
- "What's Bruno's experience with LLM agents?"
- "Tell me about Bruno's RAG projects"
- "What certifications does Bruno have?"

## 📝 Customizing the Knowledge Base

The AI agent knows about you through the `BRUNO_KNOWLEDGE` variable in `agent.html` (around line 651).

### Current Knowledge Base Structure:

```javascript
const BRUNO_KNOWLEDGE = `
Bruno Stefoni - Principal AI/ML Engineer

EXPERIENCE:
- [Your experience here]

TECHNICAL SKILLS:
- [Your skills here]

KEY PROJECTS:
- [Your projects here]

CERTIFICATIONS:
- [Your certifications]

PUBLICATIONS:
- [Your publications]

EDUCATION:
- [Your education]
`.trim();
```

### How to Update:

1. **Add New Experience**: Add bullet points under `EXPERIENCE:`
2. **Add Skills**: List under `TECHNICAL SKILLS:`
3. **Add Projects**: Describe under `KEY PROJECTS:`
4. **Be Specific**: Include metrics, technologies, and outcomes

### Tips for Great Knowledge Base Content:

✅ **Good** (Specific):
```
- VideoAmp Agent System: Multi-agent architecture that improved
  query accuracy by 40% using intent filtering, knowledge injection,
  and response synthesis. Processed 1M+ queries/month.
```

❌ **Bad** (Vague):
```
- Worked on AI agent system at VideoAmp
```

## 🔒 Security Notes

### For Testing/Demo (Current Setup):

- ✅ Good for: Local testing, personal demos, portfolio reviews
- ⚠️ Warning: API key is visible in browser
- 🛡️ Mitigation: Groq has generous free tier with built-in rate limits

### For Production (Recommended):

Use the Fly.io backend (see [README.md](README.md)):

```javascript
const CONFIG = {
    apiUrl: 'https://your-app.fly.dev',
    groqApiKey: '',  // Empty - key is on backend
    useDirectGroq: false  // Use backend instead
};
```

## 🎨 Customizing Example Questions

In `agent.html`, find the example chips (around line 569):

```html
<div class="example-chips">
    <div class="example-chip" onclick="useExample(this)">
        What's Bruno's experience with LLM agents?
    </div>
    <div class="example-chip" onclick="useExample(this)">
        Tell me about Bruno's RAG projects
    </div>
    <!-- Add more here! -->
</div>
```

Add questions that highlight your best work:
- "Tell me about [your coolest project]"
- "What's Bruno's experience with [your specialty]?"
- "How did Bruno achieve [specific result]?"

## 🚀 Advanced Configuration

### Change AI Model

In `agent.html`, find the `callGroqAPI` function (around line 734):

```javascript
body: JSON.stringify({
    model: 'llama-3.3-70b-versatile',  // Try: llama-3.1-8b-instant, mixtral-8x7b-32768
    messages: [...],
    temperature: 0.7,  // Lower = more focused, Higher = more creative
    max_tokens: 500    // Increase for longer responses
})
```

**Available Groq Models**:
- `llama-3.3-70b-versatile` - Best quality (current)
- `llama-3.1-8b-instant` - Faster, lighter
- `mixtral-8x7b-32768` - Good balance

### Customize System Prompt

In the same function, modify the system message:

```javascript
{
    role: 'system',
    content: `You are BrunoAI, an enthusiastic AI assistant...

    [Add your own personality here!]

    Instructions:
    - Be [friendly/professional/technical]
    - Emphasize [your strengths]
    - Use [your preferred tone]
    `
}
```

## 🧪 Testing Checklist

Before pushing to production:

- [ ] AI agent responds to questions
- [ ] Responses are accurate (match your knowledge base)
- [ ] Example questions work when clicked
- [ ] Mobile responsive (test on phone)
- [ ] No console errors (F12 → Console)
- [ ] Loading states work (typing indicator)
- [ ] Error handling works (try with invalid API key)

## 📊 Usage Limits

### Groq Free Tier (as of 2025):
- **Requests**: ~30 requests per minute
- **Tokens**: Generous daily limit
- **Cost**: $0

For a portfolio site, this is more than enough!

### Monitoring Usage:

Check your usage at [console.groq.com/settings/limits](https://console.groq.com/settings/limits)

## 🐛 Common Issues

### "Please configure your Groq API key"
→ You forgot to replace `YOUR_GROQ_API_KEY_HERE` with your actual key

### "Groq API error: 401"
→ Invalid API key. Generate a new one at console.groq.com

### "Groq API error: 429"
→ Rate limited. Wait 60 seconds or switch to Fly.io backend

### Agent gives wrong information
→ Update the `BRUNO_KNOWLEDGE` variable with correct info

### Responses are too short/long
→ Adjust `max_tokens` in the API call (line 744)

## 🎓 Learning Resources

Want to improve the agent?

- [Groq Documentation](https://console.groq.com/docs)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [RAG Best Practices](https://www.pinecone.io/learn/retrieval-augmented-generation/)

## 💡 Ideas for Enhancement

Want to take it further?

1. **Document Upload**: Let recruiters upload your resume
2. **Conversation History**: Remember previous questions
3. **Voice Interface**: Add speech-to-text
4. **Analytics**: Track what recruiters ask about
5. **Multi-language**: Support other languages

See [README.md](README.md) for backend setup needed for these features.

---

**Questions?** Check the main [README.md](README.md) or [SETUP.md](SETUP.md)
