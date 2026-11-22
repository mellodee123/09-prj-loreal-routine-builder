# Project 9: L'Oréal Routine Builder
L’Oréal is expanding what’s possible with AI, and now your chatbot is getting smarter. This week, you’ll upgrade it into a product-aware routine builder. 

Users will be able to browse real L’Oréal brand products, select the ones they want, and generate a personalized routine using AI. They can also ask follow-up questions about their routine—just like chatting with a real advisor.

## Features

### ✨ RTL Language Support (Right-to-Left)
The routine builder now supports right-to-left (RTL) languages like Arabic, Hebrew, and Persian!

**How to Use:**
1. Click the **🌐 Language Toggle** button in the top-right corner of the header
2. Toggle between English and العربية (Arabic)
3. The entire interface will flip to RTL mode, including:
   - Text direction
   - Product grid layout
   - Selected products list
   - Chat interface
   - Modal windows
   - All buttons and icons

**What Gets Translated:**
- ✅ Category filter options
- ✅ Search placeholder
- ✅ All buttons and labels
- ✅ Error messages
- ✅ Chat messages
- ✅ Selected products display

**Language Preference:**
- Your language choice is saved in `localStorage`
- The app remembers your preference even after page reload

**Supported Languages:**
- 🇺🇸 English (LTR - Left-to-Right)
- 🇸🇦 العربية - Arabic (RTL - Right-to-Left)