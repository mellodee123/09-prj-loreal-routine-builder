# 🎯 EXACT WORKER CODE TO USE

## Copy This Entire Code Block

Paste **ALL of this** into your Cloudflare Worker editor (replace everything):

```javascript
export default {
  async fetch(request, env) {
    // Only allow POST requests
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const { messages } = await request.json();

      // Call Perplexity API (includes web search + citations)
      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "pplx-7b-online", // Web-search enabled model
          messages: messages,
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        return new Response(`API Error: ${error}`, { status: response.status });
      }

      const data = await response.json();

      // Return in OpenAI-compatible format (frontend expects this)
      return new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: data.choices[0].message.content,
              },
            },
          ],
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  },
};
```

---

## ✅ Step-by-Step Instructions

### Step 1: Open Your Cloudflare Worker
1. Go to https://dash.cloudflare.com/
2. Click **Workers & Pages** (left sidebar)
3. Click on your Worker name
4. Click the **Editor** tab

### Step 2: Replace the Code
1. Click inside the code editor
2. Press **Ctrl+A** (or **Cmd+A** on Mac) to select ALL
3. Press **Delete** to clear everything
4. Paste the code above
5. Click **Deploy**

### Step 3: Add Environment Variable (CRITICAL!)
1. Click **Settings** tab (top of page)
2. Scroll to **Environment Variables**
3. Click **Add variable**
4. Enter:
   - **Name:** `PERPLEXITY_API_KEY`
   - **Value:** (paste your Perplexity API key here)
5. Click **Save and deploy**

> **Need a Perplexity API key?**
> Go to https://www.perplexity.ai/api, sign up (free), create a key, copy it

### Step 4: Test It
1. Open your L'Oréal app
2. Select some products
3. Click "Generate Routine"
4. You should see current info + clickable links!

---

## 🔍 What Each Part Does

| Code Part | What It Does |
|-----------|------------|
| `export default { async fetch...` | Cloudflare Worker structure |
| `if (request.method !== "POST")` | Only accepts POST requests |
| `const { messages }` | Gets the conversation from frontend |
| `fetch("https://api.perplexity.ai...` | Calls Perplexity (web search API) |
| `Bearer ${env.PERPLEXITY_API_KEY}` | Uses your API key from env variable |
| `model: "pplx-7b-online"` | Model that searches the web |
| `messages: messages` | Sends conversation history |
| `max_tokens: 1000` | Max response length |
| `JSON.stringify({ choices...` | Formats response like OpenAI (so frontend works) |

---

## 🆘 Troubleshooting

### "API Error" Appears
**Problem:** Environment variable not set or wrong

**Fix:**
1. Click **Settings** tab
2. Check that `PERPLEXITY_API_KEY` is listed
3. Verify the value is your actual API key (not empty)
4. Click **Save and deploy**

### "Method not allowed" Error
**Problem:** Frontend is not sending POST request

**Fix:** This shouldn't happen - check your `script.js` has correct Worker URL

### No web search results
**Problem:** Worker is working but API isn't returning search

**Fix:**
1. Check your Perplexity account has credits
2. Try a different query
3. Check Cloudflare Worker logs

---

## 📋 Checklist

Before testing:
- [ ] Code is pasted into Worker
- [ ] Worker is Deployed (check for green checkmark)
- [ ] `PERPLEXITY_API_KEY` environment variable is added
- [ ] Environment variable has your actual API key
- [ ] Settings → "Save and deploy" was clicked

After testing:
- [ ] App opens successfully
- [ ] Can select products
- [ ] "Generate Routine" button works
- [ ] Response includes current info
- [ ] Links are clickable
- [ ] No "API Error" message

---

## 💡 Quick Reference

**Worker does:**
- Receives conversation from frontend
- Calls Perplexity API (which searches web)
- Gets response with current info + links
- Sends back to frontend

**Frontend does:**
- Shows the response
- Converts markdown links to clickable HTML
- Displays everything beautifully

---

## 🚀 You're Ready!

Once you:
1. ✅ Paste this code
2. ✅ Deploy Worker
3. ✅ Add environment variable
4. ✅ Deploy again

Your chatbot will have web search! 🎉

Need help? Let me know what goes wrong!
