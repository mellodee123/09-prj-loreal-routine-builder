# ✅ PRINTABLE CHECKLIST: Web Search Setup

## 📋 Before You Start

- [ ] I have access to Cloudflare dashboard
- [ ] I found my Worker (Workers & Pages → my-worker-name)
- [ ] I have or can get a Perplexity API key

---

## 🔑 STEP 1: Get Perplexity API Key (5 minutes)

**Location:** https://www.perplexity.ai/api

- [ ] Go to https://www.perplexity.ai/api
- [ ] Click "Sign Up" or "Sign In"
- [ ] Create account (free)
- [ ] Find API key in dashboard
- [ ] Copy the key (it looks like: `pplx_xxx...`)
- [ ] Save it somewhere safe (you'll need it in Step 3)

**Expected key format:** `pplx-xxxxxxxxxxxxxxxxxxxxxxxx`

---

## 🔄 STEP 2: Update Worker Code (5 minutes)

**Location:** Cloudflare Dashboard → Workers & Pages → Your Worker → Editor

### Part A: Open Worker

- [ ] Log in to https://dash.cloudflare.com/
- [ ] Click "Workers & Pages" (left menu)
- [ ] Click on your Worker name
- [ ] Click "Editor" tab

### Part B: Clear Old Code

- [ ] Click in the code editor
- [ ] Press **Ctrl+A** (Windows) or **Cmd+A** (Mac)
- [ ] Press **Delete** to clear everything
- [ ] Code editor is now empty ✓

### Part C: Paste New Code

- [ ] Find file: `EXACT_WORKER_CODE.md` (in project folder)
- [ ] Copy the entire code block (the big JavaScript code)
- [ ] Paste into the empty editor (Ctrl+V or Cmd+V)
- [ ] Check it starts with: `export default {`
- [ ] Check it ends with: `};`

### Part D: Deploy

- [ ] Click **[Deploy]** button (bottom right, blue)
- [ ] Wait for ✅ "Deployment successful" message
- [ ] ✅ Check passes!

---

## 🔐 STEP 3: Add Environment Variable (3 minutes)

**Location:** Cloudflare Dashboard → Workers & Pages → Your Worker → Settings

### Part A: Navigate to Settings

- [ ] Click on your Worker name
- [ ] Click "Settings" tab (at top)
- [ ] Scroll down to find "Environment Variables" section

### Part B: Add Variable

- [ ] Click **[Add variable]** button
- [ ] In "Variable name" field, type: `PERPLEXITY_API_KEY`
- [ ] In "Value" field, paste your API key from Step 1
- [ ] Click **[Save]** button

### Part C: Deploy Settings

- [ ] Look for **[Save and deploy]** button (at bottom)
- [ ] Click it
- [ ] Wait for ✅ "Deployment successful" message
- [ ] ✅ Check passes!

---

## 🧪 STEP 4: Test (3 minutes)

**Location:** Your L'Oréal app

### Part A: Open App

- [ ] Open your app in browser
- [ ] Log in if needed
- [ ] Should see product selection

### Part B: Generate Routine

- [ ] Select at least 2-3 L'Oréal products
- [ ] Click **"Generate Routine"** button
- [ ] Wait for response (should take ~5-10 seconds)

### Part C: Check Results

- [ ] ✅ See "Advisor:" message appear
- [ ] ✅ Message includes current information (prices, availability)
- [ ] ✅ See blue underlined text (links)
- [ ] ✅ No error messages shown

### Part D: Test Links

- [ ] Click on a blue link in the response
- [ ] ✅ It opens in a new tab
- [ ] ✅ It goes to a real website (Sephora, Amazon, etc.)

---

## 🎉 SUCCESS CHECKLIST

If you see ALL of these, you're done! ✅

- [ ] Code was replaced successfully (no errors)
- [ ] Worker deployed with green checkmark
- [ ] Environment variable `PERPLEXITY_API_KEY` is listed
- [ ] Environment variable shows as saved and deployed
- [ ] App opens without errors
- [ ] Can select products
- [ ] "Generate Routine" button works
- [ ] Response appears in advisor section
- [ ] Response includes current pricing info
- [ ] Response includes clickable links
- [ ] Links open in new tabs
- [ ] No "API Error" message shown

---

## ❌ TROUBLESHOOTING

### Problem: "API Error" in response

- [ ] Go to Settings tab
- [ ] Check `PERPLEXITY_API_KEY` is listed
- [ ] Check it has a value (not empty)
- [ ] Click "Save and deploy"
- [ ] Try testing again

### Problem: No response or timeout

- [ ] Check Worker status (green checkmark?)
- [ ] Check you're using correct Worker URL in app
- [ ] Try a simpler question first
- [ ] Wait 1 minute and try again

### Problem: Links don't appear

- [ ] Check response text has [like this]
- [ ] If no brackets, web search isn't working
- [ ] Check API key is correct
- [ ] Check Worker code has: `model: "pplx-7b-online"`

### Problem: "Method not allowed"

- [ ] Check Worker code line 3
- [ ] Should say: `if (request.method !== "POST")`
- [ ] If different, copy code from EXACT_WORKER_CODE.md again

---

## 📞 WHO TO CONTACT

| Issue               | Contact                                |
| ------------------- | -------------------------------------- |
| Cloudflare issues   | Cloudflare Support (chat on dashboard) |
| Perplexity API      | support@perplexity.ai                  |
| App not loading     | Check Worker URL in `script.js`        |
| Links not clickable | Check markdown in response             |

---

## 📊 QUICK REFERENCE

| Step      | What         | Time       | Status    |
| --------- | ------------ | ---------- | --------- |
| 1         | Get API key  | 5 min      | - [ ]     |
| 2         | Update code  | 5 min      | - [ ]     |
| 3         | Add variable | 3 min      | - [ ]     |
| 4         | Test         | 3 min      | - [ ]     |
| **Total** |              | **16 min** | **- [ ]** |

---

## 🚀 FINAL STEPS

Once everything passes:

1. ✅ Tell your students the app is ready
2. ✅ They can now get current product info
3. ✅ They see clickable links to purchase
4. ✅ They see real customer reviews
5. ✅ They see current pricing

---

## 📝 NOTES

**What was done by developer:**

- ✅ Frontend code updated with link parsing
- ✅ Documentation created
- ✅ Instructions written

**What you need to do:**

- 🔑 Get Perplexity API key
- 📝 Copy-paste Worker code
- ⚙️ Add environment variable
- 🧪 Test

**What your students get:**

- 🌐 Real-time web search
- 🔗 Clickable product links
- 💰 Current pricing info
- ⭐ Customer reviews
- 📚 Source citations

---

## 💡 QUICK FACTS

- **Cost per request:** ~$0.01
- **Setup time:** ~15 minutes
- **Code to change:** Just copy-paste (no editing needed)
- **API:** Perplexity (easiest option)
- **Frontend:** Already updated ✅
- **Testing:** Takes ~1 minute per test

---

## ✨ You've Got This!

Print this checklist, follow it step-by-step, and you'll have web search enabled in under 20 minutes.

Questions? Check the other guides:

- `EXACT_WORKER_CODE.md` - The actual code
- `VISUAL_GUIDE.md` - Screen-by-screen walkthrough
- `WORKER_CODE_GUIDE.md` - Detailed explanation

**Let's go! 🚀**
