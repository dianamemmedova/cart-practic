var categories = ['All', 'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books'];
let productsGrid = document.getElementById('productsGrid');
let categoriesDiv = document.getElementById('categories');
var selectedCategory = 'All';
var cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
var searchTerm = '';


function renderCategories() {
    categoriesDiv.innerHTML = '';
    
    categories.map(cat => {
        const activeClass = cat === selectedCategory ? 'active' : '';
        categoriesDiv.innerHTML += `<button class="category-btn ${activeClass}" onclick="selectCategory('${cat}')">${cat}</button>`;
    });
}

function selectCategory(category) {
    selectedCategory = category;
    renderCategories();
    renderProducts();
}

function renderProducts() {
    productsGrid.innerHTML = '';
    
    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<div class="no-products">Product not found</div>';
        return;
    }

    filteredProducts.map(item => {
        productsGrid.innerHTML += `
            <div class="product-card">
                <img src="${item.image}" alt="${item.name}" class="product-image">
                <div class="product-info">
                    <div class="product-category">${item.category}</div>
                    <div class="product-name">${item.name}</div>
                    <div class="product-description">${item.description}</div>
                    <div class="product-price">${item.price} AZN</div>
                    <button class="add-to-cart-btn" onclick="addToCart(${item.id})">Səbətə əlavə et</button>
                </div>
            </div>
        `;
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cartItems.push(product);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCart();
        showNotification('Product added to cart!');

    }
}

function updateCart() {
    var cartCount = document.getElementById('cartCount');
    var cartTotal = document.getElementById('cartTotal');
    
    cartCount.textContent = `🛒 ${cartItems.length}`;
    
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = total + ' AZN';
}

function goToCart() {
    window.location.href = 'cart.html';
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}
document.getElementById('searchInput').addEventListener('input', function(e) {
    searchTerm = e.target.value;
    renderProducts();
});

renderCategories();
renderProducts();
updateCart();