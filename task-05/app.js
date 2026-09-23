import { fetchProducts } from './api.js';

let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const categorySelect = document.getElementById('category-select');
const errorBanner = document.getElementById('error-banner');
const loadingSkeleton = document.getElementById('loading-skeleton');

document.addEventListener('DOMContentLoaded', async () => {
    showLoading(true);
    try {
        products = await fetchProducts();
        renderProducts(products);
    } catch (error) {
        showError('Unable to load products. Please check your connection.');
    } finally {
        showLoading(false);
    }
});

function renderProducts(items) {
    productGrid.innerHTML = '';
    if (items.length === 0) {
        productGrid.innerHTML = '<p>No products found.</p>';
        return;
    }

    items.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}" width="100">
            <h3>${product.title}</h3>
            <p>$${product.price}</p>
            <button data-id="${product.id}">Add to Cart</button>
        `;
        productGrid.appendChild(card);
    });
}

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = products.filter(p => p.title.toLowerCase().includes(query));
    renderProducts(filtered);
});

categorySelect.addEventListener('change', (e) => {
    const category = e.target.value;
    if (category === 'all') {
        renderProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        renderProducts(filtered);
    }
});

productGrid.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        const id = e.target.getAttribute('data-id');
        const item = products.find(p => p.id == id);
        if (item) {
            cart.push(item);
            localStorage.setItem('cart', JSON.stringify(cart));
            alert('Added to cart successfully!');
        }
    }
});

function showLoading(isLoading) {
    if (isLoading) {
        loadingSkeleton.style.display = 'block';
    } else {
        loadingSkeleton.style.display = 'none';
    }
}

function showError(message) {
    errorBanner.textContent = message;
    errorBanner.style.display = 'block';
}