// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;

// Глобальные переменные
let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || new Set();
let currentFilters = {
    categories: [],
    minPrice: null,
    maxPrice: null,
    inStock: false,
    searchQuery: ''
};

// DOM элементы
const elements = {
    productsGrid: document.getElementById('products-grid'),
    cartCount: document.getElementById('cart-count'),
    cartIcon: document.getElementById('cart-icon'),
    cartModal: document.getElementById('cart-modal'),
    cartItems: document.getElementById('cart-items'),
    cartTotal: document.getElementById('cart-total'),
    searchInput: document.getElementById('search-input'),
    searchBtn: document.getElementById('search-btn'),
    cartClose: document.getElementById('cart-close'),
    checkoutBtn: document.getElementById('checkout-btn'),
    clearCartBtn: document.getElementById('clear-cart'),
    applyFiltersBtn: document.getElementById('apply-filters'),
    resetFiltersBtn: document.getElementById('reset-filters'),
    inStockCheckbox: document.getElementById('in-stock'),
    sortSelect: document.getElementById('sort-by'),
    notification: document.getElementById('notification'),
    notificationText: document.getElementById('notification-text'),
    loading: document.getElementById('loading')
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    initTelegramApp();
    initEventListeners();
    loadProducts();
    updateCartCount();
    renderProductsGrid();
});

// Инициализация Telegram Web App
function initTelegramApp() {
    tg.expand();
    tg.MainButton.hide();

    // Показываем информацию о пользователе
    if (tg.initDataUnsafe.user) {
        const user = tg.initDataUnsafe.user;
        const userAvatar = document.getElementById('user-avatar');
        if (userAvatar) {
            userAvatar.innerHTML = `<i class="fas fa-user"></i>`;
            userAvatar.title = `${user.first_name} ${user.last_name || ''}`;
        }
    }
}

// Инициализация обработчиков событий
function initEventListeners() {
    // Корзина
    elements.cartIcon.addEventListener('click', () => showCartModal());
    elements.cartClose.addEventListener('click', () => hideCartModal());
    elements.checkoutBtn.addEventListener('click', checkout);
    elements.clearCartBtn.addEventListener('click', clearCart);

    // Поиск
    elements.searchBtn.addEventListener('click', handleSearch);
    elements.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Фильтры
    elements.applyFiltersBtn.addEventListener('click', applyFilters);
    elements.resetFiltersBtn.addEventListener('click', resetFilters);

    // Сортировка
    elements.sortSelect.addEventListener('change', () => renderProductsGrid());

    // Модальное окно
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            hideModal(e.target);
        }
    });
}

// Загрузка товаров
async function loadProducts() {
    try {
        // В реальном приложении здесь будет запрос к API
        // Для примера используем тестовые данные
        products = [
            {
                id: 1,
                name: 'Тормозные колодки Brembo',
                price: 4500,
                category: 'brakes',
                image: 'https://images.unsplash.com/photo-1629991838389-15fbc83f12c7?w=300&h=200&fit=crop',
                description: 'Тормозные колодки премиум класса для легковых автомобилей',
                stock: 15,
                rating: 4.8,
                reviews: 124
            },
            {
                id: 2,
                name: 'Воздушный фильтр MANN',
                price: 1200,
                category: 'engine',
                image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=300&h=200&fit=crop',
                description: 'Воздушный фильтр салонный с угольным элементом',
                stock: 8,
                rating: 4.5,
                reviews: 89
            },
            {
                id: 3,
                name: 'Амортизатор KYB',
                price: 8500,
                category: 'suspension',
                image: 'https://images.unsplash.com/photo-1593941707882-a5bba5338fe2?w-300&h=200&fit=crop',
                description: 'Газовый амортизатор для комфортной езды',
                stock: 3,
                rating: 4.9,
                reviews: 67
            },
            {
                id: 4,
                name: 'Аккумулятор VARTA',
                price: 12500,
                category: 'electrical',
                image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop',
                description: 'Свинцово-кислотный аккумулятор 75Ah',
                stock: 0,
                rating: 4.7,
                reviews: 201
            },
            {
                id: 5,
                name: 'Фара передняя левая',
                price: 7800,
                category: 'body',
                image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&h=200&fit=crop',
                description: 'Галогенная фара с линзой',
                stock: 5,
                rating: 4.4,
                reviews: 45
            },
            {
                id: 6,
                name: 'Глушитель Walker',
                price: 6500,
                category: 'exhaust',
                image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=300&h=200&fit=crop',
                description: 'Глушитель задний с насадкой',
                stock: 12,
                rating: 4.6,
                reviews: 112
            },
            {
                id: 7,
                name: 'Масло моторное Mobil 1',
                price: 3500,
                category: 'engine',
                image: 'https://images.unsplash.com/photo-1620916297397-f2d5d5a8e6f3?w=300&h=200&fit=crop',
                description: 'Синтетическое моторное масло 5W-40',
                stock: 25,
                rating: 4.9,
                reviews: 312
            },
            {
                id: 8,
                name: 'Свечи зажигания NGK',
                price: 1800,
                category: 'engine',
                image: 'https://images.unsplash.com/photo-1612817288484-6f91600674a?w=300&h=200&fit=crop',
                description: 'Иридиевые свечи зажигания',
                stock: 18,
                rating: 4.8,
                reviews: 156
            }
        ];

        elements.loading.style.display = 'none';
        renderProductsGrid();

    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
        showNotification('Ошибка загрузки товаров', 'error');
    }
}

// Отображение товаров
function renderProductsGrid() {
    const filteredProducts = filterProducts(products);
    const sortedProducts = sortProducts(filteredProducts);

    elements.productsGrid.innerHTML = sortedProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <i class="fas fa-car-parts"></i>
            </div>
            <div class="product-info">
                <div class="product-header">
                    <h3>${product.name}</h3>
                    <span class="stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">
                        ${product.stock > 0 ? 'В наличии' : 'Нет в наличии'}
                    </span>
                </div>
                <div class="product-category">${getCategoryName(product.category)}</div>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <div class="product-price">${formatPrice(product.price)} руб.</div>
                    <div class="product-actions">
                        <button class="btn-icon btn-favorite ${favorites.has(product.id) ? 'active' : ''}"
                                onclick="toggleFavorite(${product.id})">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="btn-icon btn-cart" onclick="addToCart(${product.id})"
                                ${product.stock === 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                            <i class="fas fa-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Фильтрация товаров
function filterProducts(productsList) {
    return productsList.filter(product => {
        // Поиск по названию
        if (currentFilters.searchQuery &&
            !product.name.toLowerCase().includes(currentFilters.searchQuery.toLowerCase())) {
            return false;
        }

        // Фильтр по категории
        if (currentFilters.categories.length > 0 &&
            !currentFilters.categories.includes(product.category)) {
            return false;
        }

        // Фильтр по цене
        if (currentFilters.minPrice && product.price < currentFilters.minPrice) {
            return false;
        }
        if (currentFilters.maxPrice && product.price > currentFilters.maxPrice) {
            return false;
        }

        // Фильтр по наличию
        if (currentFilters.inStock && product.stock === 0) {
            return false;
        }

        return true;
    });
}

// Сортировка товаров
function sortProducts(productsList) {
    const sortBy = elements.sortSelect.value;

    return [...productsList].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'name':
                return a.name.localeCompare(b.name);
            case 'popular':
                return (b.rating * b.reviews) - (a.rating * a.reviews);
            default:
                return 0;
        }
    });
}

// Работа с корзиной
function addToCart(productId) {
    const product = products.find(p => p.id === productId);

    if (!product) {
        showNotification('Товар не найден', 'error');
        return;
    }

    if (product.stock === 0) {
        showNotification('Товар отсутствует на складе', 'error');
        return;
    }

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        if (existingItem.quantity >= product.stock) {
            showNotification('Достигнут максимальный доступный запас', 'error');
            return;
        }
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    showNotification('Товар добавлен в корзину', 'success');
}

function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity--;
        } else {
            cart.splice(index, 1);
        }

        saveCart();
        updateCartCount();
        renderCartModal();
        showNotification('Товар удален из корзины', 'info');
    }
}

function clearCart() {
    if (cart.length === 0) {
        showNotification('Корзина уже пуста', 'info');
        return;
    }

    if (confirm('Очистить корзину?')) {
        cart = [];
        saveCart();
        updateCartCount();
        renderCartModal();
        showNotification('Корзина очищена', 'success');
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    elements.cartCount.textContent = totalItems;

    // Обновляем кнопку корзины в нижней навигации
    const cartTab = document.getElementById('cart-tab');
    if (cartTab) {
        cartTab.querySelector('span').textContent = `Корзина${totalItems > 0 ? ` (${totalItems})` : ''}`;
    }
}

// Работа с избранным
function toggleFavorite(productId) {
    if (favorites.has(productId)) {
        favorites.delete(productId);
    } else {
        favorites.add(productId);
    }

    localStorage.setItem('favorites', JSON.stringify([...favorites]));
    renderProductsGrid();
}

// Модальное окно корзины
function showCartModal() {
    renderCartModal();
    elements.cartModal.classList.add('show');
}

function hideCartModal() {
    elements.cartModal.classList.remove('show');
}

function renderCartModal() {
    if (cart.length === 0) {
        elements.cartItems.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-light);">
                <i class="fas fa-shopping-cart" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
                <p>Ваша корзина пуста</p>
            </div>
        `;
        elements.cartTotal.textContent = '0 руб.';
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    elements.cartTotal.textContent = `${formatPrice(total)} руб.`;

    elements.cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${formatPrice(item.price)} руб.</div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="removeFromCart(${item.id})">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="addToCart(${item.id})">+</button>
                    <span class="remove-item" onclick="removeItemCompletely(${item.id})">
                        <i class="fas fa-trash"></i>
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

function removeItemCompletely(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCartModal();
    showNotification('Товар полностью удален из корзины', 'info');
}

// Оформление заказа
function checkout() {
    if (cart.length === 0) {
        showNotification('Корзина пуста', 'error');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Используем Telegram Payments
    const invoice = {
        title: 'Заказ автозапчастей',
        description: `${cart.length} товар(ов) на сумму ${formatPrice(total)} руб.`,
        payload: JSON.stringify({
            type: 'order',
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            total: total
        }),
        currency: 'RUB',
        prices: [{
            label: 'Итого к оплате',
            amount: total * 100 // в копейках
        }]
    };

    // Показываем инвойс
    tg.showPopup(invoice, (status) => {
        if (status === 'paid') {
            // Очищаем корзину после успешной оплаты
            cart = [];
            saveCart();
            updateCartCount();
            renderCartModal();
            hideCartModal();

            showNotification('Заказ успешно оплачен! Спасибо за покупку!', 'success');

            // Здесь можно отправить данные заказа на сервер
            // sendOrderToServer(orderData);
        } else if (status === 'failed') {
            showNotification('Оплата не прошла. Попробуйте еще раз.', 'error');
        }
    });
}

// Поиск
function handleSearch() {
    const query = elements.searchInput.value.trim();
    currentFilters.searchQuery = query;
    renderProductsGrid();
}

// Фильтры
function applyFilters() {
    // Получаем выбранные категории
    const categoryCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    currentFilters.categories = Array.from(categoryCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    // Получаем ценовой диапазон
    const minPrice = document.getElementById('min-price').value;
    const maxPrice = document.getElementById('max-price').value;

    currentFilters.minPrice = minPrice ? parseInt(minPrice) : null;
    currentFilters.maxPrice = maxPrice ? parseInt(maxPrice) : null;

    // Фильтр наличия
    currentFilters.inStock = elements.inStockCheckbox.checked;

    renderProductsGrid();
    showNotification('Фильтры применены', 'success');
}

function resetFilters() {
    // Сбрасываем все чекбоксы
    document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });

    // Сбрасываем поля цены
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';
    elements.inStockCheckbox.checked = false;

    // Сбрасываем фильтры
    currentFilters = {
        categories: [],
        minPrice: null,
        maxPrice: null,
        inStock: false,
        searchQuery: ''
    };

    renderProductsGrid();
    showNotification('Фильтры сброшены', 'info');
}

// Вспомогательные функции
function showNotification(message, type = 'info') {
    elements.notificationText.textContent = message;

    // Устанавливаем цвет в зависимости от типа
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };

    elements.notification.style.background = colors[type] || colors.info;
    elements.notification.classList.add('show');

    // Автоматически скрываем через 3 секунды
    setTimeout(() => {
        elements.notification.classList.remove('show');
    }, 3000);
}

function hideModal(modal) {
    modal.classList.remove('show');
}

function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price);
}

function getCategoryName(category) {
    const categories = {
        'engine': 'Двигатель',
        'brakes': 'Тормозная система',
        'suspension': 'Подвеска',
        'electrical': 'Электрика',
        'body': 'Кузовные детали',
        'exhaust': 'Выхлопная система'
    };
    return categories[category] || category;
}

// Экспортируем функции для использования в HTML
window.addToCart = addToCart;
window.toggleFavorite = toggleFavorite;
window.removeFromCart = removeFromCart;
window.removeItemCompletely = removeItemCompletely;
window.showCartModal = showCartModal;
window.hideCartModal = hideCartModal;