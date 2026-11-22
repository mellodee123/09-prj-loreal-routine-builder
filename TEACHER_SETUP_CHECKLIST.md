# 👨‍🏫 Teacher Setup Checklist - Web Search Implementation

This guide walks you through enabling web search for your students' L'Oréal Routine Builder projects.

---

## 📋 Checklist

### Phase 1: Get API Keys ✅

- [ ] **Tavily API Key**
  - Go to https://tavily.com
  - Click "Get Started"
  - Sign up for free account
  - Copy API key
  - Save it temporarily

- [ ] **OpenAI API Key**
  - Should already have this
  - Have it ready for next step

### Phase 2: Update Cloudflare Worker ✅

- [ ] **Access Cloudflare Dashboard**
  - Log in to https://dash.cloudflare.com
  - Navigate to Workers & Pages
  - Find your L'Oréal Worker

- [ ] **Update Worker Code**
  - Find the file: `TAVILY_WORKER_SETUP.md`
  - Copy the complete Worker code
  - Replace your current Worker code with this code
  - Save changes

- [ ] **Add Environment Variables**
  - Go to Worker Settings → Variables
  - Add variable #1:
    - **Name:** `OPENAI_API_KEY`
    - **Value:** `sk-...` (paste your OpenAI key)
    - Click "Encrypt"
  - Add variable #2:
    - **Name:** `TAVILY_API_KEY`
    - **Value:** (paste your Tavily key)
    - Click "Encrypt"

- [ ] **Deploy Worker**
  - Click "Deploy"
  - Wait for confirmation
  - Test the Worker URL works

### Phase 3: Test the Implementation ✅

**Test 1: Search Functionality**
```bash
curl -X POST https://your-worker-url.workers.dev/ \
  -H "Content-Type: application/json" \
  -d '{
    "action": "search",
    "query": "skincare tips"
  }'
```
Expected: JSON response with search results

**Test 2: Chat Still Works**
```bash
curl -X POST https://your-worker-url.workers.dev/ \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "system", "content": "You are a skincare advisor"},
      {"role": "user", "content": "Tell me about moisturizers"}
    ]
  }'
```
Expected: JSON response with AI message

**Test 3: In Browser**
1. Load student's app
2. Click 🔍 Search button
3. Enter "skincare"
4. See results appear
5. Click a result link
6. Verify chat still works

### Phase 4: Notify Students ✅

- [ ] **Share Setup Completion**
  - Tell students the feature is live
  - Explain what the 🔍 button does
  - Show them example searches

- [ ] **Share Documentation**
  - Post `QUICK_START_WEBSEARCH.md`
  - Share `IMPLEMENTATION_SUMMARY.md`
  - Answer any questions

---

## 🔧 Troubleshooting

### "API Error: 401" When Searching
**Cause:** Tavily API key is missing or incorrect
**Fix:** 
1. Check Tavily key in Cloudflare variables
2. Verify key hasn't been regenerated
3. Re-add key if needed

### "API Error: 401" For Chat
**Cause:** OpenAI API key is missing or incorrect
**Fix:**
1. Check OpenAI key in Cloudflare variables
2. Verify key is still valid
3. Re-add key if needed

### Search Results Not Showing
**Cause:** Worker code not properly deployed
**Fix:**
1. Check Worker code is correct
2. Verify environment variables are set
3. Redeploy Worker
4. Wait 30 seconds for cache clear

### CORS Errors in Console
**Cause:** Worker CORS headers missing
**Fix:**
1. Verify Worker code includes:
   ```javascript
   "Access-Control-Allow-Origin": "*"
   ```
2. Redeploy Worker

### Modal Not Opening
**Cause:** Frontend JavaScript issue
**Fix:**
1. Clear browser cache
2. Force refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check browser console for errors

---

## 📊 Tavily API Limits

**Free Tier:**
- 1,000 API calls/month
- 5 results per search
- Includes snippets
- Fast response times

**To Monitor Usage:**
1. Log in to https://tavily.com
2. Go to Dashboard
3. Check "Usage" section
4. See calls used this month

**If you exceed limits:**
- Searches will start failing
- Upgrade to paid plan
- Contact Tavily support

---

## 🔐 Security Checklist

- [ ] **API Keys Secured**
  - Keys are in Cloudflare variables (encrypted)
  - Keys are NOT in GitHub repository
  - Keys are NOT in student code
  
- [ ] **CORS Configured**
  - Worker allows requests from students
  - Frontend can communicate with Worker

- [ ] **Frontend Has No Keys**
  - Check `script.js` - no API keys visible
  - Check `index.html` - no API keys visible
  - Run: `grep -r "sk-\|OPENAI\|TAVILY" .` - should return nothing

---

## 📱 Testing Checklist

- [ ] Search button appears (🔍)
- [ ] Modal opens when clicked
- [ ] Can type in search box
- [ ] Search returns results
- [ ] Results are clickable
- [ ] Links open in new tabs
- [ ] Close button (×) works
- [ ] Chat still works
- [ ] Mobile layout works
- [ ] Dark mode works

---

## ✅ Deployment Verification

1. **Check Worker Status**
   ```bash
   curl https://your-worker-url.workers.dev/
   ```
   Should return: `Method not allowed` (expected for GET)

2. **Check Search Works**
   ```bash
   curl -X POST https://your-worker-url.workers.dev/ \
     -H "Content-Type: application/json" \
     -d '{"action":"search","query":"test"}'
   ```
   Should return JSON with results

3. **Check Chat Works**
   ```bash
   curl -X POST https://your-worker-url.workers.dev/ \
     -H "Content-Type: application/json" \
     -d '{"messages":[{"role":"user","content":"Hi"}]}'
   ```
   Should return JSON with AI response

---

## 📧 Student Support

**Common Questions:**

**Q: Why do I see a search button?**
A: Your teacher set up web search using Tavily API. Click it to search the web!

**Q: What can I search for?**
A: Anything related to skincare, beauty, L'Oréal products, routines, etc.

**Q: Why is my search not working?**
A: Check if your teacher has deployed the Worker. Ask them to verify setup.

**Q: Can I search for anything?**
A: Yes! Search for skincare tips, product reviews, beauty trends, etc.

**Q: Does this cost anything?**
A: No! It's completely free (teacher has 1,000 searches/month).

---

## 🎓 Next Steps

1. ✅ Complete setup checklist
2. ✅ Test all functionality
3. ✅ Notify students
4. ✅ Monitor Tavily usage
5. ✅ Support students as needed

---

## 📞 Support Resources

- **Tavily Docs:** https://tavily.com/api
- **Cloudflare Workers:** https://workers.cloudflare.com
- **OpenAI API:** https://platform.openai.com
- **Student Guide:** `QUICK_START_WEBSEARCH.md`
- **Implementation Details:** `TAVILY_WORKER_SETUP.md`

---

**Status: Ready to Deploy! 🚀**

Questions? Check the documentation files in the repository.
