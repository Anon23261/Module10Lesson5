class ProductManager {
    constructor() {
        this.products = [];
        this.observers = new Set();
        this.filters = {
            search: '',
            maxPrice: 2000,
            categories: new Set()
        };
        this.sortBy = 'name';
    }

    // Add a new product
    addProduct(product) {
        this.products.push({
            ...product,
            id: this.generateId()
        });
        this.notifyObservers();
    }

    // Initialize with sample products
    initializeProducts() {
        const sampleProducts = [
            { name: "Professional Laptop", price: 1299.99, category: "Electronics", description: "High-performance laptop for professionals", image: "laptop.jpg" },
            { name: "Wireless Headphones", price: 199.99, category: "Audio", description: "Premium wireless headphones with noise cancellation", image: "headphones.jpg" },
            { name: "4K Monitor", price: 499.99, category: "Electronics", description: "Ultra-wide 4K monitor for productivity", image: "monitor.jpg" },
            { name: "Mechanical Keyboard", price: 149.99, category: "Accessories", description: "Mechanical gaming keyboard with RGB lighting", image: "keyboard.jpg" },
            { name: "Wireless Mouse", price: 79.99, category: "Accessories", description: "Ergonomic wireless mouse with precision tracking", image: "mouse.jpg" },
            { name: "Tablet", price: 699.99, category: "Electronics", description: "Professional tablet for digital artists", image: "tablet.jpg" }
        ];

        sampleProducts.forEach(product => this.addProduct(product));
    }

    // Generate unique ID
    generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    // Add observer
    addObserver(observer) {
        this.observers.add(observer);
    }

    // Remove observer
    removeObserver(observer) {
        this.observers.delete(observer);
    }

    // Notify all observers
    notifyObservers() {
        const filteredProducts = this.getFilteredProducts();
        this.observers.forEach(observer => observer(filteredProducts));
    }

    // Update filters
    updateFilters(newFilters) {
        this.filters = { ...this.filters, ...newFilters };
        this.notifyObservers();
    }

    // Update sort method
    updateSort(sortBy) {
        this.sortBy = sortBy;
        this.notifyObservers();
    }

    // Get all unique categories
    getCategories() {
        return [...new Set(this.products.map(product => product.category))];
    }

    // Get filtered and sorted products
    getFilteredProducts() {
        return this.products
            .filter(product => {
                const matchesSearch = product.name.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                                   product.description.toLowerCase().includes(this.filters.search.toLowerCase());
                const matchesPrice = product.price <= this.filters.maxPrice;
                const matchesCategory = this.filters.categories.size === 0 || 
                                     this.filters.categories.has(product.category);
                
                return matchesSearch && matchesPrice && matchesCategory;
            })
            .sort((a, b) => {
                switch(this.sortBy) {
                    case 'price':
                        return a.price - b.price;
                    case 'category':
                        return a.category.localeCompare(b.category);
                    default:
                        return a.name.localeCompare(b.name);
                }
            });
    }

    // Save state to localStorage
    saveState() {
        localStorage.setItem('productState', JSON.stringify({
            products: this.products,
            filters: this.filters,
            sortBy: this.sortBy
        }));
    }

    // Load state from localStorage
    loadState() {
        const savedState = localStorage.getItem('productState');
        if (savedState) {
            const state = JSON.parse(savedState);
            this.products = state.products;
            this.filters = state.filters;
            this.sortBy = state.sortBy;
            this.notifyObservers();
        }
    }
}
