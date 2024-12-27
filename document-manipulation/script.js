// Initialize ProductManager
const productManager = new ProductManager();

// DOM Elements
const productContainer = document.getElementById('productContainer');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');
const categoryFilters = document.getElementById('categoryFilters');
const modal = document.getElementById('productModal');
const modalContent = document.getElementById('modalContent');
const closeButton = document.querySelector('.close-button');

// Initialize the application
function initializeApp() {
    // Load saved state or initialize with sample products
    productManager.loadState();
    if (productManager.products.length === 0) {
        productManager.initializeProducts();
    }

    // Setup observers
    productManager.addObserver(renderProducts);

    // Setup event listeners
    setupEventListeners();

    // Initialize UI
    initializeUI();
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    searchInput.addEventListener('input', debounce((e) => {
        productManager.updateFilters({ search: e.target.value });
    }, 300));

    // Sort select
    sortSelect.addEventListener('change', (e) => {
        productManager.updateSort(e.target.value);
    });

    // Price range
    priceRange.addEventListener('input', (e) => {
        const value = e.target.value;
        priceValue.textContent = `$${value}`;
        productManager.updateFilters({ maxPrice: Number(value) });
    });

    // Modal close button
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Save state before unload
    window.addEventListener('beforeunload', () => {
        productManager.saveState();
    });
}

// Initialize UI elements
function initializeUI() {
    // Initialize category filters
    const categories = productManager.getCategories();
    categoryFilters.innerHTML = categories.map(category => `
        <label class="category-checkbox">
            <input type="checkbox" value="${category}">
            ${category}
        </label>
    `).join('');

    // Setup category filter listeners
    categoryFilters.addEventListener('change', (e) => {
        const checkbox = e.target;
        const categories = productManager.filters.categories;
        
        if (checkbox.checked) {
            categories.add(checkbox.value);
        } else {
            categories.delete(checkbox.value);
        }
        
        productManager.updateFilters({ categories });
    });
}

// Render products
function renderProducts(products) {
    productContainer.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <h2>${product.name}</h2>
            <p class="price">$${product.price.toFixed(2)}</p>
            <p class="category">${product.category}</p>
            <p class="description">${product.description}</p>
        </div>
    `).join('');

    // Add click listeners to product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
            const product = products.find(p => p.id === card.dataset.id);
            showProductModal(product);
        });
    });
}

// Show product modal
function showProductModal(product) {
    modalContent.innerHTML = `
        <h2>${product.name}</h2>
        <p class="price">$${product.price.toFixed(2)}</p>
        <p class="category">Category: ${product.category}</p>
        <p class="description">${product.description}</p>
    `;
    modal.style.display = 'block';
}

// Debounce helper function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize the application when the page loads
window.addEventListener('load', initializeApp);
