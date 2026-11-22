# Cloudflare Worker Setup with Web Search

This guide shows how to set up a Cloudflare Worker for the L'Oréal Routine Builder with real-time web search capabilities.

## Option 1: Using Perplexity API (Recommended for Web Search)

Perplexity API includes built-in web search and can cite sources.

### Step 1: Get API Keys
1. Sign up for [Perplexity API](https://www.perplexity.ai/api)
2. Get your Perplexity API key
3. Keep it safe — you'll add it to the Worker

### Step 2: Create/Update Your Cloudflare Worker

Replace your Worker code with this:

```javascript
export default {
  async fetch(request, env) {
    // Only allow POST requests
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const { messages } = await request.json();

      // Call Perplexity API (includes web search)
      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "pplx-7b-online", // or "pplx-70b-online" for more advanced
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

      // Return in OpenAI-compatible format
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

### Step 3: Add Environment Variable to Worker

1. Go to your Cloudflare Worker settings
2. Add a new environment variable:
   - **Name:** `PERPLEXITY_API_KEY`
   - **Value:** Your Perplexity API key

---

## Option 2: Using OpenAI API (Without Web Search)

If you want to stick with OpenAI but add web search, use this Worker:

```javascript
export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const { messages } = await request.json();

      // Call OpenAI API
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
          max_tokens: 1500,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        return new Response(`API Error: ${error}`, { status: response.status });
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

**Note:** OpenAI's standard API doesn't include web search. To add web search with OpenAI, you'd need to implement a custom web search integration (more advanced).

---

## Option 3: Using Google Search API + OpenAI (Advanced)

For real web search with OpenAI, combine Google Search API with OpenAI:

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

      // Search the web for current information
      if (lastUserMessage.toLowerCase().includes("loreal") || 
          lastUserMessage.toLowerCase().includes("skincare") ||
          lastUserMessage.toLowerCase().includes("routine")) {
        try {
          const searchResponse = await fetch(
            `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(lastUserMessage)}&key=${env.GOOGLE_API_KEY}&cx=${env.GOOGLE_SEARCH_ENGINE_ID}`
          );
          const searchData = await searchResponse.json();
          
          if (searchData.items) {
            searchResults = "\n\nCurrent web search results:\n" + 
              searchData.items.slice(0, 3).map((item, i) => 
                `${i + 1}. [${item.title}](${item.link})\n   ${item.snippet}`
              ).join("\n");
          }
        } catch (e) {
          console.error("Search error:", e);
        }
      }

      // Add search results to the system message
      const enhancedMessages = [
        ...messages.slice(0, -1),
        {
          role: "user",
          content: messages[messages.length - 1].content + (searchResults || ""),
        },
      ];

      // Call OpenAI with search context
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
- `OPENAI_API_KEY` - Your OpenAI API key
- `GOOGLE_API_KEY` - Your Google Custom Search API key
- `GOOGLE_SEARCH_ENGINE_ID` - Your Custom Search Engine ID

---

## Recommended: Option 1 (Perplexity API)

**Why?** Perplexity API is:
- ✅ Easiest to implement
- ✅ Includes web search built-in
- ✅ Automatically cites sources
- ✅ Perfect for beginners
- ✅ No extra setup needed

## Setup Checklist

- [ ] Choose an API option above
- [ ] Get API keys from the provider
- [ ] Update your Cloudflare Worker with the code
- [ ] Add environment variables to your Worker
- [ ] Test by selecting products and clicking "Generate Routine"
- [ ] Verify the response includes current information and citations

## Testing

1. Update the Worker with one of the options above
2. In your browser, go to the app
3. Select some L'Oréal products
4. Click "Generate Routine"
5. The AI should return information with current web search results and citations

## Troubleshooting

**"API Error" appears:**
- Check that your API key is set in the Worker environment variables
- Verify the API key is correct and has access to the API
- Check the Worker logs for detailed errors

**"Worker URL not configured":**
- Make sure your Worker URL is correctly set in `script.js` line 21

**No citations in response:**
- If using OpenAI only, it won't search the web automatically
- Switch to Perplexity API (Option 1) for automatic web search
