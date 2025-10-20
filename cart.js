// ==================== CART PAGE FUNCTIONALITY ====================

// Get cart from memory
let cart = JSON.parse(localStorage.getItem('eclatCart')) || [];

// Update cart count
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        if (totalItems > 0) {
            cartCountElement.style.display = 'block';
        } else {
            cartCountElement.style.display = 'none';
        }
    }
}

// Calculate totals
function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? (subtotal > 50 ? 0 : 0.60) : 0;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;
    
    return { subtotal, shipping, tax, total };
}

// Format price to INR
function formatPrice(usdPrice) {
    const inrPrice = usdPrice * 83; // Conversion rate
    return `₹${Math.round(inrPrice).toLocaleString('en-IN')}`;
}

// Update summary
function updateSummary() {
    const { subtotal, shipping, tax, total } = calculateTotals();
    
    document.getElementById('subtotal').textContent = formatPrice(subtotal);
    document.getElementById('shipping').textContent = shipping === 0 && subtotal > 0 ? 'FREE' : formatPrice(shipping);
    document.getElementById('tax').textContent = formatPrice(tax);
    document.getElementById('total').textContent = formatPrice(total);
}

// Render cart items
function renderCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    
    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        emptyCart.style.display = 'block';
        updateSummary();
        return;
    }
    
    cartItemsContainer.style.display = 'flex';
    emptyCart.style.display = 'none';
    
    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item" data-index="${index}">
            <div class="item-image">
                <img src="${item.image || 'img/perfume1.png'}" alt="${item.name}">
            </div>
            <div class="item-details">
                <div>
                    <h3 class="item-name">${item.name}</h3>
                    <p class="item-notes">${item.notes || 'Luxury Fragrance'}</p>
                </div>
                <div class="item-actions">
                    <div class="quantity-control">
                        <button class="qty-btn minus" onclick="updateQuantity(${index}, -1)">−</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="qty-btn plus" onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                    <span class="item-price">${formatPrice(item.price * item.quantity)}</span>
                    <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
                </div>
            </div>
        </div>
    `).join('');
    
    updateSummary();
    animateCartItems();
}

// Update quantity
function updateQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;
        
        if (cart[index].quantity <= 0) {
            removeItem(index);
            return;
        }
        
        localStorage.setItem('eclatCart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
        
        // Animation
        const cartItem = document.querySelector(`[data-index="${index}"]`);
        gsap.fromTo(cartItem, 
            { scale: 0.95 },
            { scale: 1, duration: 0.3, ease: 'back.out(2)' }
        );
    }
}

// Remove item
function removeItem(index) {
    const cartItem = document.querySelector(`[data-index="${index}"]`);
    
    gsap.to(cartItem, {
        opacity: 0,
        x: -100,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
            cart.splice(index, 1);
            localStorage.setItem('eclatCart', JSON.stringify(cart));
            updateCartCount();
            renderCart();
        }
    });
}

// Animate cart items on load
function animateCartItems() {
    gsap.from('.cart-item', {
        opacity: 0,
        y: 30,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out'
    });
}

// Checkout button
document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Store cart data
    localStorage.setItem('eclatCart', JSON.stringify(cart));
    
    // Navigate to checkout
    window.location.href = 'checkout.html';
});

// Cart icon click
document.querySelector('.cart-icon')?.addEventListener('click', () => {
    window.location.href = 'cart.html';
});

// Page load animations
gsap.from('.page-title', {
    opacity: 0,
    y: -30,
    duration: 0.8,
    ease: 'power2.out'
});

gsap.from('.cart-summary', {
    opacity: 0,
    x: 50,
    duration: 0.8,
    delay: 0.3,
    ease: 'power2.out'
});

// Footer icon animations
gsap.from(".social-link", {
    opacity: 0,
    y: 20,
    stagger: 0.1,
    duration: 0.8,
    scrollTrigger: {
        trigger: ".footer-section",
        start: "top 80%",
    }
});

document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
        gsap.to(link, {
            scale: 1.2,
            rotation: 10,
            duration: 0.3,
            ease: 'back.out(2)'
        });
    });
    
    link.addEventListener('mouseleave', () => {
        gsap.to(link, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Navbar animations
window.addEventListener("load", () => {
    gsap.fromTo(".navbar", 
        { opacity: 0, y: -30 },
        { 
            opacity: 1, 
            y: 0,
            duration: 1, 
            ease: "power2.out" 
        }
    );
});

// Sticky navbar on scroll
window.addEventListener("scroll", () => {
    const nav = document.querySelector(".navbar");
    if (window.scrollY > 100) {
        nav.classList.add("sticky");
    } else {
        nav.classList.remove("sticky");
    }
});

// Initialize music player on cart page
document.addEventListener('DOMContentLoaded', () => {
    const musicPlayer = document.getElementById('musicPlayer');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const volumeBtn = document.getElementById('volumeBtn');
    
    let isPlaying = false;
    let isMuted = false;
    
    // Check if user is logged in
    const user = localStorage.getItem('eclatUser');
    if (user && user !== 'null' && user !== 'undefined') {
        // Show music player
        if (musicPlayer) {
            musicPlayer.classList.add('active');
            
            // Auto-play after delay
            setTimeout(() => {
                if (backgroundMusic) {
                    backgroundMusic.play().then(() => {
                        isPlaying = true;
                        updatePlayButton();
                    }).catch(error => console.log('Auto-play prevented'));
                }
            }, 500);
        }
    }
    
    // Play/Pause
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (isPlaying) {
                backgroundMusic.pause();
                isPlaying = false;
            } else {
                backgroundMusic.play();
                isPlaying = true;
            }
            updatePlayButton();
        });
    }
    
    // Volume toggle
    if (volumeBtn) {
        volumeBtn.addEventListener('click', () => {
            isMuted = !isMuted;
            backgroundMusic.muted = isMuted;
            updateVolumeButton();
        });
    }
    
    function updatePlayButton() {
        const icon = playPauseBtn.querySelector('i');
        if (icon) {
            icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
        }
    }
    
    function updateVolumeButton() {
        const icon = volumeBtn.querySelector('i');
        if (icon) {
            icon.className = isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
        }
    }
});

// Initialize
updateCartCount();
renderCart();