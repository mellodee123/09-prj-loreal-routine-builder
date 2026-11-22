# Web Search Setup - Quick Reference

## 🎯 Goal
Add real-time web search to your chatbot so it returns current information about L'Oréal products with citations.

---

## 📋 What You Need to Do

### Frontend (What You Already Did ✅)
- Updated system prompt to request web search results
- Students don't need to change anything else in `script.js`
- The Worker URL stays the same

### Backend (Cloudflare Worker) ⚙️
Your teacher/you need to update the Cloudflare Worker with one of these options:

---

## 🚀 Easiest Option: Perplexity API

**Step 1:** Get API key
- Go to https://www.perplexity.ai/api
- Sign up and get your API key

**Step 2:** Update Cloudflare Worker
- Copy the Worker code from `WORKER_SETUP.md` (Option 1)
- Paste it into your Cloudflare Worker

**Step 3:** Add Environment Variable
- In Cloudflare dashboard, go to your Worker settings
- Add variable: `PERPLEXITY_API_KEY` = your API key

**Step 4:** Test
- Select products in the app
- Click "Generate Routine"
- AI should return results with web search + citations ✅

---

## Alternative Options

| Option | Web Search | Citations | Difficulty | Cost |
|--------|-----------|-----------|------------|------|
| **Perplexity API** | ✅ Built-in | ✅ Automatic | 🟢 Easy | 💰 Free tier available |
| OpenAI Only | ❌ No | ❌ No | 🟢 Easy | 💰 Existing key |
| OpenAI + Google Search | ✅ Manual | ⚠️ Manual | 🟡 Medium | 💰 Requires 2 keys |

See `WORKER_SETUP.md` for code for all options.

---

## 🔍 How Web Search Works

**Without Web Search:**
```
User: "What's the best way to use L'Oréal Revitalift?"
AI: [Gives generic advice from training data - maybe outdated]
```

**With Web Search (Perplexity):**
```
User: "What's the best way to use L'Oréal Revitalift?"
AI: [Searches current info] "According to L'Oréal's official website, 
Revitalift should be applied to clean skin... [Source: loreal.com]"
```

---

## ⚠️ Important Notes

- **Frontend stays simple** - No API keys in `script.js` ✅
- **Worker handles everything** - API calls happen on backend
- **Citations are automatic** - Perplexity includes them in responses
- **Still private** - User selections never shared with search API, only the question

---

## Troubleshooting

**Q: How do I know if web search is working?**
A: Look for citations in the AI response like `[Source: loreal.com]`

**Q: Can I use OpenAI without web search?**
A: Yes, but it won't search the web. Use Perplexity for web search.

**Q: Where do I add the API key?**
A: In Cloudflare Worker environment variables (not in `script.js`)

**Q: Why can't I put the API key in script.js?**
A: Because `script.js` runs in the browser and would be visible to users!
The Worker runs on servers and keeps the key secret. ✅

---

## 📚 Resources

- Perplexity API: https://www.perplexity.ai/api
- Cloudflare Workers: https://workers.cloudflare.com
- OpenAI API: https://openai.com/api
- Google Custom Search: https://programmablesearchengine.google.com

---

## 📞 Still Confused?

1. Read `WORKER_SETUP.md` for detailed code examples
2. Ask your teacher for the Worker URL
3. Tell your teacher which API option you want to use
4. They'll update the Worker backend for you
