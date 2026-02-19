// ==============================================
// AutoParts TMA - Полноценный рабочий код
// ==============================================

// ==============================================
// 1. ИНИЦИАЛИЗАЦИЯ
// ==============================================
const tg = window.Telegram.WebApp;

// Глобальные переменные
let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let orders = JSON.parse(localStorage.getItem('orders')) || [];
let currentUser = null;
let currentPage = 'catalog';
let searchTimeout = null;
let filters = {
    category: 'all',
    minPrice: null,
    maxPrice: null,
    inStock: false,
    brands: []
};

// ==============================================
// 2. ЗАГРУЗКА ДАННЫХ
// ==============================================
const productsData = [
    {
        id: 1,
        name: 'Тормозные колодки Brembo',
        price: 4500,
        oldPrice: 5000,
        category: 'brakes',
        brand: 'Brembo',
        image: 'https://www.bremboparts.com/images/packaging/Pad_Prime.webp',
        images: [
            'https://www.bremboparts.com/images/packaging/Pad_Prime.webp',
        ],
        description: 'Высококачественные тормозные колодки премиум класса. Обеспечивают отличное торможение и долгий срок службы.',
        specifications: {
            'Производитель': 'Brembo',
            'Страна': 'Италия',
            'Тип': 'Передние',
            'Материал': 'Керамика',
            'Гарантия': '2 года'
        },
        rating: 4.8,
        reviews: 124,
        stock: 15,
        isNew: true,
        isHit: true
    },
    {
        id: 2,
        name: 'Воздушный фильтр MANN',
        price: 1200,
        oldPrice: 1500,
        category: 'engine',
        brand: 'MANN',
        image: 'https://tavil.ru/netcat_files/437/1609/h_2e503fe17804d699d036da478cac2f32',
        images: [
            'https://tavil.ru/netcat_files/437/1609/h_2e503fe17804d699d036da478cac2f32',
        ],
        description: 'Воздушный фильтр салонный с угольным элементом. Защищает от пыли и вредных примесей.',
        specifications: {
            'Производитель': 'MANN',
            'Страна': 'Германия',
            'Тип': 'Салонный',
            'Материал': 'Уголь',
            'Гарантия': '1 год'
        },
        rating: 4.5,
        reviews: 89,
        stock: 8,
        isNew: true
    },
    {
        id: 3,
        name: 'Амортизатор KYB',
        price: 8500,
        category: 'suspension',
        brand: 'KYB',
        image: 'https://kyb.ru/gi/573c95baf94a7c983f131574.jpg',
        images: [
            'https://kyb.ru/gi/573c95baf94a7c983f131574.jpg'
        ],
        description: 'Газовый амортизатор для комфортной езды. Обеспечивает отличную управляемость.',
        specifications: {
            'Производитель': 'KYB',
            'Страна': 'Япония',
            'Тип': 'Газовый',
            'Позиция': 'Передний',
            'Гарантия': '3 года'
        },
        rating: 4.9,
        reviews: 67,
        stock: 3,
        isHit: true
    },
    {
        id: 4,
        name: 'Аккумулятор VARTA',
        price: 12500,
        oldPrice: 14000,
        category: 'electrical',
        brand: 'VARTA',
        image: 'https://api.1ak.ru/storage/app/uploads/public/625/3c7/42d/thumb_12031_654_654_0_0_crop.jpg',
        images: [
            'https://api.1ak.ru/storage/app/uploads/public/625/3c7/42d/thumb_12031_654_654_0_0_crop.jpg'
        ],
        description: 'Свинцово-кислотный аккумулятор 75Ah. Высокий пусковой ток, надежный запуск в любую погоду.',
        specifications: {
            'Производитель': 'VARTA',
            'Страна': 'Германия',
            'Емкость': '75 А·ч',
            'Пусковой ток': '750 А',
            'Гарантия': '3 года'
        },
        rating: 4.7,
        reviews: 201,
        stock: 0,
        isNew: true
    },
    {
        id: 5,
        name: 'Масло моторное Mobil 1',
        price: 3500,
        oldPrice: 4000,
        category: 'oil',
        brand: 'Mobil',
        image: 'https://maslenka18.ru/system/product_photo/742489/154285_original.jpg?1537859793',
        images: [
            'https://maslenka18.ru/system/product_photo/742489/154285_original.jpg?1537859793'
        ],
        description: 'Синтетическое моторное масло 5W-40. Защита двигателя при любых температурах.',
        specifications: {
            'Производитель': 'Mobil',
            'Страна': 'США',
            'Вязкость': '5W-40',
            'Объем': '5 л',
            'Тип': 'Синтетика'
        },
        rating: 4.9,
        reviews: 312,
        stock: 25,
        isHit: true
    },
    {
        id: 6,
        name: 'Свечи зажигания NGK',
        price: 1800,
        category: 'engine',
        brand: 'NGK',
        image: 'https://ae01.alicdn.com/kf/S5ab384465e9f4e6aaa44d700b6b81ee5G.jpg',
        images: [
            'https://ae01.alicdn.com/kf/S5ab384465e9f4e6aaa44d700b6b81ee5G.jpg',
        ],
        description: 'Иридиевые свечи зажигания. Долгий срок службы, стабильная искра.',
        specifications: {
            'Производитель': 'NGK',
            'Страна': 'Япония',
            'Тип': 'Иридиевые',
            'Зазор': '1.1 мм',
            'Ресурс': '60000 км'
        },
        rating: 4.8,
        reviews: 156,
        stock: 18,
        isNew: true
    },
    {
        id: 7,
        name: 'Фара передняя левая CAMRY(2007)',
        price: 7800,
        category: 'body',
        brand: 'TOYOTA',
        image: 'https://optikadepo.ru/upload/shop_2/1/4/4/item_14491993/shop_items_catalog_image14491993.jpg',
        images: [
            'https://optikadepo.ru/upload/shop_2/1/4/4/item_14491993/shop_items_catalog_image14491993.jpg'
        ],
        description: 'Галогенная фара с линзой. Отличное освещение дороги в любых условиях.',
        specifications: {
            'Производитель': 'TOYOTA',
            'Страна': 'Япония',
            'Тип': 'Галоген',
            'Позиция': 'Левая',
            'Цоколь': 'H7'
        },
        rating: 4.4,
        reviews: 45,
        stock: 5
    },
    {
        id: 8,
        name: 'Глушитель Walker',
        price: 6500,
        category: 'exhaust',
        brand: 'Walker',
        image: 'https://static.adata.by/images/13/00131033203255.jpg',
        images: [
            'https://static.adata.by/images/13/00131033203255.jpg'
        ],
        description: 'Глушитель задний с насадкой. Улучшает звук и внешний вид автомобиля.',
        specifications: {
            'Производитель': 'Walker',
            'Страна': 'Польша',
            'Тип': 'Задний',
            'Материал': 'Нержавейка',
            'Диаметр': '60 мм'
        },
        rating: 4.6,
        reviews: 112,
        stock: 12
    }
];

// ==============================================
// 3. ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
// ==============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('AutoParts TMA загружается...');
    
    // Инициализация Telegram
    initTelegram();
    
    // Загрузка данных
    loadProducts();
    
    // Настройка интерфейса
    setupUI();
    
    // Обновление счетчиков
    updateCounters();
    
    // Скрыть загрузчик через 1 секунду
    setTimeout(() => {
        document.getElementById('page-loader').classList.add('hidden');
    }, 1000);
});

function initTelegram() {
    if (tg) {
        tg.expand();
        tg.MainButton.hide();
        tg.ready();
        
        // Получаем информацию о пользователе
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
            currentUser = tg.initDataUnsafe.user;
            updateUserInfo();
        }
    }
}

function loadProducts() {
    products = productsData;
    console.log(`Загружено ${products.length} товаров`);
}

function setupUI() {
    // Навигация
    setupNavigation();
    
    // Поиск
    setupSearch();
    
    // Категории
    setupCategoryChips();
    
    // Быстрая корзина
    setupQuickCart();
    
    // Закрытие модальных окон при клике на overlay
    setupModals();
}

// ==============================================
// 4. НАВИГАЦИЯ
// ==============================================
function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const page = btn.dataset.page;
            navigateTo(page);
        });
    });
    
    // Иконка корзины в шапке
    document.getElementById('cart-icon').addEventListener('click', () => {
        navigateTo('cart');
    });
}

function navigateTo(page) {
    console.log(`Переход на страницу: ${page}`);
    
    // Обновляем активную кнопку в навигации
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.page === page) {
            btn.classList.add('active');
        }
    });
    
    // Скрываем все страницы
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active-page');
    });
    
    // Показываем нужную страницу
    const pageElement = document.getElementById(`${page}-page`);
    if (pageElement) {
        pageElement.classList.add('active-page');
        currentPage = page;
        
        // Рендерим контент страницы
        switch(page) {
            case 'catalog':
                renderCatalogPage();
                break;
            case 'categories':
                renderCategoriesPage();
                break;
            case 'cart':
                renderCartPage();
                break;
            case 'orders':
                renderOrdersPage();
                break;
            case 'profile':
                renderProfilePage();
                break;
            case 'favorites':
                renderFavoritesPage();
                break;
            case 'checkout':
                renderCheckoutPage();
                break;
        }
    }
    
    // Прокручиваем страницу вверх
    window.scrollTo(0, 0);
}

// ==============================================
// 5. ПОИСК
// ==============================================
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const suggestions = document.getElementById('search-suggestions');
    
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        const query = searchInput.value.trim();
        
        if (query.length < 2) {
            suggestions.classList.remove('active');
            return;
        }
        
        searchTimeout = setTimeout(() => {
            showSearchSuggestions(query);
        }, 300);
    });
    
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim().length >= 2) {
            suggestions.classList.add('active');
        }
    });
    
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestions.contains(e.target)) {
            suggestions.classList.remove('active');
        }
    });
    
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            performSearch(query);
        }
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                performSearch(query);
            }
        }
    });
}

function showSearchSuggestions(query) {
    const suggestions = document.getElementById('search-suggestions');
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
    
    if (filtered.length === 0) {
        suggestions.innerHTML = '<div class="suggestion-item">Ничего не найдено</div>';
    } else {
        suggestions.innerHTML = filtered.map(p => `
            <div class="suggestion-item" onclick="viewProduct(${p.id})">
                <div class="suggestion-name">${p.name}</div>
                <div class="suggestion-category">${getCategoryName(p.category)} • ${p.price} ₽</div>
            </div>
        `).join('');
    }
    
    suggestions.classList.add('active');
}

function performSearch(query) {
    filters.searchQuery = query;
    navigateTo('catalog');
    renderCatalogPage();
    showNotification(`Поиск: "${query}"`, 'info');
}

// ==============================================
// 6. КАТЕГОРИИ В ШАПКЕ
// ==============================================
function setupCategoryChips() {
    document.querySelectorAll('.category-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const category = chip.dataset.category;
            
            // Обновляем активный чип
            document.querySelectorAll('.category-chip').forEach(c => {
                c.classList.remove('active');
            });
            chip.classList.add('active');
            
            // Устанавливаем фильтр
            filters.category = category;
            
            // Переходим в каталог
            navigateTo('catalog');
        });
    });
}

// ==============================================
// 7. БЫСТРАЯ КОРЗИНА
// ==============================================
function setupQuickCart() {
    const quickCart = document.getElementById('quick-cart');
    quickCart.addEventListener('click', () => {
        navigateTo('cart');
    });
}

function updateQuickCart() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('quick-cart-total').textContent = formatPrice(total) + ' ₽';
}

// ==============================================
// 8. МОДАЛЬНЫЕ ОКНА
// ==============================================
function setupModals() {
    document.querySelectorAll('.modal-overlay, .modal-close').forEach(el => {
        el.addEventListener('click', () => {
            closeAllModals();
        });
    });
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// ==============================================
// 9. РЕНДЕРИНГ СТРАНИЦ
// ==============================================

// Каталог
function renderCatalogPage() {
    const page = document.getElementById('catalog-page');
    
    let filteredProducts = [...products];
    
    // Применяем фильтры
    if (filters.category && filters.category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === filters.category);
    }
    
    if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.brand.toLowerCase().includes(query)
        );
    }
    
    if (filters.minPrice) {
        filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice);
    }
    
    if (filters.maxPrice) {
        filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice);
    }
    
    if (filters.inStock) {
        filteredProducts = filteredProducts.filter(p => p.stock > 0);
    }
    
    if (filters.brands.length > 0) {
        filteredProducts = filteredProducts.filter(p => filters.brands.includes(p.brand));
    }
    
    page.innerHTML = `
        <div class="catalog-container">
            <aside class="filters-sidebar">
                <div class="filter-header">
                    <h3><i class="fas fa-filter"></i> Фильтры</h3>
                    <button class="filter-reset" onclick="resetFilters()">Сбросить</button>
                </div>
                
                <div class="filter-group">
                    <h4>Цена, ₽</h4>
                    <div class="filter-price">
                        <input type="number" id="min-price" placeholder="От" value="${filters.minPrice || ''}">
                        <input type="number" id="max-price" placeholder="До" value="${filters.maxPrice || ''}">
                    </div>
                </div>
                
                <div class="filter-group">
                    <h4>Наличие</h4>
                    <label class="filter-checkbox">
                        <input type="checkbox" id="in-stock" ${filters.inStock ? 'checked' : ''}>
                        <span class="checkbox-custom"></span>
                        Только в наличии
                    </label>
                </div>
                
                <div class="filter-group">
                    <h4>Бренды</h4>
                    <div class="filter-options">
                        ${getUniqueBrands().map(brand => `
                            <label class="filter-checkbox">
                                <input type="checkbox" class="brand-filter" value="${brand}" 
                                       ${filters.brands.includes(brand) ? 'checked' : ''}>
                                <span class="checkbox-custom"></span>
                                ${brand}
                            </label>
                        `).join('')}
                    </div>
                </div>
                
                <div class="filter-actions">
                    <button class="btn-primary" onclick="applyFilters()">Применить</button>
                </div>
            </aside>
            
            <div class="products-section">
                <div class="products-header">
                    <h2>${getCategoryName(filters.category)}</h2>
                    <span class="products-count">Найдено: ${filteredProducts.length}</span>
                </div>
                
                <div class="products-grid">
                    ${filteredProducts.map(product => renderProductCard(product)).join('')}
                </div>
                
                ${filteredProducts.length === 0 ? `
                    <div class="empty-state">
                        <div class="empty-icon">
                            <i class="fas fa-box-open"></i>
                        </div>
                        <h3>Товары не найдены</h3>
                        <p>Попробуйте изменить параметры поиска</p>
                        <button class="btn-primary" onclick="resetFilters()">Сбросить фильтры</button>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    // Добавляем обработчики для фильтров
    setupFilterListeners();
}

function renderProductCard(product) {
    const isFavorite = favorites.includes(product.id);
    const inCart = cart.find(item => item.id === product.id);
    
    return `
        <div class="product-card" onclick="viewProduct(${product.id})">
            <div class="product-badges">
                ${product.isNew ? '<span class="product-badge badge-new">New</span>' : ''}
                ${product.isHit ? '<span class="product-badge badge-hit">Хит</span>' : ''}
                ${product.oldPrice ? '<span class="product-badge badge-sale">Sale</span>' : ''}
            </div>
            
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            
            <div class="product-actions">
                <button class="product-action-btn ${isFavorite ? 'active' : ''}" 
                        onclick="toggleFavorite(${product.id}, event)">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="product-action-btn" onclick="quickView(${product.id}, event)">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
            
            <div class="product-info">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <div class="product-title">${product.name}</div>
                <div class="product-description">${product.description.substring(0, 60)}...</div>
                
                <div class="product-rating">
                    <div class="stars">
                        ${getStars(product.rating)}
                    </div>
                    <span class="reviews-count">(${product.reviews})</span>
                </div>
                
                <div class="product-footer">
                    <div>
                        <span class="product-price">${product.price} ₽</span>
                        ${product.oldPrice ? `<span class="product-old-price">${product.oldPrice} ₽</span>` : ''}
                    </div>
                    
                    <div>
                        <span class="product-stock ${product.stock === 0 ? 'out-of-stock' : ''}">
                            <i class="fas ${product.stock > 0 ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                            ${product.stock > 0 ? 'В наличии' : 'Нет в наличии'}
                        </span>
                    </div>
                </div>
                
                <button class="btn-add-to-cart" 
                        onclick="addToCart(${product.id}, event)"
                        ${product.stock === 0 ? 'disabled' : ''}>
                    <i class="fas fa-cart-plus"></i>
                </button>
            </div>
        </div>
    `;
}

// Категории
function renderCategoriesPage() {
    const page = document.getElementById('categories-page');
    
    const categories = [
        { id: 'engine', name: 'Двигатель', icon: 'fa-engine', count: 45, color: '#c87f00' },
        { id: 'brakes', name: 'Тормозная система', icon: 'fa-car-brake', count: 32, color: '#FF6B00' },
        { id: 'suspension', name: 'Подвеска', icon: 'fa-car-side', count: 28, color: '#00C853' },
        { id: 'electrical', name: 'Электрика', icon: 'fa-bolt', count: 56, color: '#2979FF' },
        { id: 'body', name: 'Кузов', icon: 'fa-car', count: 67, color: '#9C27B0' },
        { id: 'exhaust', name: 'Выхлопная система', icon: 'fa-smog', count: 23, color: '#795548' },
        { id: 'oil', name: 'Масла', icon: 'fa-oil-can', count: 38, color: '#8BC34A' }
    ];
    
    page.innerHTML = `
        <div class="page-header">
            <h2><i class="fas fa-list"></i> Категории запчастей</h2>
            <p>Выберите категорию для просмотра товаров</p>
        </div>
        
        <div class="categories-grid">
            ${categories.map(cat => `
                <div class="category-card" onclick="filterByCategory('${cat.id}')">
                    <div class="category-icon" style="color: ${cat.color}">
                        <i class="fas ${cat.icon}"></i>
                    </div>
                    <h3>${cat.name}</h3>
                    <div class="category-count">${cat.count} товаров</div>
                </div>
            `).join('')}
        </div>
    `;
}

// Корзина
function renderCartPage() {
    const page = document.getElementById('cart-page');
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = subtotal > 10000 ? subtotal * 0.1 : 0;
    const total = subtotal - discount;
    
    page.innerHTML = `
        <div class="page-header">
            <h2><i class="fas fa-shopping-cart"></i> Корзина</h2>
            <p>${cart.length} товар(ов) на сумму ${formatPrice(subtotal)} ₽</p>
        </div>
        
        ${cart.length === 0 ? `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <h3>Корзина пуста</h3>
                <p>Добавьте товары из каталога</p>
                <button class="btn-primary" onclick="navigateTo('catalog')">
                    <i class="fas fa-th-large"></i> Перейти в каталог
                </button>
            </div>
        ` : `
            <div class="cart-container">
                <div class="cart-items">
                    ${cart.map(item => `
                        <div class="cart-item">
                            <div class="cart-item-image">
                                <img src="${item.image}" alt="${item.name}">
                            </div>
                            <div class="cart-item-details">
                                <h3 class="cart-item-title">${item.name}</h3>
                                <div class="cart-item-category">${getCategoryName(item.category)}</div>
                                <div class="cart-item-price">${formatPrice(item.price)} ₽</div>
                                
                                <div class="cart-item-controls">
                                    <div class="quantity-control">
                                        <button class="quantity-btn" 
                                                onclick="updateQuantity(${item.id}, -1)"
                                                ${item.quantity <= 1 ? 'disabled' : ''}>
                                            <i class="fas fa-minus"></i>
                                        </button>
                                        <span class="quantity">${item.quantity}</span>
                                        <button class="quantity-btn" 
                                                onclick="updateQuantity(${item.id}, 1)"
                                                ${item.quantity >= item.stock ? 'disabled' : ''}>
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </div>
                                    <button class="remove-item-btn" onclick="removeFromCart(${item.id})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="cart-summary">
                    <h3 class="summary-title">Итог заказа</h3>
                    
                    <div class="summary-row">
                        <span>Товары:</span>
                        <span>${formatPrice(subtotal)} ₽</span>
                    </div>
                    
                    ${discount > 0 ? `
                        <div class="summary-row" style="color: var(--success);">
                            <span>Скидка 10% (от 10000 ₽):</span>
                            <span>-${formatPrice(discount)} ₽</span>
                        </div>
                    ` : ''}
                    
                    <div class="summary-row total">
                        <span>Итого к оплате:</span>
                        <span class="summary-total-price">${formatPrice(total)} ₽</span>
                    </div>
                    
                    <div class="discount-code">
                        <input type="text" id="promo-code" placeholder="Промокод">
                        <button class="btn-apply" onclick="applyPromoCode()">Применить</button>
                    </div>
                    
                    <div class="cart-actions">
                        <button class="btn-primary btn-large" onclick="proceedToCheckout()">
                            <i class="fas fa-credit-card"></i> Оформить заказ
                        </button>
                        <button class="btn-secondary btn-large" onclick="clearCart()">
                            <i class="fas fa-trash"></i> Очистить корзину
                        </button>
                    </div>
                </div>
            </div>
        `}
    `;
    
    updateQuickCart();
}

// Заказы
function renderOrdersPage() {
    const page = document.getElementById('orders-page');
    
    page.innerHTML = `
        <div class="page-header">
            <h2><i class="fas fa-clipboard-list"></i> Мои заказы</h2>
            <p>${orders.length} заказ(ов)</p>
        </div>
        
        ${orders.length === 0 ? `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-clipboard-list"></i>
                </div>
                <h3>Заказов пока нет</h3>
                <p>Сделайте свой первый заказ</p>
                <button class="btn-primary" onclick="navigateTo('catalog')">
                    <i class="fas fa-shopping-cart"></i> Перейти к покупкам
                </button>
            </div>
        ` : `
            <div class="orders-list">
                ${orders.map(order => `
                    <div class="order-card">
                        <div class="order-header">
                            <span class="order-id">${order.id}</span>
                            <span class="order-date">${order.date}</span>
                            <span class="order-status status-${order.status}">
                                ${getOrderStatusText(order.status)}
                            </span>
                        </div>
                        
                        <div class="order-items">
                            ${order.items.map(item => `
                                <div class="order-item">
                                    <span>${item.name} × ${item.quantity}</span>
                                    <span>${formatPrice(item.price * item.quantity)} ₽</span>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="order-footer">
                            <div class="order-total">
                                Итого: <span>${formatPrice(order.total)} ₽</span>
                            </div>
                            
                            <div class="order-actions">
                                ${order.status === 'processing' ? `
                                    <button class="btn-secondary" onclick="cancelOrder('${order.id}')">
                                        Отменить
                                    </button>
                                ` : ''}
                                <button class="btn-primary" onclick="repeatOrder('${order.id}')">
                                    Повторить заказ
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `}
    `;
}

// Профиль
function renderProfilePage() {
    const page = document.getElementById('profile-page');
    
    const profileData = JSON.parse(localStorage.getItem('profile')) || {
        phone: '+7 (999) 123-45-67',
        email: currentUser ? `${currentUser.first_name.toLowerCase()}@example.com` : 'user@example.com',
        address: 'г. Москва, ул. Примерная, д. 1, кв. 1',
        notifications: true,
        newsletter: false
    };
    
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    
    page.innerHTML = `
        <div class="profile-header">
            <div class="profile-avatar">
                <i class="fas fa-user"></i>
            </div>
            <h2 class="profile-name">${currentUser ? currentUser.first_name + ' ' + (currentUser.last_name || '') : 'Иван Иванов'}</h2>
            <div class="profile-email">${currentUser ? currentUser.username : '@username'}</div>
            
            <div class="profile-stats">
                <div class="stat-card">
                    <div class="stat-value">${orders.length}</div>
                    <div class="stat-label">Заказов</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${favorites.length}</div>
                    <div class="stat-label">Избранное</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${formatPrice(totalSpent)}</div>
                    <div class="stat-label">Потрачено</div>
                </div>
            </div>
        </div>
        
        <div class="profile-sections">
            <div class="profile-section">
                <div class="section-title">
                    <i class="fas fa-user-circle"></i>
                    <h3>Личные данные</h3>
                </div>
                
                <div class="info-row">
                    <span class="info-label">Телефон:</span>
                    <span class="info-value">${profileData.phone}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value">${profileData.email}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Адрес доставки:</span>
                    <span class="info-value">${profileData.address}</span>
                </div>
                
                <button class="btn-secondary" onclick="editProfile()">
                    <i class="fas fa-edit"></i> Редактировать
                </button>
            </div>
            
            <div class="profile-section">
                <div class="section-title">
                    <i class="fas fa-cog"></i>
                    <h3>Настройки</h3>
                </div>
                
                <div class="settings-row">
                    <div>
                        <div class="setting-label">Уведомления о заказах</div>
                        <div class="setting-description">Получать push-уведомления</div>
                    </div>
                    <label class="switch">
                        <input type="checkbox" ${profileData.notifications ? 'checked' : ''} 
                               onchange="toggleSetting('notifications', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
                
                <div class="settings-row">
                    <div>
                        <div class="setting-label">Рассылка новостей</div>
                        <div class="setting-description">Получать информацию об акциях</div>
                    </div>
                    <label class="switch">
                        <input type="checkbox" ${profileData.newsletter ? 'checked' : ''}
                               onchange="toggleSetting('newsletter', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
                
                <div class="settings-row">
                    <div>
                        <div class="setting-label">Темная тема</div>
                        <div class="setting-description">Использовать темную тему</div>
                    </div>
                    <label class="switch">
                        <input type="checkbox" checked>
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
            
            <div class="profile-section">
                <div class="section-title">
                    <i class="fas fa-headset"></i>
                    <h3>Поддержка</h3>
                </div>
                
                <button class="btn-secondary" onclick="contactSupport()">
                    <i class="fas fa-comment"></i> 
                </button>
                <button class="btn-secondary" style="margin-top: 10px;" onclick="callSupport()">
                    <i class="fas fa-phone"></i> 
                </button>
            </div>
        </div>
    `;
}

// Избранное
function renderFavoritesPage() {
    const page = document.getElementById('favorites-page');
    const favoriteProducts = products.filter(p => favorites.includes(p.id));
    
    page.innerHTML = `
        <div class="favorites-header">
            <h2><i class="fas fa-heart"></i> Избранное</h2>
            <span class="favorites-count">${favoriteProducts.length} товаров</span>
        </div>
        
        ${favoriteProducts.length === 0 ? `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-heart"></i>
                </div>
                <h3>В избранном пока пусто</h3>
                <p>Добавляйте товары в избранное, чтобы не потерять</p>
                <button class="btn-primary" onclick="navigateTo('catalog')">
                    <i class="fas fa-th-large"></i> Перейти в каталог
                </button>
            </div>
        ` : `
            <div class="products-grid">
                ${favoriteProducts.map(product => renderProductCard(product)).join('')}
            </div>
        `}
    `;
}

// Страница товара
function renderProductPage(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const page = document.getElementById('product-page');
    const isFavorite = favorites.includes(product.id);
    const inCart = cart.find(item => item.id === product.id);
    
    page.innerHTML = `
        <div class="product-detail">
            <div class="product-detail-images">
                <div class="main-image">
                    <img src="${product.images[0]}" alt="${product.name}" id="main-product-image">
                </div>
                <div class="thumbnails">
                    ${product.images.map((img, index) => `
                        <div class="thumbnail ${index === 0 ? 'active' : ''}" 
                             onclick="changeProductImage('${img}', this)">
                            <img src="${img}" alt="">
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="product-detail-info">
                <div class="product-detail-category">${getCategoryName(product.category)}</div>
                <h1 class="product-detail-title">${product.name}</h1>
                
                <div class="product-detail-meta">
                    <div class="product-detail-rating">
                        <span class="stars">${getStars(product.rating)}</span>
                        <span>${product.rating} (${product.reviews} отзывов)</span>
                    </div>
                    <div>Артикул: ${product.id}</div>
                </div>
                
                <div class="product-detail-price">
                    ${product.price} ₽
                    ${product.oldPrice ? `<span class="product-detail-old-price">${product.oldPrice} ₽</span>` : ''}
                </div>
                
                <div class="product-detail-stock ${product.stock === 0 ? 'out-of-stock' : ''}">
                    <i class="fas ${product.stock > 0 ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                    ${product.stock > 0 ? 'В наличии' : 'Нет в наличии'}
                    ${product.stock > 0 ? `(осталось ${product.stock} шт.)` : ''}
                </div>
                
                <div class="product-detail-description">
                    ${product.description}
                </div>
                
                <div class="product-detail-specs">
                    ${Object.entries(product.specifications).map(([key, value]) => `
                        <div class="spec-item">
                            <span class="spec-label">${key}:</span>
                            <span class="spec-value">${value}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="product-detail-actions">
                    <button class="btn-buy" onclick="addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i> Добавить в корзину
                    </button>
                    <button class="btn-wishlist ${isFavorite ? 'active' : ''}" onclick="toggleFavorite(${product.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Оформление заказа
function renderCheckoutPage() {
    const page = document.getElementById('checkout-page');
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = subtotal > 10000 ? subtotal * 0.1 : 0;
    const total = subtotal - discount;
    
    page.innerHTML = `
        <div class="page-header">
            <h2><i class="fas fa-truck"></i> Оформление заказа</h2>
        </div>
        
        <div class="checkout-container">
            <div class="checkout-form">
                <div class="form-section">
                    <h3><i class="fas fa-user"></i> Контактная информация</h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Имя</label>
                            <input type="text" class="form-input" id="checkout-name" 
                                   value="${currentUser ? currentUser.first_name : ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Фамилия</label>
                            <input type="text" class="form-input" id="checkout-lastname"
                                   value="${currentUser ? currentUser.last_name || '' : ''}">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Телефон</label>
                        <input type="tel" class="form-input" id="checkout-phone" 
                               placeholder="+7 (999) 123-45-67">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-input" id="checkout-email"
                               value="${currentUser ? currentUser.username + '@example.com' : ''}">
                    </div>
                </div>
                
                <div class="form-section">
                    <h3><i class="fas fa-map-marker-alt"></i> Адрес доставки</h3>
                    
                    <div class="form-group">
                        <label class="form-label">Город</label>
                        <input type="text" class="form-input" id="checkout-city" value="Москва">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Улица, дом, квартира</label>
                        <input type="text" class="form-input" id="checkout-address">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Комментарий к заказу</label>
                        <textarea class="form-textarea" id="checkout-comment"></textarea>
                    </div>
                </div>
                
                <div class="form-section">
                    <h3><i class="fas fa-truck"></i> Способ доставки</h3>
                    
                    <div class="form-group">
                        <select class="form-input" id="checkout-delivery">
                            <option value="courier">Курьером (бесплатно)</option>
                            <option value="pickup">Самовывоз (скидка 5%)</option>
                            <option value="express">Экспресс-доставка (+300 ₽)</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-section">
                    <h3><i class="fas fa-credit-card"></i> Способ оплаты</h3>
                    
                    <div class="form-group">
                        <select class="form-input" id="checkout-payment">
                            <option value="card">Банковской картой онлайн</option>
                            <option value="sbp">СБП (скидка 2%)</option>
                            <option value="cash">Наличными при получении</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div class="cart-summary">
                <h3 class="summary-title">Ваш заказ</h3>
                
                ${cart.map(item => `
                    <div class="summary-row">
                        <span>${item.name} × ${item.quantity}</span>
                        <span>${formatPrice(item.price * item.quantity)} ₽</span>
                    </div>
                `).join('')}
                
                <div class="summary-row total">
                    <span>Итого:</span>
                    <span class="summary-total-price">${formatPrice(total)} ₽</span>
                </div>
                
                <button class="btn-primary btn-large" onclick="placeOrder()">
                    <i class="fas fa-check"></i> Подтвердить заказ
                </button>
            </div>
        </div>
    `;
}

// ==============================================
// 10. РАБОТА С ТОВАРАМИ
// ==============================================
function viewProduct(productId) {
    renderProductPage(productId);
    navigateTo('product');
}

function quickView(productId, event) {
    event.stopPropagation();
    const product = products.find(p => p.id === productId);
    
    const modal = document.getElementById('quick-view-modal');
    const content = document.getElementById('quick-view-content');
    
    content.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 20px;">
            <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: 12px;">
            <div>
                <h2>${product.name}</h2>
                <p style="color: var(--text-muted); margin: 10px 0;">${product.description}</p>
                <div style="font-size: 24px; color: var(--primary); margin: 20px 0;">
                    ${product.price} ₽
                </div>
                <button class="btn-primary" onclick="addToCart(${product.id}); closeModal('quick-view-modal')">
                    Добавить в корзину
                </button>
            </div>
        </div>
    `;
    
    openModal('quick-view-modal');
}

function changeProductImage(src, element) {
    document.getElementById('main-product-image').src = src;
    
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    element.classList.add('active');
}

function filterByCategory(category) {
    // Обновляем активный чип
    document.querySelectorAll('.category-chip').forEach(c => {
        c.classList.remove('active');
        if (c.dataset.category === category) {
            c.classList.add('active');
        }
    });
    
    // Устанавливаем фильтр
    filters.category = category;
    
    // Переходим в каталог
    navigateTo('catalog');
}

// ==============================================
// 11. РАБОТА С ФИЛЬТРАМИ
// ==============================================
function setupFilterListeners() {
    document.querySelectorAll('.brand-filter').forEach(cb => {
        cb.addEventListener('change', () => {
            // Не применяем автоматически, ждем кнопку "Применить"
        });
    });
    
    document.getElementById('in-stock')?.addEventListener('change', () => {
        // Не применяем автоматически
    });
}

function applyFilters() {
    const minPrice = document.getElementById('min-price').value;
    const maxPrice = document.getElementById('max-price').value;
    const inStock = document.getElementById('in-stock').checked;
    
    filters.minPrice = minPrice ? parseInt(minPrice) : null;
    filters.maxPrice = maxPrice ? parseInt(maxPrice) : null;
    filters.inStock = inStock;
    
    // Собираем выбранные бренды
    filters.brands = [];
    document.querySelectorAll('.brand-filter:checked').forEach(cb => {
        filters.brands.push(cb.value);
    });
    
    renderCatalogPage();
    showNotification('Фильтры применены', 'success');
}

function resetFilters() {
    filters = {
        category: 'all',
        minPrice: null,
        maxPrice: null,
        inStock: false,
        brands: [],
        searchQuery: null
    };
    
    // Сбрасываем чипы категорий
    document.querySelectorAll('.category-chip').forEach(c => {
        c.classList.remove('active');
        if (c.dataset.category === 'all') {
            c.classList.add('active');
        }
    });
    
    renderCatalogPage();
    showNotification('Фильтры сброшены', 'info');
}

// ==============================================
// 12. РАБОТА С КОРЗИНОЙ
// ==============================================
function addToCart(productId, event) {
    if (event) event.stopPropagation();
    
    const product = products.find(p => p.id === productId);
    if (!product || product.stock === 0) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        } else {
            showNotification('Достигнут максимальный доступный запас', 'error');
            return;
        }
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCounters();
    showNotification('Товар добавлен в корзину', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCounters();
    
    if (currentPage === 'cart') {
        renderCartPage();
    }
    
    showNotification('Товар удален из корзины', 'info');
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    const newQuantity = item.quantity + change;
    
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (product && newQuantity > product.stock) {
        showNotification('Недостаточно товара на складе', 'error');
        return;
    }
    
    item.quantity = newQuantity;
    saveCart();
    updateCounters();
    
    if (currentPage === 'cart') {
        renderCartPage();
    }
}

function clearCart() {
    if (cart.length === 0) return;
    
    openConfirmModal('Очистить корзину', 'Вы уверены, что хотите удалить все товары из корзины?', () => {
        cart = [];
        saveCart();
        updateCounters();
        
        if (currentPage === 'cart') {
            renderCartPage();
        }
        
        showNotification('Корзина очищена', 'success');
    });
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateQuickCart();
}

// ==============================================
// 13. РАБОТА С ИЗБРАННЫМ
// ==============================================
function toggleFavorite(productId, event) {
    if (event) event.stopPropagation();
    
    const index = favorites.indexOf(productId);
    
    if (index === -1) {
        favorites.push(productId);
        showNotification('Добавлено в избранное', 'success');
    } else {
        favorites.splice(index, 1);
        showNotification('Удалено из избранного', 'info');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateCounters();
    
    if (currentPage === 'catalog') {
        renderCatalogPage();
    } else if (currentPage === 'favorites') {
        renderFavoritesPage();
    } else if (currentPage === 'product') {
        renderProductPage(productId);
    }
}

// ==============================================
// 14. РАБОТА С ЗАКАЗАМИ
// ==============================================
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Корзина пуста', 'error');
        return;
    }
    
    navigateTo('checkout');
}

function placeOrder() {
    const name = document.getElementById('checkout-name')?.value;
    const phone = document.getElementById('checkout-phone')?.value;
    const address = document.getElementById('checkout-address')?.value;
    
    if (!name || !phone || !address) {
        showNotification('Заполните все поля', 'error');
        return;
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = subtotal > 10000 ? subtotal * 0.1 : 0;
    const total = subtotal - discount;
    
    const order = {
        id: 'ORD-' + Date.now(),
        date: new Date().toLocaleDateString('ru-RU'),
        status: 'processing',
        total: total,
        items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
        }))
    };
    
    orders.unshift(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Очищаем корзину
    cart = [];
    saveCart();
    updateCounters();
    
    // Открываем окно оплаты
    document.getElementById('payment-amount').textContent = formatPrice(subtotal) + ' ₽';
    document.getElementById('payment-total').textContent = formatPrice(total) + ' ₽';
    openModal('payment-modal');
}

function processPayment() {
    // Имитация оплаты
    showNotification('Оплата прошла успешно!', 'success');
    closeModal('payment-modal');
    navigateTo('orders');
}

function cancelOrder(orderId) {
    openConfirmModal('Отмена заказа', 'Вы уверены, что хотите отменить заказ?', () => {
        const orderIndex = orders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
            orders[orderIndex].status = 'cancelled';
            localStorage.setItem('orders', JSON.stringify(orders));
            renderOrdersPage();
            showNotification('Заказ отменен', 'success');
        }
    });
}

function repeatOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    order.items.forEach(item => {
        const product = products.find(p => p.name === item.name);
        if (product) {
            const existingItem = cart.find(i => i.id === product.id);
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                cart.push({
                    ...product,
                    quantity: item.quantity
                });
            }
        }
    });
    
    saveCart();
    updateCounters();
    navigateTo('cart');
    showNotification('Товары добавлены в корзину', 'success');
}

// ==============================================
// 15. РАБОТА С ПРОФИЛЕМ
// ==============================================
function updateUserInfo() {
    if (currentUser) {
        document.getElementById('user-name').textContent = `${currentUser.first_name} ${currentUser.last_name || ''}`;
        document.getElementById('user-email').textContent = currentUser.username ? `@${currentUser.username}` : '';
    }
}

function editProfile() {
    const profileData = JSON.parse(localStorage.getItem('profile')) || {};
    
    const newPhone = prompt('Введите новый телефон:', profileData.phone || '+7 (999) 123-45-67');
    if (newPhone) profileData.phone = newPhone;
    
    const newEmail = prompt('Введите новый email:', profileData.email || 'user@example.com');
    if (newEmail) profileData.email = newEmail;
    
    const newAddress = prompt('Введите новый адрес:', profileData.address || 'г. Москва, ул. Примерная, д. 1');
    if (newAddress) profileData.address = newAddress;
    
    localStorage.setItem('profile', JSON.stringify(profileData));
    renderProfilePage();
    showNotification('Профиль обновлен', 'success');
}

function toggleSetting(setting, value) {
    const profileData = JSON.parse(localStorage.getItem('profile')) || {};
    profileData[setting] = value;
    localStorage.setItem('profile', JSON.stringify(profileData));
    showNotification('Настройка сохранена', 'success');
}

function contactSupport() {
    window.open('https://t.me/vadichka0006', '_blank');
}

function callSupport() {
    window.location.href = 'tel:+78001234567';
}

function logout() {
    // Очищаем сессию
    if (tg) {
        tg.close();
    }
}

// ==============================================
// 16. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ==============================================
function getCategoryName(category) {
    const categories = {
        'all': 'Все товары',
        'engine': 'Двигатель',
        'brakes': 'Тормозная система',
        'suspension': 'Подвеска',
        'electrical': 'Электрика',
        'body': 'Кузовные детали',
        'exhaust': 'Выхлопная система',
        'oil': 'Масла и жидкости'
    };
    return categories[category] || category;
}

function getStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function getOrderStatusText(status) {
    const statuses = {
        'new': 'Новый',
        'processing': 'В обработке',
        'delivered': 'Доставлен',
        'cancelled': 'Отменен'
    };
    return statuses[status] || status;
}

function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price);
}

function getUniqueBrands() {
    return [...new Set(products.map(p => p.brand))];
}

function updateCounters() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartBadges = document.querySelectorAll('#cart-count, #nav-cart-count');
    
    cartBadges.forEach(badge => {
        badge.textContent = cartCount;
        badge.style.display = cartCount > 0 ? 'flex' : 'none';
    });
    
    const favoritesCount = favorites.length;
    const favBadges = document.querySelectorAll('#nav-favorites-count');
    
    favBadges.forEach(badge => {
        badge.textContent = favoritesCount;
        badge.style.display = favoritesCount > 0 ? 'flex' : 'none';
    });
    
    updateQuickCart();
}

function openConfirmModal(title, message, onConfirm) {
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;
    
    const confirmBtn = document.getElementById('confirm-action');
    confirmBtn.onclick = () => {
        onConfirm();
        closeModal('confirm-modal');
    };
    
    openModal('confirm-modal');
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${getNotificationIcon(type)}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

function applyPromoCode() {
    const code = document.getElementById('promo-code').value;
    if (code) {
        showNotification('Промокод применен', 'success');
    }
}

// ==============================================
// 17. ДЕЛАЕМ ФУНКЦИИ ГЛОБАЛЬНЫМИ
// ==============================================
window.navigateTo = navigateTo;
window.viewProduct = viewProduct;
window.quickView = quickView;
window.changeProductImage = changeProductImage;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.toggleFavorite = toggleFavorite;
window.filterByCategory = filterByCategory;
window.applyFilters = applyFilters;
window.resetFilters = resetFilters;
window.proceedToCheckout = proceedToCheckout;
window.placeOrder = placeOrder;
window.processPayment = processPayment;
window.cancelOrder = cancelOrder;
window.repeatOrder = repeatOrder;
window.editProfile = editProfile;
window.toggleSetting = toggleSetting;
window.contactSupport = contactSupport;
window.callSupport = callSupport;
window.logout = logout;
window.openModal = openModal;
window.closeModal = closeModal;
window.showNotification = showNotification;
window.applyPromoCode = applyPromoCode;


console.log('AutoParts TMA успешно загружен! 🚗');
