/*
 * L'Oréal Routine Builder
 * 
 * SETUP: Before the routine generator works, you need:
 * 1. Replace WORKER_URL (line 21) with your class Cloudflare Worker URL
 * 2. Update your Cloudflare Worker to use a web search API (see WORKER_SETUP.md)
 * 
 * Your teacher will provide the Worker URL.
 * Example format: const WORKER_URL = "https://loreal-routine.your-subdomain.workers.dev/";
 * 
 * For web search + citations, see WORKER_SETUP.md for Cloudflare Worker code options.
 */

/* Language translations */
const translations = {
  en: {
    chooseCategory: "Choose a Category",
    cleansers: "Cleansers",
    moisturizers: "Moisturizers & Treatments",
    haircare: "Haircare",
    makeup: "Makeup",
    hairColor: "Hair Color",
    hairStyling: "Hair Styling",
    mensGrooming: "Men's Grooming",
    suncare: "Suncare",
    fragrance: "Fragrance",
    searchPlaceholder: "🔍 Search by product name or keyword...",
    selectCategory: "Select a category to view products",
    noProductsFound: "No products found. Try a different search or category.",
    selectedProducts: "Selected Products",
    noProducts: "No products selected yet",
    addToRoutine: "+ Add to Routine",
    addedToRoutine: "✓ Added to Routine",
    clearAll: "Clear All",
    generateRoutine: "Generate Routine",
    buildingRoutine: "✨ Building your personalized routine...",
    pleaseSelect: "Please select at least one product to generate a routine.",
    routineNotGenerated: "Please generate a routine first by clicking the \"Generate Routine\" button.",
    you: "You",
    advisor: "Advisor",
    thinking: "Thinking...",
    siteTitle: "Smart Routine &amp; Product Advisor",
    privacyPolicy: "Privacy Policy",
    termsOfUse: "Terms of Use",
    contact: "Contact",
    copyright: "&copy; 2025 L'Oréal. All rights reserved.",
    error: "❌ Error generating routine:",
    apiError: "Make sure the Cloudflare Worker URL is configured correctly in script.js",
    errorChat: "❌ Error:",
  },
  ar: {
    chooseCategory: "اختر فئة",
    cleansers: "منظفات",
    moisturizers: "المرطبات والعلاجات",
    haircare: "العناية بالشعر",
    makeup: "المكياج",
    hairColor: "صبغة الشعر",
    hairStyling: "تصفيف الشعر",
    mensGrooming: "العناية بالرجال",
    suncare: "واقي الشمس",
    fragrance: "العطور",
    searchPlaceholder: "🔍 ابحث بالاسم أو الكلمة المفتاحية...",
    selectCategory: "اختر فئة لعرض المنتجات",
    noProductsFound: "لم يتم العثور على منتجات. جرب بحثًا أو فئة مختلفة.",
    selectedProducts: "المنتجات المختارة",
    noProducts: "لم يتم اختيار أي منتجات حتى الآن",
    addToRoutine: "+ إضافة إلى الروتين",
    addedToRoutine: "✓ تمت الإضافة إلى الروتين",
    clearAll: "مسح الكل",
    generateRoutine: "إنشاء الروتين",
    buildingRoutine: "✨ جاري بناء روتينك الشخصي...",
    pleaseSelect: "يرجى اختيار منتج واحد على الأقل لإنشاء روتين.",
    routineNotGenerated: "يرجى إنشاء روتين أولاً بالنقر على زر \"إنشاء الروتين\".",
    you: "أنت",
    advisor: "المستشار",
    thinking: "جاري التفكير...",
    siteTitle: "مستشار الروتين والمنتجات الذكي",
    privacyPolicy: "سياسة الخصوصية",
    termsOfUse: "شروط الاستخدام",
    contact: "اتصل بنا",
    copyright: "&copy; 2025 L'Oréal. جميع الحقوق محفوظة.",
    error: "❌ خطأ في إنشاء الروتين:",
    apiError: "تأكد من تكوين عنوان URL للعامل الذي يعمل على Cloudflare بشكل صحيح في script.js",
    errorChat: "❌ خطأ:",
  },
};

/* Get current language from localStorage or default to English */
let currentLanguage = localStorage.getItem("loreal_language") || "en";

/* Function to get translated text */
function t(key) {
  return translations[currentLanguage]?.[key] || translations.en[key] || key;
}

/* Function to convert markdown to HTML for displaying AI responses with links and citations */
function markdownToHTML(text) {
  // Convert markdown links [text](url) to HTML <a> tags
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: var(--loreal-red); text-decoration: underline;">$1</a>');
  
  // Convert bold **text** to <strong>
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Convert italic *text* to <em> (but not part of bold)
  text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Convert line breaks
  text = text.replace(/\n/g, '<br>');
  
  return text;
}

/* Get references to DOM elements */
const categoryFilter = document.getElementById("categoryFilter");
const productSearch = document.getElementById("productSearch");
const productsContainer = document.getElementById("productsContainer");
const selectedProductsList = document.getElementById("selectedProductsList");
const chatForm = document.getElementById("chatForm");
const chatWindow = document.getElementById("chatWindow");
const productModal = document.getElementById("productModal");
const closeModalBtn = document.getElementById("closeModal");
const addToRoutineBtn = document.getElementById("addToRoutineBtn");
const generateRoutineBtn = document.getElementById("generateRoutine");
const languageToggle = document.getElementById("languageToggle");
const langFlag = document.getElementById("langFlag");
const themeToggle = document.getElementById("themeToggle");

/* Cloudflare Worker URL - Replace with your class worker URL */
const WORKER_URL = "https://lorealchatbox.mellodee321.workers.dev/";

/* Function to set language and apply changes */
function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem("loreal_language", lang);
  
  // Update HTML document direction and language
  document.documentElement.lang = lang;
  document.body.dir = lang === "ar" ? "rtl" : "ltr";
  
  // Update language toggle button
  if (lang === "ar") {
    langFlag.textContent = "🌐 English";
  } else {
    langFlag.textContent = "🌐 العربية";
  }
  
  // Update all UI text
  updateUIText();
  
  // Update category filter options
  updateCategoryOptions();
}

/* Function to update all UI text based on current language */
function updateUIText() {
  // Update category filter placeholder
  categoryFilter.options[0].textContent = t("chooseCategory");
  categoryFilter.options[1].textContent = t("cleansers");
  categoryFilter.options[2].textContent = t("moisturizers");
  categoryFilter.options[3].textContent = t("haircare");
  categoryFilter.options[4].textContent = t("makeup");
  categoryFilter.options[5].textContent = t("hairColor");
  categoryFilter.options[6].textContent = t("hairStyling");
  categoryFilter.options[7].textContent = t("mensGrooming");
  categoryFilter.options[8].textContent = t("suncare");
  categoryFilter.options[9].textContent = t("fragrance");
  
  // Update search placeholder
  productSearch.placeholder = t("searchPlaceholder");
  
  // Update selected products heading
  const selectedProductsHeading = document.querySelector(".selected-products h2");
  if (selectedProductsHeading) {
    selectedProductsHeading.textContent = t("selectedProducts");
  }
  
  // Update generate button
  generateRoutineBtn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> ${t("generateRoutine")}`;
  
  // Update chat heading
  const chatHeading = document.querySelector(".chatbox h2");
  if (chatHeading) {
    chatHeading.textContent = t("buildingRoutine");
  }
  
  // Update chat input placeholder
  const chatInput = document.getElementById("userInput");
  if (chatInput) {
    chatInput.placeholder = t("searchPlaceholder");
  }
  
  // Update footer
  const footer = document.querySelector(".site-footer");
  if (footer) {
    footer.innerHTML = `
      <p>${t("copyright")}</p>
      <nav>
        <a href="#">${t("privacyPolicy")}</a>
        <a href="#">${t("termsOfUse")}</a>
        <a href="#">${t("contact")}</a>
      </nav>
    `;
  }
  
  // Re-render current products if any
  if (currentCategory) {
    updateProductDisplay();
  }
  
  // Re-render selected list if any
  if (selectedIds.size > 0) {
    updateSelectedList();
  }
}

/* Update category options */
function updateCategoryOptions() {
  categoryFilter.options[0].textContent = t("chooseCategory");
  categoryFilter.options[1].textContent = t("cleansers");
  categoryFilter.options[2].textContent = t("moisturizers");
  categoryFilter.options[3].textContent = t("haircare");
  categoryFilter.options[4].textContent = t("makeup");
  categoryFilter.options[5].textContent = t("hairColor");
  categoryFilter.options[6].textContent = t("hairStyling");
  categoryFilter.options[7].textContent = t("mensGrooming");
  categoryFilter.options[8].textContent = t("suncare");
  categoryFilter.options[9].textContent = t("fragrance");
}

/* Language toggle event listener */
languageToggle.addEventListener("click", () => {
  const newLang = currentLanguage === "en" ? "ar" : "en";
  setLanguage(newLang);
});

/* Initialize theme from localStorage */
function initializeTheme() {
  const savedTheme = localStorage.getItem("loreal_theme") || "dark";
  document.body.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);
  updateProductCardColors(savedTheme);
}

/* Update theme icon based on current theme */
function updateThemeIcon(theme) {
  if (themeToggle) {
    if (theme === "white") {
      themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
      themeToggle.setAttribute("title", "Switch to dark mode");
    } else {
      themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
      themeToggle.setAttribute("title", "Switch to light mode");
    }
  }
}

/* Update product card colors based on theme */
function updateProductCardColors(theme) {
  const productCards = document.querySelectorAll(".product-card h3, .product-card p");
  productCards.forEach((element) => {
    if (theme === "white") {
      element.style.color = "#e3a535"; // Gold
    } else {
      element.style.color = ""; // Reset to CSS default
    }
  });
}

/* Theme toggle event listener */
themeToggle.addEventListener("click", () => {
  const currentTheme = document.body.getAttribute("data-theme") || "dark";
  const newTheme = currentTheme === "white" ? "dark" : "white";
  document.body.setAttribute("data-theme", newTheme);
  localStorage.setItem("loreal_theme", newTheme);
  updateThemeIcon(newTheme);
  updateProductCardColors(newTheme);
});

/* Keep track of conversation for follow-up questions */
let conversationMessages = [];

/* localStorage key for saving selections */
const STORAGE_KEY = "loreal_selected_products";

/* Track current filters */
let currentCategory = "";
let currentSearchTerm = "";

/* Show initial placeholder until user selects a category */
productsContainer.innerHTML = `
  <div class="placeholder-message">
    ${t("selectCategory")}
  </div>
`;

/* Load product data from JSON file */
async function loadProducts() {
  const response = await fetch("products.json");
  const data = await response.json();
  allProducts = data.products;
  return allProducts;
}

/* Keep track of selected product IDs and product data */
const selectedIds = new Set();
let allProducts = [];
let currentProductId = null;
let routineGenerated = false;

/* Load saved selections from localStorage when page loads */
function loadSavedSelections() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const savedIds = JSON.parse(saved);
      savedIds.forEach((id) => selectedIds.add(id));
      updateSelectedList();
    } catch (error) {
      console.error("Error loading saved selections:", error);
    }
  }
}

/* Save selections to localStorage whenever they change */
function saveSelections() {
  const idsArray = Array.from(selectedIds);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(idsArray));
}

/* Filter products based on category and search term */
function getFilteredProducts(allProductsData) {
  return allProductsData.filter((product) => {
    /* Match category filter */
    const categoryMatch = !currentCategory || product.category === currentCategory;
    
    /* Match search term in name or description */
    const searchMatch = !currentSearchTerm || 
      product.name.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(currentSearchTerm.toLowerCase());
    
    return categoryMatch && searchMatch;
  });
}

/* Update products display based on current filters */
function updateProductDisplay() {
  const filteredProducts = getFilteredProducts(allProducts);
  
  if (filteredProducts.length === 0) {
    productsContainer.innerHTML = `
      <div class="placeholder-message">
        ${t("noProductsFound")}
      </div>
    `;
  } else {
    displayProducts(filteredProducts);
  }
}

/* Create HTML for displaying product cards */
function displayProducts(products) {
  productsContainer.innerHTML = products
    .map(
      (product) => `
    <div class="product-card ${selectedIds.has(product.id) ? "selected" : ""}" data-id="${product.id}">
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.brand}</p>
      </div>
    </div>
  `
    )
    .join("");
  
  /* Apply theme colors to product cards */
  const currentTheme = document.body.getAttribute("data-theme") || "dark";
  updateProductCardColors(currentTheme);
}

/* Update the Selected Products list display */
function updateSelectedList() {
  if (selectedIds.size === 0) {
    selectedProductsList.innerHTML = `<p class="empty-list">${t("noProducts")}</p>`;
    saveSelections();
    return;
  }

  /* Create HTML for each selected product with a remove button */
  const selectedHTML = Array.from(selectedIds)
    .map((id) => {
      const product = allProducts.find((p) => p.id === id);
      return `
        <div class="selected-item">
          <div class="selected-item-info">
            <h4>${product.name}</h4>
            <p>${product.brand}</p>
          </div>
          <button class="remove-btn" data-id="${id}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `;
    })
    .join("");

  /* Add "Clear All" button */
  const clearAllBtn = `
    <button id="clearAllBtn" class="clear-all-btn">
      <i class="fa-solid fa-xmark"></i> ${t("clearAll")}
    </button>
  `;

  selectedProductsList.innerHTML = selectedHTML + clearAllBtn;

  /* Add click handlers for remove buttons */
  selectedProductsList.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = Number(btn.dataset.id);
      selectedIds.delete(id);
      
      /* Update the card's selected state if visible */
      const card = productsContainer.querySelector(
        `[data-id="${id}"]`
      );
      if (card) {
        card.classList.remove("selected");
      }
      
      updateSelectedList();
      saveSelections();
    });
  });

  /* Add click handler for Clear All button */
  const clearAllBtn_elem = document.getElementById("clearAllBtn");
  if (clearAllBtn_elem) {
    clearAllBtn_elem.addEventListener("click", (e) => {
      e.preventDefault();
      /* Remove selected class from all visible cards */
      productsContainer.querySelectorAll(".product-card.selected").forEach((card) => {
        card.classList.remove("selected");
      });
      /* Clear all selections */
      selectedIds.clear();
      updateSelectedList();
      saveSelections();
    });
  }

  /* Save to localStorage */
  saveSelections();
}

/* Open modal with product details */
function openProductModal(productId) {
  const product = allProducts.find((p) => p.id === productId);
  if (!product) return;

  currentProductId = productId;

  /* Populate modal with product information */
  document.getElementById("modalImage").src = product.image;
  document.getElementById("modalImage").alt = product.name;
  document.getElementById("modalTitle").textContent = product.name;
  document.getElementById("modalBrand").textContent = product.brand;
  document.getElementById("modalDescription").textContent = product.description;

  /* Update the "Add to Routine" button text if already selected */
  if (selectedIds.has(productId)) {
    addToRoutineBtn.textContent = t("addedToRoutine");
    addToRoutineBtn.disabled = true;
  } else {
    addToRoutineBtn.textContent = t("addToRoutine");
    addToRoutineBtn.disabled = false;
  }

  /* Show the modal */
  productModal.classList.add("active");
  productModal.setAttribute("aria-hidden", "false");
}

/* Close the modal */
function closeProductModal() {
  productModal.classList.remove("active");
  productModal.setAttribute("aria-hidden", "true");
  currentProductId = null;
}

/* Close modal when clicking the close button */
closeModalBtn.addEventListener("click", closeProductModal);

/* Close modal when clicking outside the modal content */
productModal.addEventListener("click", (e) => {
  if (e.target === productModal) {
    closeProductModal();
  }
});

/* Close modal with Escape key */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && productModal.classList.contains("active")) {
    closeProductModal();
  }
});

/* Add to routine from modal */
addToRoutineBtn.addEventListener("click", () => {
  if (currentProductId && !selectedIds.has(currentProductId)) {
    selectedIds.add(currentProductId);
    
    /* Update the card if visible */
    const card = productsContainer.querySelector(
      `[data-id="${currentProductId}"]`
    );
    if (card) {
      card.classList.add("selected");
    }
    
    /* Update button state */
    addToRoutineBtn.textContent = t("addedToRoutine");
    addToRoutineBtn.disabled = true;
    
    updateSelectedList();
    saveSelections();
    
    /* Close the modal automatically for better UX */
    setTimeout(() => closeProductModal(), 300);
  }
});

/* Click on product card to open modal */
productsContainer.addEventListener("click", (e) => {
  const card = e.target.closest(".product-card");
  if (!card) return;

  const id = Number(card.dataset.id);
  
  /* Check if click is on the card itself, not a selection toggle */
  /* Allow opening modal on any part of the card */
  openProductModal(id);
});

/* Filter products when category changes */
categoryFilter.addEventListener("change", (e) => {
  currentCategory = e.target.value;
  currentSearchTerm = productSearch.value;
  updateProductDisplay();
});

/* Filter products as user types in search */
productSearch.addEventListener("input", (e) => {
  currentSearchTerm = e.target.value;
  currentCategory = categoryFilter.value;
  updateProductDisplay();
});

/* Initialize: Load all products and restore saved selections on page load */
(async () => {
  /* Initialize theme */
  initializeTheme();
  
  /* Initialize language on page load */
  setLanguage(currentLanguage);
  
  await loadProducts();
  loadSavedSelections();
})();

/* Generate routine when user clicks the Generate Routine button */
generateRoutineBtn.addEventListener("click", async () => {
  /* Check if any products are selected */
  if (selectedIds.size === 0) {
    chatWindow.innerHTML = `
      <p style="color: var(--loreal-red); font-weight: 600;">
        ${t("pleaseSelect")}
      </p>
    `;
    return;
  }

  /* Show loading message */
  chatWindow.innerHTML = `
    <p style="color: #666; font-style: italic;">
      ${t("buildingRoutine")}
    </p>
  `;

  /* Collect selected product data */
  const selectedProducts = Array.from(selectedIds)
    .map((id) => allProducts.find((p) => p.id === id))
    .filter((p) => p);

  /* Create product summary for the AI */
  const productsList = selectedProducts
    .map(
      (p) => `
- **${p.name}** (${p.brand})
  Category: ${p.category}
  Description: ${p.description}
`
    )
    .join("");

  /* Create the system message for the AI */
  const systemMessage = `You are a professional L'Oréal skincare and beauty advisor with access to real-time web information. 
You have deep knowledge of L'Oréal products and skincare routines. 
Create a personalized, easy-to-follow routine using ONLY the products provided by the user.
Structure the routine with morning and evening steps, being specific about how to use each product.
Be friendly, encouraging, and provide helpful tips for best results.

IMPORTANT: Search for current information about these L'Oréal products and skincare tips.
Include relevant citations and links in your response when you reference current information or recommendations.
Format citations like this: [Source: URL or Citation]`;

  /* Create the user message with selected products */
  const userMessage = `Please create a personalized skincare/beauty routine using these L'Oréal products:

${productsList}

Make the routine practical and easy to follow, with clear morning and evening steps.`;

  /* Start a new conversation or continue existing one */
  if (!routineGenerated) {
    conversationMessages = [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage },
    ];
  } else {
    /* For follow-up questions, add to conversation */
    conversationMessages.push({ role: "user", content: userMessage });
  }

  try {
    /* Send request to Cloudflare Worker */
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversationMessages }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const aiReply = data.choices[0].message.content;

    /* Add AI response to conversation history */
    conversationMessages.push({ role: "assistant", content: aiReply });
    routineGenerated = true;

    /* Display the routine in the chat window with markdown conversion for links and formatting */
    chatWindow.innerHTML = `<p>${markdownToHTML(aiReply)}</p>`;
  } catch (error) {
    chatWindow.innerHTML = `
      <p style="color: var(--loreal-red); font-weight: 600;">
        ${t("error")} ${error.message}
      </p>
      <p style="font-size: 14px; color: #666;">
        ${t("apiError")}
      </p>
    `;
  }
});

/* Chat form submission handler - for follow-up questions */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  /* Get the user's message */
  const userInput = document.getElementById("userInput");
  const question = userInput.value.trim();

  if (!question) return;

  /* Check if routine has been generated yet */
  if (!routineGenerated) {
    chatWindow.innerHTML = `
      <p style="color: var(--loreal-red); font-weight: 600;">
        ${t("routineNotGenerated")}
      </p>
    `;
    userInput.value = "";
    return;
  }

  /* Clear input */
  userInput.value = "";

  /* Show loading message */
  chatWindow.innerHTML += `
    <p style="margin-top: 16px; padding: 8px; background: #f0f0f0; border-radius: 4px;">
      <strong>${t("you")}:</strong> ${question}
    </p>
    <p style="margin-top: 12px; color: #666; font-style: italic;">
      ${t("thinking")}
    </p>
  `;

  /* Add user message to conversation */
  conversationMessages.push({ role: "user", content: question });

  try {
    /* Send request to Cloudflare Worker */
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversationMessages }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const aiReply = data.choices[0].message.content;

    /* Add AI response to conversation history */
    conversationMessages.push({ role: "assistant", content: aiReply });

    /* Display the response with markdown conversion for links and formatting */
    chatWindow.innerHTML += `
      <p style="margin-top: 12px; padding: 8px; background: var(--loreal-light); border-radius: 4px;">
        <strong style="color: var(--loreal-red);">${t("advisor")}:</strong><br>
        ${markdownToHTML(aiReply)}
      </p>
    `;

    /* Scroll to bottom */
    chatWindow.scrollTop = chatWindow.scrollHeight;
  } catch (error) {
    chatWindow.innerHTML += `
      <p style="margin-top: 12px; color: var(--loreal-red); font-weight: 600;">
        ${t("errorChat")} ${error.message}
      </p>
    `;
  }
});

/* —— Web Search Modal Functionality —— */

// Get search modal elements
const searchModal = document.getElementById("searchModal");
const searchBtn = document.getElementById("searchBtn");
const closeSearchModal = document.getElementById("closeSearchModal");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const searchSubmitBtn = searchForm.querySelector(".search-submit-btn");

// Open search modal when search button is clicked
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  searchModal.style.display = "flex";
  searchModal.setAttribute("aria-hidden", "false");
  searchInput.focus();
});

// Close search modal when close button is clicked
closeSearchModal.addEventListener("click", () => {
  searchModal.style.display = "none";
  searchModal.setAttribute("aria-hidden", "true");
  searchResults.innerHTML = "";
  searchInput.value = "";
});

// Close modal when clicking outside of it
searchModal.addEventListener("click", (e) => {
  if (e.target === searchModal) {
    searchModal.style.display = "none";
    searchModal.setAttribute("aria-hidden", "true");
    searchResults.innerHTML = "";
    searchInput.value = "";
  }
});

// Handle web search form submission
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();

  if (!query) return;

  // Show loading state
  searchResults.innerHTML = "";
  searchResults.classList.add("loading");
  searchSubmitBtn.disabled = true;

  try {
    // Send search request to Cloudflare Worker
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "search",
        query: query,
      }),
    });

    if (!response.ok) {
      throw new Error(`Search Error: ${response.status}`);
    }

    const data = await response.json();
    const results = data.results || [];

    // Clear loading state
    searchResults.classList.remove("loading");

    if (results.length === 0) {
      searchResults.innerHTML = '<p style="text-align: center; color: var(--loreal-text-secondary);">No results found. Try a different search.</p>';
      return;
    }

    // Display search results
    searchResults.innerHTML = results
      .map(
        (result) => `
      <div class="search-result-item">
        <a href="${result.url}" target="_blank" rel="noopener noreferrer" class="search-result-title">
          ${result.title}
        </a>
        <p class="search-result-snippet">${result.snippet || result.description || ""}</p>
        <p class="search-result-url">${new URL(result.url).hostname}</p>
      </div>
    `
      )
      .join("");
  } catch (error) {
    searchResults.classList.remove("loading");
    searchResults.innerHTML = `<p style="color: var(--loreal-red); font-weight: 600;">Error searching: ${error.message}</p>`;
  } finally {
    searchSubmitBtn.disabled = false;
  }
});


