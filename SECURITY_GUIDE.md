# Security Guide: Deploying AI Agent to GitHub Pages

## The Problem

GitHub Pages is **static hosting** - it serves your files exactly as they are in your repository. This means:
- ❌ Can't hide API keys in environment variables
- ❌ Can't use server-side code to protect secrets
- ⚠️ Any API key in your code will be visible in the browser

## Solutions (From Easiest to Most Secure)

### ✅ Option 1: GitHub Actions with Secrets (RECOMMENDED)

**Pros:**
- API key never appears in your repo
- Free (included with GitHub)
- No additional infrastructure needed

**Cons:**
- API key is still visible in browser (but not in GitHub)
- Anyone can use your website and consume your API quota

**Setup (5 minutes):**

1. **Add API Key to GitHub Secrets:**
   - Go to your repo: `https://github.com/BrunoSE/brunose.github.io`
   - Click `Settings` → `Secrets and variables` → `Actions`
   - Click `New repository secret`
   - Name: `GROQ_API_KEY`
   - Value: Your actual Groq API key
   - Click `Add secret`

2. **Enable GitHub Actions for Pages:**
   - Go to `Settings` → `Pages`
   - Under "Build and deployment" → Source
   - Select `GitHub Actions` (instead of "Deploy from a branch")

3. **Push the workflow file:**
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "Add GitHub Actions deployment with secret injection"
   git push origin main
   ```

4. **That's it!** GitHub Actions will:
   - Replace `YOUR_GROQ_API_KEY_HERE` with your actual key
   - Deploy the site with the key injected
   - Your repo code stays clean (no exposed key)

**Limitations:**
- The key is still visible in browser DevTools (F12 → Sources)
- But it's NOT in your Git history
- Groq's free tier has rate limits, so abuse is limited

---

### ✅ Option 2: Fly.io Backend (MOST SECURE)

**Pros:**
- ✅ API key never leaves the server
- ✅ You can add authentication
- ✅ You can rate limit users
- ✅ You can monitor usage

**Cons:**
- Requires backend deployment (15-20 min setup)
- Slightly more complex

**This is already documented in the README.md!** Follow the "Fly.io Backend Setup" section.

**Quick summary:**
1. Deploy Python Flask backend to Fly.io (free tier)
2. Backend calls Groq API with your secret key
3. Frontend calls your Fly.io endpoint (no key needed)
4. Update `agent.html`:
   ```javascript
   const CONFIG = {
       apiUrl: 'https://your-app.fly.dev',
       groqApiKey: '',  // Empty!
       useDirectGroq: false  // Use backend
   };
   ```

---

### ✅ Option 3: Use Domain Whitelist + Groq Rate Limits (SIMPLEST)

**Pros:**
- No build step needed
- No backend needed
- Just commit and push

**Cons:**
- API key is visible in source code
- Anyone can copy your key and use it elsewhere

**Setup:**
1. Keep the key in `agent.html` as-is
2. Rely on Groq's built-in rate limits
3. Check usage at https://console.groq.com/settings/limits

**When to use:**
- Personal portfolio (low traffic)
- You're okay with public API key
- Groq free tier limits are acceptable

**To monitor usage:**
- Visit Groq console regularly
- Set up alerts in Groq (if available)
- Regenerate key if abused

---

## Comparison Table

| Method | Security | Complexity | Cost | Best For |
|--------|----------|------------|------|----------|
| **GitHub Actions** | 🔒 Medium | ⭐ Easy | Free | Most portfolios |
| **Fly.io Backend** | 🔒🔒 High | ⭐⭐ Medium | Free | Production use |
| **Public Key** | 🔓 Low | ⚐ Trivial | Free | Quick demos |

---

## Recommended Approach (Based on Your Needs)

### For Job Applications (Recommended: GitHub Actions)

You want recruiters to use it, but you don't want the key in your repo history.

**Use Option 1 (GitHub Actions):**
```bash
# 1. Add GROQ_API_KEY to GitHub Secrets
# 2. Enable GitHub Actions in Pages settings
# 3. Push the workflow
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions deployment"
git push origin main
```

**Why:**
- ✅ Key not in repo (cleaner for recruiters who view your code)
- ✅ Free tier abuse is limited by Groq
- ✅ No maintenance needed
- ✅ Fast setup (5 min)

---

## Step-by-Step: GitHub Actions Setup

### Step 1: Add Secret to GitHub

1. Go to: `https://github.com/BrunoSE/brunose.github.io/settings/secrets/actions`
2. Click `New repository secret`
3. Name: `GROQ_API_KEY`
4. Value: `gsk_...your_actual_key...`
5. Click `Add secret`

### Step 2: Configure GitHub Pages

1. Go to: `https://github.com/BrunoSE/brunose.github.io/settings/pages`
2. Under "Build and deployment"
3. Source: Select `GitHub Actions` (not "Deploy from a branch")
4. Save

### Step 3: Push Workflow

```bash
cd brunose.github.io

# The workflow file already exists at .github/workflows/deploy.yml
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions deployment with secret injection"
git push origin main
```

### Step 4: Verify Deployment

1. Go to `Actions` tab in your repo
2. You should see a workflow running
3. Wait for it to complete (~1-2 min)
4. Visit `https://brunose.github.io/agent.html`
5. Test the agent!

### Step 5: Keep Your Repo Clean

The `agent.html` in your repo will still have `YOUR_GROQ_API_KEY_HERE`.
This is **intentional** - the workflow replaces it at build time.

Do **NOT** commit the actual API key to the repo!

---

## Testing Locally vs. Production

### Local Development (Before Pushing)

For local testing, you still need to manually add your key:

**Option A: Temporary local edit (don't commit)**
```javascript
// In agent.html (local only)
const CONFIG = {
    groqApiKey: 'gsk_your_key_here',  // For testing only
    useDirectGroq: true
};
```

**Option B: Use a separate local file**
```bash
# Create a local config (gitignored)
echo "const LOCAL_GROQ_KEY = 'gsk_your_key_here';" > local-config.js

# In agent.html, add before the CONFIG:
<script src="local-config.js"></script>
<script>
const CONFIG = {
    groqApiKey: LOCAL_GROQ_KEY || 'YOUR_GROQ_API_KEY_HERE',
    useDirectGroq: true
};
</script>
```

**Add to .gitignore:**
```bash
echo "local-config.js" >> .gitignore
```

### Production (GitHub Pages)

GitHub Actions injects the key automatically from secrets.

---

## Security Checklist

Before deploying:

- [ ] API key is added to GitHub Secrets
- [ ] GitHub Pages source is set to "GitHub Actions"
- [ ] `.github/workflows/deploy.yml` exists
- [ ] `agent.html` still has `YOUR_GROQ_API_KEY_HERE` (not your real key)
- [ ] `.gitignore` includes `.env` and local config files
- [ ] Tested locally with temporary key
- [ ] Committed and pushed workflow
- [ ] Verified workflow ran successfully
- [ ] Tested deployed site at brunose.github.io/agent.html

---

## What If Someone Steals My Key?

### If using GitHub Actions:
- They'd need to inspect browser source (DevTools)
- They can use your agent, but:
  - Groq has rate limits (30 req/min on free tier)
  - You can monitor usage in Groq console
  - You can regenerate the key anytime

### To Regenerate Key:

1. Go to https://console.groq.com/keys
2. Delete old key
3. Create new key
4. Update GitHub Secret:
   - Go to repo `Settings` → `Secrets and variables` → `Actions`
   - Click on `GROQ_API_KEY`
   - Click `Update secret`
   - Paste new key
5. Re-run workflow (or just push a new commit)

---

## Monitoring Usage

### Check Groq Usage:
1. Visit https://console.groq.com/settings/limits
2. Monitor:
   - Daily requests
   - Token usage
   - Rate limit hits

### Set Alerts (if needed):
- Check Groq console for notification settings
- Or manually check weekly

### Signs of Abuse:
- Usage spikes when you didn't use the site
- Rate limit errors
- Unexpected token consumption

**Action:** Regenerate key immediately

---

## For Future: Migrate to Fly.io

Once you're getting interviews and want to make it production-grade:

1. Follow [README.md](README.md) Fly.io Backend Setup
2. Update `agent.html`:
   ```javascript
   const CONFIG = {
       apiUrl: 'https://bruno-ai-agent.fly.dev',
       groqApiKey: '',
       useDirectGroq: false
   };
   ```
3. Now your key is 100% secure on the backend
4. Bonus: Add user authentication, analytics, etc.

---

## Summary: What to Do Right Now

**For a job-seeking portfolio:**

```bash
# 1. Add your Groq API key to GitHub Secrets
#    (Go to repo Settings → Secrets → New secret)
#    Name: GROQ_API_KEY
#    Value: your_actual_key

# 2. Configure GitHub Pages to use Actions
#    (Go to repo Settings → Pages → Source: GitHub Actions)

# 3. Push the workflow
cd brunose.github.io
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions deployment"
git push origin main

# 4. Wait ~2 minutes, then test
#    Visit: https://brunose.github.io/agent.html
```

**Done!** Your site is deployed with a secure API key. ✅

---

**Questions?** Check [README.md](README.md) or [SETUP.md](SETUP.md)
