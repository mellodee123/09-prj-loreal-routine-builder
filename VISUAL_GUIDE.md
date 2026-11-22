# 📸 Visual Step-by-Step: Updating Your Worker

## Screen 1: Cloudflare Dashboard

### What you see:
```
┌─────────────────────────────────────────┐
│ Cloudflare Dashboard                    │
├─────────────────────────────────────────┤
│ Left Menu:                              │
│  📦 Workers & Pages  ← CLICK HERE      │
│  🔐 Domains                             │
│  ⚙️ Account Settings                    │
│                                         │
│ Main Area shows your Workers            │
└─────────────────────────────────────────┘
```

### What to do:
Click on **"Workers & Pages"** in the left sidebar

---

## Screen 2: Workers List

### What you see:
```
┌─────────────────────────────────────────┐
│ Workers & Pages                         │
├─────────────────────────────────────────┤
│ Your Workers:                           │
│  • loreal-routine  ← Click on this     │
│  • some-other-worker                    │
│  • another-worker                       │
│                                         │
│ [+ Create] button (top right)           │
└─────────────────────────────────────────┘
```

### What to do:
Click on your Worker name (probably "loreal-routine" or similar)

---

## Screen 3: Worker Details Page

### What you see:
```
┌─────────────────────────────────────────────────────┐
│ Your Worker Name                                    │
├─────────────────────────────────────────────────────┤
│ Tabs at top:                                        │
│  [Editor] ← CLICK THIS    [Settings]  [Logs]       │
│                                                     │
│ Main area shows your code                          │
└─────────────────────────────────────────────────────┘
```

### What to do:
Make sure **"Editor"** tab is selected

---

## Screen 4: Code Editor

### What you see:
```
┌────────────────────────────────────────────┐
│ export default {                           │
│   async fetch(request, env) {              │
│     // Your current code is here           │
│     const response = await fetch(          │
│       "https://api.openai.com/..."         │
│     );                                     │
│     // ... more code ...                   │
│   }                                        │
│ };                                         │
│                                            │
│ [Deploy] button (bottom right)             │
└────────────────────────────────────────────┘
```

### What to do:
1. **Click in the code area**
2. **Press Ctrl+A** (or Cmd+A on Mac) to select ALL code
3. **Press Delete** to clear everything
4. Code area should now be empty

---

## Screen 5: Empty Code Editor

### What you see:
```
┌────────────────────────────────────────────┐
│ [Empty editor - cursor blinking]           │
│                                            │
│                                            │
│                                            │
│                                            │
│                                            │
│ [Deploy] button (bottom right)             │
└────────────────────────────────────────────┘
```

### What to do:
Now paste the NEW code (from EXACT_WORKER_CODE.md)

**How to paste:**
- Right-click → Paste, OR
- Ctrl+V (Cmd+V on Mac), OR
- Middle mouse button

---

## Screen 6: Code Pasted

### What you see:
```
┌────────────────────────────────────────────┐
│ export default {                           │
│   async fetch(request, env) {              │
│     if (request.method !== "POST") {       │
│       return new Response("Method...");    │
│     }                                      │
│     try {                                  │
│       const { messages } = ...             │
│       const response = await fetch(        │
│    "https://api.perplexity.ai/chat..." ← NEW│
│         headers: {                         │
│           "Authorization": `Bearer...`  ← NEW│
│           "Content-Type": ...              │
│         }                                  │
│         body: JSON.stringify({             │
│           model: "pplx-7b-online"... ← NEW│
│           messages: messages,              │
│         }),                                │
│       });                                  │
│       // ... rest of code ...              │
│     }                                      │
│   }                                        │
│ };                                         │
│                                            │
│ [Deploy] button (bottom right)             │
└────────────────────────────────────────────┘
```

### What to do:
Click the **[Deploy]** button (bottom right, blue button)

---

## Screen 7: Deployment Success

### What you see:
```
┌────────────────────────────────────────────┐
│ ✅ Deployment successful                   │
│    Your Worker is live!                    │
│                                            │
│ Tabs at top:                               │
│  [Editor] [Settings] ← CLICK THIS [Logs]  │
└────────────────────────────────────────────┘
```

### What to do:
Now click on the **"Settings"** tab (at top)

---

## Screen 8: Settings Tab

### What you see:
```
┌────────────────────────────────────────────┐
│ Settings                                   │
├────────────────────────────────────────────┤
│ Scroll down to find:                       │
│                                            │
│ 🔧 Environment Variables                  │
│                                            │
│ [Add variable] button ← CLICK THIS        │
│                                            │
│ (If you already have variables listed)    │
└────────────────────────────────────────────┘
```

### What to do:
Click **[Add variable]** button

---

## Screen 9: Add Variable Form

### What you see:
```
┌────────────────────────────────────────────┐
│ Add an environment variable                │
├────────────────────────────────────────────┤
│                                            │
│ Variable name:                             │
│ [________________________]                 │
│                                            │
│ Value:                                     │
│ [________________________]                 │
│                                            │
│ [Save]  [Cancel] buttons                   │
│                                            │
└────────────────────────────────────────────┘
```

### What to do:
1. Click in **Variable name** field
2. Type: `PERPLEXITY_API_KEY`
3. Click in **Value** field
4. Paste your Perplexity API key

---

## Screen 10: Variable Added

### What you see:
```
┌────────────────────────────────────────────┐
│ Variable name:                             │
│ [PERPLEXITY_API_KEY]                       │
│                                            │
│ Value:                                     │
│ [sk-pplx-xxxxxxxxxxxxxxxxxxxxxxxx] (hidden)│
│                                            │
│ [Save]  [Cancel] buttons                   │
│                                            │
└────────────────────────────────────────────┘
```

### What to do:
Click **[Save]** button

---

## Screen 11: Back to Settings

### What you see:
```
┌────────────────────────────────────────────┐
│ Settings                                   │
├────────────────────────────────────────────┤
│ 🔧 Environment Variables                  │
│                                            │
│ ✅ PERPLEXITY_API_KEY = ••••••••••• (hidden)
│                                            │
│ [+ Add variable] button                    │
│                                            │
│                                            │
│ [Save and deploy] button (bottom) ← CLICK │
│                                            │
└────────────────────────────────────────────┘
```

### What to do:
Click **[Save and deploy]** button at the bottom

---

## Screen 12: Deployment Complete ✅

### What you see:
```
┌────────────────────────────────────────────┐
│ ✅ Deployment successful                   │
│    Environment variables updated!         │
│    Your Worker is live!                    │
│                                            │
│ Tabs at top:                               │
│  [Editor] [Settings] [Logs]               │
│                                            │
│ Green checkmark = Everything is working   │
└────────────────────────────────────────────┘
```

### What to do:
✅ **YOU'RE DONE WITH THE WORKER!**

---

## 🧪 Now Test It!

### Open Your App

1. Go to your app URL (probably something like `yourname.com/loreal`)
2. Select some L'Oréal products
3. Click **"Generate Routine"**

### Check For These Signs ✅

```
✅ GOOD SIGNS (it worked!):
  • Routine generates quickly
  • Response includes current info
  • Links are blue and clickable
  • Says things like "Currently $29.99 at [Sephora]"
  • Shows customer reviews
  • Includes citations at bottom

❌ BAD SIGNS (needs fixing):
  • "API Error" message
  • Worker URL not configured
  • No response after clicking button
  • Links not clickable
```

---

## 🆘 If Something Goes Wrong

### Error: "API Error"

**Likely Cause:** Environment variable not set correctly

**Fix:**
1. Go back to Settings tab
2. Check that `PERPLEXITY_API_KEY` is listed
3. Make sure it has a value (not empty)
4. Click "Save and deploy" again

### Error: "Method not allowed"

**Likely Cause:** Different issue - your worker code might be wrong

**Fix:**
1. Go to Editor tab
2. Check line 3 says: `if (request.method !== "POST") {`
3. If different, replace entire code again from EXACT_WORKER_CODE.md

### No response at all

**Likely Cause:** Wrong API endpoint or key

**Fix:**
1. Check URL says `api.perplexity.ai` (not `api.openai.com`)
2. Check environment variable has real key (get from https://www.perplexity.ai/api)
3. Check Worker was deployed after changes

---

## 📋 Final Checklist

After completing all steps above:

- [ ] Code was deleted and replaced
- [ ] New code was deployed (green checkmark)
- [ ] Settings tab was opened
- [ ] Environment variable added: `PERPLEXITY_API_KEY`
- [ ] Environment variable has actual API key value
- [ ] "Save and deploy" was clicked
- [ ] Green checkmark shows successful deployment
- [ ] App was tested
- [ ] Response includes current info and links

---

## 🎉 Success!

If all steps completed:
✅ Your Worker now searches the web
✅ Your frontend displays clickable links
✅ Your chatbot has real-time information
✅ Students get current, helpful answers

**Congratulations! 🚀**
