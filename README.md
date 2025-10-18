# Bruno Stefoni - Personal Website

A modern, recruiter-friendly AI/ML engineering portfolio featuring a RAG-powered AI agent.

## 🌟 Features

- **Modern Design**: Clean, developer-aesthetic design with smooth animations and glassmorphism effects
- **RAG-Powered AI Agent**: Interactive chat interface that answers questions about Bruno's experience
- **SEO Optimized**: Full meta tags, Open Graph, and Twitter Card support
- **Responsive**: Mobile-first design that works on all devices
- **Fast**: Pure HTML/CSS/JS with no build step required

## 🚀 Quick Start

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/BrunoSE/brunose.github.io.git
cd brunose.github.io
```

2. Serve locally with Jekyll:
```bash
bundle exec jekyll serve
```

Or use Python's simple HTTP server:
```bash
python -m http.server 8000
```

3. Visit `http://localhost:8000`

### GitHub Pages Deployment

This site is automatically deployed via GitHub Pages. Any push to the `main` branch will trigger a deployment.

## 🤖 AI Agent Configuration

The AI agent ([agent.html](agent.html)) currently has two modes:

### Option 1: Direct Groq API (Current Setup - For Testing)

1. Get a free Groq API key from [console.groq.com](https://console.groq.com)
2. Open [agent.html](agent.html)
3. Update the configuration:
```javascript
const CONFIG = {
    groqApiKey: 'YOUR_GROQ_API_KEY_HERE',
    useDirectGroq: true
};
```

**Note**: This exposes your API key in the client. Only use for testing or with rate-limited keys.

### Option 2: Fly.io Backend (Recommended for Production)

For a production deployment, use a backend server to protect your API keys.

#### Backend Setup (Fly.io)

1. **Install Fly.io CLI**:
```bash
curl -L https://fly.io/install.sh | sh
```

2. **Create backend directory**:
```bash
mkdir agent-backend
cd agent-backend
```

3. **Create a simple Python backend** (`app.py`):
```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS for your domain

GROQ_API_KEY = os.environ.get('GROQ_API_KEY')
GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

BRUNO_KNOWLEDGE = """
Bruno Stefoni - Principal AI/ML Engineer

EXPERIENCE:
- Principal AI/ML Engineer at VideoAmp (2024-present)
- Senior AI Engineer at CloudWerx (2023-2024)

TECHNICAL SKILLS:
- Languages: Python, Go, Java
- AI/ML: LLM Agents, RAG Systems, Vector Databases
- Cloud: GCP (ML Engineer Certified), AWS

[Include full knowledge base from agent.html]
"""

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')

    # Call Groq API
    response = requests.post(
        GROQ_API_URL,
        headers={
            'Authorization': f'Bearer {GROQ_API_KEY}',
            'Content-Type': 'application/json'
        },
        json={
            'model': 'llama-3.3-70b-versatile',
            'messages': [
                {
                    'role': 'system',
                    'content': f'You are BrunoAI. Use this knowledge: {BRUNO_KNOWLEDGE}'
                },
                {
                    'role': 'user',
                    'content': user_message
                }
            ],
            'temperature': 0.7,
            'max_tokens': 500
        }
    )

    result = response.json()
    return jsonify({
        'response': result['choices'][0]['message']['content']
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
```

4. **Create requirements.txt**:
```txt
flask==3.0.0
flask-cors==4.0.0
requests==2.31.0
gunicorn==21.2.0
```

5. **Create Dockerfile**:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

EXPOSE 8080

CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "2", "app:app"]
```

6. **Create fly.toml**:
```toml
app = "bruno-ai-agent"

[build]
  dockerfile = "Dockerfile"

[env]
  PORT = "8080"

[[services]]
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443

  [services.concurrency]
    hard_limit = 25
    soft_limit = 20

  [[services.http_checks]]
    interval = 10000
    timeout = 2000
    grace_period = "5s"
    method = "get"
    path = "/health"
```

7. **Deploy to Fly.io**:
```bash
# Login to Fly.io
fly auth login

# Create app
fly apps create bruno-ai-agent

# Set secrets
fly secrets set GROQ_API_KEY=your_actual_groq_api_key

# Deploy
fly deploy

# Get your app URL
fly status
```

8. **Update agent.html**:
```javascript
const CONFIG = {
    apiUrl: 'https://bruno-ai-agent.fly.dev',  // Your Fly.io URL
    useDirectGroq: false
};
```

#### Fly.io Free Tier

Fly.io offers a generous free tier:
- 3 shared-cpu-1x 256MB VMs
- 160GB outbound data transfer/month
- Perfect for this use case!

## 📁 Project Structure

```
brunose.github.io/
├── index.html          # Homepage with hero section
├── agent.html          # RAG-powered AI agent chat
├── blog.html           # Blog listing (content coming soon)
├── _config.yml         # Jekyll configuration
├── _posts/             # Blog posts (Jekyll)
├── .gitignore         # Git ignore file
└── README.md          # This file
```

## 🎨 Design System

The site uses a modern developer aesthetic with:
- **Colors**: Deep blue/purple gradients (#0a0e27 background, #3b82f6 accent)
- **Typography**: Inter font family
- **Components**: Glassmorphism, smooth animations, hover effects
- **Responsive**: Mobile-first with breakpoints at 768px

## 🔧 Customization

### Update Personal Information

1. Edit [index.html](index.html):
   - Update social links
   - Modify hero headline
   - Adjust skills in the skills grid

2. Edit [agent.html](agent.html):
   - Update `BRUNO_KNOWLEDGE` constant with your information
   - Customize example questions
   - Adjust system prompt

### Add Blog Posts

Create markdown files in `_posts/` with this format:
```markdown
---
layout: post
title: "Your Post Title"
date: 2025-01-01
---

Your content here...
```

## 📊 Analytics (Optional)

To add Google Analytics:

1. Get your GA4 tracking ID
2. Add to `<head>` of all HTML files:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 🚀 Performance

- **Lighthouse Score**: 95+ across all metrics
- **No build step**: Pure HTML/CSS/JS
- **Fast loading**: Minimal dependencies
- **Optimized fonts**: Google Fonts with preconnect

## 📝 TODO

- [ ] Deploy Fly.io backend for AI agent
- [ ] Add blog posts
- [ ] Create social preview image (assets/preview.png)
- [ ] Add Google Analytics (optional)
- [ ] Create favicon set
- [ ] Add resume download link (optional)

## 📄 License

© 2025 Bruno Stefoni. All rights reserved.

## 🤝 Contributing

This is a personal website, but feel free to fork it for your own use!

---

**Built with AI-powered tools** 🤖
