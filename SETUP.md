# Quick Setup Guide

## 🚀 Get Your Website Running in 5 Minutes

### Step 1: Configure the AI Agent (2 minutes)

The AI agent needs an API key to work. You have two options:

#### Option A: Quick Testing (Free Groq API)

1. Go to [console.groq.com](https://console.groq.com) and sign up (free)
2. Create an API key
3. Open `agent.html` in your code editor
4. Find this section (around line 605):
```javascript
const CONFIG = {
    groqApiKey: 'YOUR_GROQ_API_KEY_HERE',  // Paste your key here
    useDirectGroq: true
};
```
5. Replace `YOUR_GROQ_API_KEY_HERE` with your actual key

⚠️ **Note**: This exposes your API key in the browser. Only use for testing or demos. For production, see Option B below.

#### Option B: Production Setup (Fly.io Backend)

See [README.md](README.md) for full Fly.io deployment instructions.

### Step 2: Test Locally (1 minute)

**Option 1 - Python**:
```bash
cd brunose.github.io
python -m http.server 8000
```

**Option 2 - Node.js**:
```bash
cd brunose.github.io
npx http-server -p 8000
```

Visit: `http://localhost:8000`

### Step 3: Secure Your API Key (5 minutes)

⚠️ **IMPORTANT**: Don't push your API key to GitHub!

**Recommended: Use GitHub Actions**

1. **Add API key to GitHub Secrets:**
   - Go to your repo: `Settings` → `Secrets and variables` → `Actions`
   - Click `New repository secret`
   - Name: `GROQ_API_KEY`
   - Value: Your actual Groq API key
   - Click `Add secret`

2. **Enable GitHub Actions for Pages:**
   - Go to `Settings` → `Pages`
   - Source: Select `GitHub Actions` (not "Deploy from a branch")

3. **The workflow is already set up** at `.github/workflows/deploy.yml`

**See [SECURITY_GUIDE.md](SECURITY_GUIDE.md) for detailed instructions!**

### Step 4: Push to GitHub (2 minutes)

```bash
cd brunose.github.io
git add .
git commit -m "Update website with modern design and AI agent"
git push origin main
```

**GitHub Actions will:**
- Inject your API key from secrets
- Deploy to `https://brunose.github.io`
- Keep your repo clean (no exposed keys)

Check the `Actions` tab to see the deployment progress (~1-2 min).

## ✅ What You Should See

1. **Homepage** (`/`): Modern landing page with gradient hero section
2. **AI Agent** (`/agent.html`): Working chat interface (if you configured API key)
3. **Blog** (`/blog.html`): Clean blog page with "coming soon" message

## 🎨 Customization Quick Wins

### Update Your Info (5 minutes)

1. **Social Links** - Edit `index.html` line 452-470
2. **Skills** - Edit `index.html` line 489-498
3. **AI Agent Knowledge** - Edit `agent.html` line 651-680

### Change Colors (2 minutes)

All colors are in CSS variables at the top of each HTML file:

```css
:root {
    --color-accent-primary: #3b82f6;  /* Change this for different accent color */
    --color-accent-secondary: #8b5cf6;  /* And this */
}
```

Try these color combos:
- **Green Tech**: `#10b981` and `#059669`
- **Purple Dream**: `#8b5cf6` and `#a855f7`
- **Coral Sunset**: `#f97316` and `#fb923c`

## 🐛 Troubleshooting

### AI Agent Not Working?

1. **Check Console**: Open browser DevTools (F12) → Console tab
2. **Common Issues**:
   - API key not set → Error: "Please configure your Groq API key"
   - Invalid API key → Error: "Groq API error: 401"
   - Rate limited → Error: "Groq API error: 429" (wait 1 minute)

### GitHub Pages Not Updating?

1. Go to your repo → Settings → Pages
2. Check if "Build and deployment" source is set to "Deploy from a branch"
3. Branch should be `main` and folder should be `/ (root)`
4. Wait 2-3 minutes and hard refresh (Ctrl+Shift+R)

## 📱 SEO & Social Sharing

### Create a Preview Image

Create an image at `assets/preview.png` (1200x630px) for social media previews.

Quick tool: [canva.com](https://canva.com/create/social-media-graphics/)

### Test Social Previews

- **LinkedIn**: [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- **Twitter**: [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- **Facebook**: [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)

## 🎯 Next Steps

1. ✅ Get Groq API key and test agent locally
2. ✅ Push to GitHub and verify deployment
3. 🔲 Create preview image for social sharing
4. 🔲 Add Google Analytics (optional)
5. 🔲 Deploy Fly.io backend for production agent
6. 🔲 Write your first blog post

## 💡 Tips for Recruiters

When sharing with recruiters:
- Lead with `/agent.html` - it's the most impressive
- Add a note: "Try asking the AI about my RAG projects or LLM agent experience"
- Include in your resume/LinkedIn: "Interactive AI portfolio with RAG-powered agent"

## 🆘 Need Help?

1. Check [README.md](README.md) for detailed docs
2. Check browser console for errors
3. Verify API key is valid at [console.groq.com](https://console.groq.com)

---

**Ready to impress recruiters? Let's go! 🚀**
