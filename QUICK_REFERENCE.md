# Quick Reference Card

## 🚀 Deployment Checklist

### Local Testing
```bash
# 1. Get Groq API key from console.groq.com
# 2. Edit agent.html line 625 (temporarily, don't commit)
# 3. Test locally
python -m http.server 8000
# Visit http://localhost:8000/agent.html
```

### Secure Deployment to GitHub Pages
```bash
# 1. Add API key to GitHub Secrets
#    Repo → Settings → Secrets → Actions → New secret
#    Name: GROQ_API_KEY
#    Value: gsk_your_actual_key

# 2. Configure Pages to use Actions
#    Repo → Settings → Pages → Source: GitHub Actions

# 3. Push code
git add .
git commit -m "Deploy secure AI portfolio"
git push origin main

# 4. Check Actions tab for deployment status
#    Should complete in ~2 minutes
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `index.html` | Homepage with hero section |
| `agent.html` | AI agent chat (⭐ main feature) |
| `blog.html` | Blog placeholder |
| `.github/workflows/deploy.yml` | GitHub Actions deployment |
| `SECURITY_GUIDE.md` | API key security instructions |
| `SETUP.md` | 5-minute quick start |
| `README.md` | Full documentation |

---

## 🔑 API Key Security

**✅ Secure (Recommended):**
```bash
# API key in GitHub Secrets
# GitHub Actions injects it at build time
# Repo code stays clean
```

**⚠️ Quick & Dirty (Testing Only):**
```bash
# Put key directly in agent.html
# Good for local testing
# DON'T commit to GitHub
```

**🔒 Most Secure (Production):**
```bash
# Deploy Fly.io backend
# See README.md for instructions
# API key never leaves server
```

---

## 🎯 Sharing with Recruiters

### Best Link to Share
```
https://brunose.github.io/agent.html
```

### What to Say
"Check out my interactive AI portfolio - try asking the AI about my RAG optimization work or LLM agent experience!"

### Email Template
```
Hi [Recruiter],

I'm interested in the [Position] role at [Company].

I recently built an AI-powered portfolio where you can chat with
an agent about my experience: https://brunose.github.io/agent.html

Some questions to try:
• "What's Bruno's experience with LLM agents?"
• "Tell me about Bruno's RAG projects"
• "What certifications does Bruno have?"

I'd love to discuss how my work reducing AI response latency
by 80% could help with [Company's AI initiative].

Best,
Bruno
```

---

## 🛠️ Common Tasks

### Update Knowledge Base
```bash
# Edit agent.html, line 630-717
# Update BRUNO_KNOWLEDGE constant with new experience
```

### Regenerate Groq API Key
```bash
# 1. Go to console.groq.com/keys
# 2. Delete old key, create new one
# 3. Update GitHub Secret (Settings → Secrets → GROQ_API_KEY)
# 4. Re-run deployment (push new commit or re-run workflow)
```

### Check API Usage
```
Visit: https://console.groq.com/settings/limits
Monitor: Requests, tokens, rate limits
```

### Add Blog Post
```bash
# 1. Create file: _posts/2025-01-17-my-post.md
# 2. Add front matter and content
# 3. Update blog.html to show posts (or use Jekyll)
```

---

## 🐛 Troubleshooting

### Agent Not Working
```bash
# Check browser console (F12 → Console)
# Common errors:
# - "Please configure your Groq API key" → Key not set
# - "Groq API error: 401" → Invalid key
# - "Groq API error: 429" → Rate limited (wait 1 min)
```

### GitHub Pages Not Updating
```bash
# 1. Check Actions tab for errors
# 2. Verify Pages source is "GitHub Actions"
# 3. Wait 2-3 minutes, then hard refresh (Ctrl+Shift+R)
# 4. Check workflow file exists: .github/workflows/deploy.yml
```

### API Key Exposed in Repo
```bash
# 1. Delete API key from Groq console immediately
# 2. Remove from Git history:
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch agent.html" \
  --prune-empty --tag-name-filter cat -- --all
git push origin --force --all

# 3. Create new API key
# 4. Add to GitHub Secrets (not repo!)
```

---

## 📊 Success Metrics

Track over the next 30 days:
- [ ] Site deployed successfully
- [ ] AI agent responds correctly
- [ ] Shared with 5+ recruiters
- [ ] Added to LinkedIn profile
- [ ] Mentioned in interview
- [ ] Positive feedback received

---

## 🔗 Quick Links

- **Your Site**: https://brunose.github.io
- **Agent**: https://brunose.github.io/agent.html
- **Groq Console**: https://console.groq.com
- **GitHub Repo**: https://github.com/BrunoSE/brunose.github.io
- **LinkedIn**: https://www.linkedin.com/in/bruno-stefoni-escudero/

---

## 🆘 Need Help?

1. **Security**: Read [SECURITY_GUIDE.md](SECURITY_GUIDE.md)
2. **Setup**: Read [SETUP.md](SETUP.md)
3. **Agent Config**: Read [AGENT_CONFIG.md](AGENT_CONFIG.md)
4. **Full Docs**: Read [README.md](README.md)

---

## ⏱️ Time Estimates

| Task | Time |
|------|------|
| Get Groq API key | 2 min |
| Add to GitHub Secrets | 2 min |
| Configure Pages | 1 min |
| Push to GitHub | 1 min |
| Deployment completes | 2 min |
| **Total** | **~8 min** |

---

**You're ready to deploy! 🚀**
