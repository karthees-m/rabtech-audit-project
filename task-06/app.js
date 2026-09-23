const API_URL = 'https://fakestoreapi.com/products';

let products = [];
let cart = JSON.parse(localStorage.getItem('nexus_cart')) || [];

const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const categorySelect = document.getElementById('category-select');
const sortSelect = document.getElementById('sort-select');
const loadingSkeleton = document.getElementById('loading-skeleton');
const errorBanner = document.getElementById('error-banner');
const cartBtn = document.getElementById('cart-btn');
const closeCart = document.getElementById('close-cart');
const cartDrawer = document.getElementById('cart-drawer');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const productModal = document.getElementById('product-modal');
const closeModal = document.getElementById('close-modal');
const modalBody = document.getElementById('modal-body');

document.addEventListener('DOMContentLoaded', async () => {
    showLoading(true);
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch product inventory.');
        products = await response.json();
        renderProducts(products);
        updateCartUI();
    } catch (error) {
        errorBanner.textContent = error.message;
        errorBanner.style.display = 'block';
    } finally {
        showLoading(false);
    }
});

function renderProducts(items) {
    productGrid.innerHTML = '';
    if (items.length === 0) {
        productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align:center;">No products found.</p>';
        return;
    }

    items.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="card-clickable" data-id="${product.id}">
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <div class="price">$${product.price.toFixed(2)}</div>
            </div>
            <div class="card-actions">
                <button class="btn-view" data-id="${product.id}">View</button>
                <button class="btn-add" data-id="${product.id}">Add</button>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

function filterAndSortProducts() {
    let result = [...products];
    const query = searchInput.value.toLowerCase();
    const category = categorySelect.value;
    const sort = sortSelect.value;

    if (query) {
        result = result.filter(p => p.title.toLowerCase().includes(query));
    }

    if (category !== 'all') {
        result = result.filter(p => p.category === category);
    }

    if (sort === 'low-high') {
        result.sort((a, b) => a.price - b.price);
    } else if (sort === 'high-low') {
        result.sort((a, b) => b.price - a.price);
    }

    renderProducts(result);
}

searchInput.addEventListener('input', filterAndSortProducts);
categorySelect.addEventListener('change', filterAndSortProducts);
sortSelect.addEventListener('change', filterAndSortProducts);

productGrid.addEventListener('click', (e) => {
    const id = Number(e.target.getAttribute('data-id') || e.target.closest('[data-id]')?.getAttribute('data-id'));
    if (!id) return;

    if (e.target.classList.contains('btn-add')) {
        const product = products.find(p => p.id === id);
        if (product) {
            cart.push(product);
            saveAndSyncCart();
        }
    } else {
        const product = products.find(p => p.id === id);
        if (product) openProductModal(product);
    }
});

function openProductModal(product) {
    modalBody.innerHTML = `
        <div class="modal-body-grid">
            <img src="${product.image}" alt="${product.title}">
            <div class="modal-details">
                <h2>${product.title}</h2>
                <div class="price">$${product.price.toFixed(2)}</div>
                <p>${product.description}</p>
                <button class="btn-add" data-id="${product.id}" style="width:100%; padding:14px; border-radius:10px; background:var(--primary); color:white; border:none; font-weight:700; cursor:pointer;">Add to Cart</button>
            </div>
        </div>
    `;
    productModal.classList.add('open');
}

modalBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-add')) {
        const id = Number(e.target.getAttribute('data-id'));
        const product = products.find(p => p.id === id);
        if (product) {
            cart.push(product);
            saveAndSyncCart();
            productModal.classList.remove('open');
        }
    }
});

closeModal.addEventListener('click', () => productModal.classList.remove('open'));
productModal.addEventListener('click', (e) => {
    if (e.target === productModal) productModal.classList.remove('open');
});

function saveAndSyncCart() {
    localStorage.setItem('nexus_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    cartCount.textContent = cart.length;
    cartItemsContainer.innerHTML = '';

    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-details">
                <h4>${item.title}</h4>
                <p>$${item.price.toFixed(2)}</p>
            </div>
            <button data-index="${index}" style="background:none; border:none; color:#ef4444; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
        `;
        cartItemsContainer.appendChild(div);
    });

    cartTotal.textContent = total.toFixed(2);
}

cartItemsContainer.addEventListener('click', (e) => {
    if (e.target.closest('button')) {
        const btn = e.target.closest('button');
        const index = Number(btn.getAttribute('data-index'));
        cart.splice(index, 1);
        saveAndSyncCart();
    }
});

cartBtn.addEventListener('click', () => cartDrawer.classList.add('open'));
closeCart.addEventListener('click', () => cartDrawer.classList.remove('open'));

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    alert('Order successfully placed!');
    cart = [];
    saveAndSyncCart();
    cartDrawer.classList.remove('open');
});

function showLoading(show) {
    loadingSkeleton.style.display = show ? 'block' : 'none';
}