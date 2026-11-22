# 🔍 Cloudflare Worker with Tavily Web Search API

This guide shows you how to update your Cloudflare Worker to support both:
1. **Chat with OpenAI** (routine building)
2. **Web Search with Tavily** (search results in modal)

---

## 📋 Prerequisites

Before you start, have these ready:
- **OpenAI API Key** (from your teacher)
- **Tavily API Key** (free tier from https://tavily.com)
- **Cloudflare Worker URL** (from your teacher)

---

## 🚀 Updated Cloudflare Worker Code

Replace your Worker's current code with this:

```javascript
/**
 * L'Oréal Routine Builder Worker
 * Supports: OpenAI chat + Tavily web search
 * 
 * Environment Variables (set in Cloudflare):
 * - OPENAI_API_KEY: Your OpenAI API key
 * - TAVILY_API_KEY: Your Tavily API key
 */

export default {
  async fetch(request, env) {
    // Allow CORS requests from your frontend
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const body = await request.json();
      const action = body.action || "chat";

      // Handle web search requests
      if (action === "search") {
        return await handleSearch(body.query, env);
      }

      // Handle chat requests
      return await handleChat(body.messages, env);
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  },
};

/**
 * Handle chat requests with OpenAI
 */
async function handleChat(messages, env) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

/**
 * Handle web search requests with Tavily API
 */
async function handleSearch(query, env) {
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: env.TAVILY_API_KEY,
      query: query,
      max_results: 5,
      include_snippets: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Tavily API error: ${response.status}`);
  }

  const data = await response.json();

  // Format Tavily results to match our expected structure
  const results = (data.results || []).map((result) => ({
    title: result.title,
    url: result.url,
    snippet: result.snippet || result.description || "",
  }));

  return new Response(JSON.stringify({ results }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
```

---

## ⚙️ Setting Up Environment Variables in Cloudflare

1. **Log in to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com

2. **Navigate to Workers**
   - Click Workers & Pages → Your Worker

3. **Go to Settings → Variables**

4. **Add these Environment Variables:**
   - **Variable Name:** `OPENAI_API_KEY`
     - **Value:** `sk-...` (your OpenAI key)
   
   - **Variable Name:** `TAVILY_API_KEY`
     - **Value:** Your Tavily API key from https://tavily.com

5. **Save and Deploy**

---

## 🆓 Getting Tavily API Key (FREE)

1. **Visit Tavily:** https://tavily.com
2. **Click "Get Started"** → Sign up for free
3. **Copy your API Key** from the dashboard
4. **Share with your teacher** so they can add it to the Worker

**Free Tier Limits:**
- 1,000 API calls per month
- 5 results per search
- Includes snippets and citations

---

## ✅ Testing Your Setup

### Test the Chat (Routine Building)
```bash
curl -X POST https://your-worker-url.workers.dev/ \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "system",
        "content": "You are a L'Oréal skincare advisor."
      },
      {
        "role": "user",
        "content": "Build a routine for dry skin using these products: Cleansing Milk, Hydrating Serum"
      }
    ]
  }'
```

### Test the Web Search
```bash
curl -X POST https://your-worker-url.workers.dev/ \
  -H "Content-Type: application/json" \
  -d '{
    "action": "search",
    "query": "best skincare for dry skin"
  }'
```

---

## 🔒 Security Checklist

- ✅ **API keys are ONLY in Cloudflare Worker** (not in your frontend code)
- ✅ **Frontend never touches API keys directly**
- ✅ **Worker URL is public, but keys are protected**
- ✅ **CORS is enabled** to allow requests from your frontend

---

## 📱 How Users Will Interact

### For Chat (Routine Building):
1. Select products
2. Click "Generate Routine"
3. Chat with the AI advisor

### For Web Search:
1. Click the **🔍 Search** button in the chat area
2. Enter a search query
3. View results in the modal
4. Click results to visit websites

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "API Error: 401" | Check if `OPENAI_API_KEY` is correct in Worker settings |
| "Search Error: 401" | Check if `TAVILY_API_KEY` is correct in Worker settings |
| "Method not allowed" | Make sure you're sending POST requests, not GET |
| No results from search | Check if your Tavily query is valid |
| CORS errors | The Worker includes CORS headers automatically |

---

## 📚 Next Steps

1. ✅ Create Tavily account (free)
2. ✅ Copy Tavily API key
3. ✅ Share key with your teacher
4. ✅ Teacher adds keys to Cloudflare Worker
5. ✅ Test search and chat in your app!

---

**Questions?** Ask your teacher or check the Tavily docs: https://tavily.com/api
