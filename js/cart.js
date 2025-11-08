let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
const cartItemsContainer = document.getElementById('cartItemsContainer');
const emptyCart = document.getElementById('emptyCart');

function renderCartItems() {
    if (cartItems.length === 0) {
        cartItemsContainer.style.display = 'none';
        document.querySelector('.cart-summary').style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }

    cartItemsContainer.style.display = 'block';
    document.querySelector('.cart-summary').style.display = 'block';
    emptyCart.style.display = 'none';

    const groupedItems = {};
    cartItems.forEach(item => {
        if (groupedItems[item.id]) {
            groupedItems[item.id].quantity++;
        } else {
            groupedItems[item.id] = { ...item, quantity: 1 };
        }
    });

    cartItemsContainer.innerHTML = '';
    
    Object.values(groupedItems).map(item => {
        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p class="cart-item-category">${item.category}</p>
                    <p class="cart-item-price">${item.price} AZN</p>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button onclick="decreaseQuantity(${item.id})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="increaseQuantity(${item.id})">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">🗑️ Sil</button>
                </div>
            </div>
        `;
    });

    updateCartSummary();
}

function updateCartSummary() {
    const totalItems = cartItems.length;
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalPrice').textContent = totalPrice + ' AZN';
}

function increaseQuantity(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cartItems.push(product);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        renderCartItems();
    }
}

function decreaseQuantity(productId) {
    const index = cartItems.findIndex(item => item.id === productId);
    if (index !== -1) {
        cartItems.splice(index, 1);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        renderCartItems();
    }
}

function removeFromCart(productId) {
    cartItems = cartItems.filter(item => item.id !== productId);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCartItems();
    showNotification('Product removed from cart');

}

function clearCart() {
    if (confirm('Are you sure you want to clear the cart?')) {
        cartItems = [];
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        renderCartItems();
        showNotification('Cart has been cleared');

    }
}

function checkout() {
    if (cartItems.length === 0) {
       alert('Your cart is empty!');

        return;
    }
    
    alert('Order completed successfully! Total amount: ' + cartItems.reduce((sum, item) => sum + item.price, 0) + ' AZN');
    cartItems = [];
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCartItems();
}

function goToHome() {
    window.location.href = 'index.html';
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

renderCartItems();