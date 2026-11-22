# 📝 Exact Steps: Update Your Cloudflare Worker

## Find Your Current Worker Code

1. Go to **Cloudflare Dashboard**
2. Click **Workers & Pages**
3. Click on your Worker name (probably something like "loreal-routine")
4. Click **Editor** tab
5. You should see code that looks like THIS (below)

---

## ⚠️ IMPORTANT: Check What You Currently Have

**Look for one of these patterns:**

### Pattern A: Using OpenAI (Most Common)
```javascript
export default {
  async fetch(request, env) {
    // ... some code ...
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      // ... fetch code ...
    });
    
    // ... rest of code ...
  }
};
```

### Pattern B: Using Perplexity
```javascript
export default {
  async fetch(request, env) {
    // ... some code ...
    
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      // ... fetch code ...
    });
    
    // ... rest of code ...
  }
};
```

### Pattern C: Something Else?
Let me know and I'll help you modify it!

---

## 🔄 To Replace Your Current Code

**Complete New Worker Code (Copy ALL of this):**

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

**How to Replace:**
1. In Cloudflare Worker Editor, select ALL code (Ctrl+A or Cmd+A)
2. Delete it
3. Paste the NEW code above
4. Click **Deploy**

---

## 🔑 Add Environment Variable

**CRITICAL STEP - Don't skip this!**

1. In your Cloudflare Worker page, click **Settings**
2. Find **Environment Variables** section
3. Click **Add variable**
4. Fill in:
   - **Variable name:** `PERPLEXITY_API_KEY`
   - **Value:** (Your Perplexity API key - get from https://www.perplexity.ai/api)
5. Click **Save and deploy**

---

## ✅ Verification Checklist

After you do this:

- [ ] New code is pasted into Worker
- [ ] Worker is Deployed
- [ ] Environment variable `PERPLEXITY_API_KEY` is added
- [ ] Environment variable has your actual API key
- [ ] Worker is re-deployed after adding env var

---

## 🧪 Quick Test

1. Open your app: `https://yoursite.com`
2. Select some L'Oréal products
3. Click "Generate Routine"
4. You should see:
   - Current information
   - Working links
   - Citations

If you see **"API Error"** → Check your environment variable is set correctly

---

## 🆘 If You Don't Have a Perplexity Key Yet

1. Go to https://www.perplexity.ai/api
2. Sign up (free account)
3. Create API key
4. Copy the key
5. Use it in Step 🔑 above

---

## 📋 Summary of Changes

| Part | Action |
|------|--------|
| **API Endpoint** | Change to Perplexity |
| **Model** | Use `pplx-7b-online` (web search enabled) |
| **Headers** | Add Perplexity auth header |
| **Body** | Adjust for Perplexity format |
| **Response** | Keep same OpenAI-compatible format |
| **Env Var** | Add `PERPLEXITY_API_KEY` |

---

## 🎉 That's It!

Your Worker now:
- ✅ Searches the web in real-time
- ✅ Returns current L'Oréal product info
- ✅ Includes automatic citations
- ✅ Works with your frontend (no changes needed)

The frontend's `markdownToHTML()` function will automatically:
- Convert links to clickable
- Format bold/italic text
- Display everything beautifully

Questions? Let me know!
