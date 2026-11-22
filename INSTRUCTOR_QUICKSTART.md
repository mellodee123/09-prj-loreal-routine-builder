# 🚀 Quick Start: Enable Web Search in Routine Builder

**TL;DR:** Copy-paste this into your Cloudflare Worker and add one environment variable.

## In 3 Minutes ⏱️

### 1. Get API Key (1 min)
Go to https://www.perplexity.ai/api and get your free API key.

### 2. Update Worker (1 min)
Copy this into your Cloudflare Worker:

```javascript
export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const { messages } = await request.json();

      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "pplx-7b-online",
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

### 3. Add Environment Variable (1 min)
In Cloudflare Worker settings → Environment Variables:
- **Name:** `PERPLEXITY_API_KEY`
- **Value:** (your key from step 1)

### 4. Redeploy ✅
Save and redeploy. Done!

---

## What Happens Now

Students will get:
- ✅ Real-time web search in responses
- ✅ Current L'Oréal product info
- ✅ Pricing from multiple retailers
- ✅ Automatic citations with links
- ✅ Current customer reviews

## Example

**Student asks:** "What's the best L'Oréal moisturizer for dry skin?"

**Response includes:**
```
Based on current availability, the **L'Oréal Paris Revitalift Eye Cream** 
is excellent for dry skin. It's currently available at:

• Sephora: $29.99 [link]
• Amazon: $27.50 [link]
• Ulta: $29.99 [link]

Rated 4.5/5 stars with 1,200+ reviews. Contains hyaluronic acid and peptides.

[Source: Sephora, Amazon, Ulta]
```

## Cost

~$0.01 per request (very affordable for a classroom project)

## Need Help?

See [WEB_SEARCH_IMPLEMENTATION.md](./WEB_SEARCH_IMPLEMENTATION.md) for troubleshooting and advanced options.
