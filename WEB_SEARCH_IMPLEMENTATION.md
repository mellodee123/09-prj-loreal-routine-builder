# Web Search Implementation Guide for Instructors

This guide explains how to enable real-time web search with citations in the L'Oréal Routine Builder chatbot.

## Current Status

- ✅ Frontend is ready for web search responses
- ✅ Backend URL is configured
- ⚠️ **Cloudflare Worker needs to be updated** to use a web search API

## Recommended Implementation: Perplexity API

Perplexity is the simplest option because it has **built-in web search** and **automatic citations**.

### Step-by-Step for Instructors

#### 1. Get Perplexity API Key
- Visit https://www.perplexity.ai/api
- Sign up and create an API key
- Keep this key safe

#### 2. Update Cloudflare Worker

Log in to your Cloudflare account and **replace your Worker code** with this:

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

#### 3. Add Environment Variable to Worker

In Cloudflare Worker dashboard:
1. Click **Settings** → **Environment Variables**
2. Add a new variable:
   - **Variable name:** `PERPLEXITY_API_KEY`
   - **Value:** (Your Perplexity API key)
3. Click **Save**
4. **Redeploy** the Worker

#### 4. Test

- Open the app
- Select some L'Oréal products
- Click "Generate Routine"
- The response should now include current web information with citations

---

## Alternative: OpenAI + Google Search (Advanced)

If you prefer to stay with OpenAI but add web search, use Google Custom Search API:

```javascript
export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const { messages } = await request.json();

      // Extract the last user message to search for
      const lastUserMessage = messages
        .filter((m) => m.role === "user")
        .pop()?.content || "";

      let searchResults = "";

      // Search the web if the query is about products/routines
      if (lastUserMessage.toLowerCase().includes("loreal") || 
          lastUserMessage.toLowerCase().includes("skincare") ||
          lastUserMessage.toLowerCase().includes("routine") ||
          lastUserMessage.toLowerCase().includes("product")) {
        try {
          const searchResponse = await fetch(
            `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(lastUserMessage)}&key=${env.GOOGLE_API_KEY}&cx=${env.GOOGLE_SEARCH_ENGINE_ID}`
          );
          const searchData = await searchResponse.json();
          
          if (searchData.items) {
            searchResults = "\n\n**Current Web Search Results:**\n" + 
              searchData.items.slice(0, 3).map((item, i) => 
                `${i + 1}. [${item.title}](${item.link})\n   ${item.snippet}`
              ).join("\n");
          }
        } catch (e) {
          console.error("Search error:", e);
        }
      }

      // Enhance the user message with search results
      const enhancedMessages = [
        ...messages.slice(0, -1),
        {
          role: "user",
          content: messages[messages.length - 1].content + (searchResults || ""),
        },
      ];

      // Call OpenAI with the enriched context
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4.1",
          messages: enhancedMessages,
          temperature: 0.7,
          max_tokens: 1500,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();

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

**Environment variables needed:**
- `OPENAI_API_KEY`
- `GOOGLE_API_KEY` (from Google Cloud Console)
- `GOOGLE_SEARCH_ENGINE_ID` (from Custom Search Engine setup)

---

## Why Perplexity is Recommended

| Feature | Perplexity | OpenAI + Google |
|---------|-----------|-----------------|
| **Built-in Web Search** | ✅ Yes | ⚠️ Manual setup required |
| **Citations** | ✅ Automatic | ⚠️ You need to format them |
| **Ease of Setup** | ✅ 1 API key | ⚠️ 3 API keys needed |
| **Cost** | 💰 ~$0.01/request | 💰 ~$0.03/request |
| **Beginner-Friendly** | ✅ Perfect | ⚠️ More complex |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "API Error" in chat | Check that `PERPLEXITY_API_KEY` is set in Worker env vars |
| No web results | Verify the API key is correct and has available credits |
| Worker returns 500 | Check Cloudflare Worker logs for error details |
| Old information displayed | Perplexity searches on each request; cache may be on client side |

---

## What Students See (After Implementation)

**Before:** "What's the best L'Oréal moisturizer?"  
❌ Generic response without current prices or availability

**After:** "What's the best L'Oréal moisturizer?"  
✅ Response includes:
- Current product recommendations
- Real-time availability
- Pricing from multiple retailers
- Customer reviews (current)
- Direct links to purchase
- Sources cited at the bottom

