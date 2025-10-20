// ==================== CHECKOUT PAGE FUNCTIONALITY ====================

// Get cart from localStorage
let cart = JSON.parse(localStorage.getItem('eclatCart')) || [];

// Format price to INR
function formatPrice(usdPrice) {
    const inrPrice = usdPrice * 83; // Conversion rate
    return `₹${Math.round(inrPrice).toLocaleString('en-IN')}`;
}

// Update cart count display
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

// Render order summary
function renderOrderSummary() {
    const orderItemsContainer = document.getElementById('orderItems');
    
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    orderItemsContainer.innerHTML = cart.map(item => `
        <div class="order-item">
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>Qty: ${item.quantity}</p>
            </div>
            <span class="item-price">${formatPrice(item.price * item.quantity)}</span>
        </div>
    `).join('');
    
    const { subtotal, shipping, tax, total } = calculateTotals();
    
    document.getElementById('summarySubtotal').textContent = formatPrice(subtotal);
    document.getElementById('summaryShipping').textContent = shipping === 0 ? 'FREE' : formatPrice(shipping);
    document.getElementById('summaryTax').textContent = formatPrice(tax);
    document.getElementById('summaryTotal').textContent = formatPrice(total);
}

// Payment method toggle
const paymentOptions = document.querySelectorAll('input[name="payment"]');
const cardDetails = document.getElementById('cardDetails');

paymentOptions.forEach(option => {
    option.addEventListener('change', (e) => {
        if (e.target.value === 'card') {
            cardDetails.style.display = 'block';
            gsap.from(cardDetails, {
                opacity: 0,
                y: 20,
                duration: 0.4,
                ease: 'power2.out'
            });
        } else {
            cardDetails.style.display = 'none';
        }
    });
});

// Format card number
document.getElementById('cardNumber')?.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
});

// Format expiry date
document.getElementById('expiry')?.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
});

// Form submission
document.getElementById('checkoutForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zip: document.getElementById('zip').value,
        country: document.getElementById('country').value,
        paymentMethod: document.querySelector('input[name="payment"]:checked').value,
        cart: cart,
        totals: calculateTotals(),
        orderDate: new Date().toISOString(),
        orderNumber: 'EC' + Date.now()
    };
    
    // Validate payment
    const paymentMethod = formData.paymentMethod;
    if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber').value;
        const cardName = document.getElementById('cardName').value;
        const expiry = document.getElementById('expiry').value;
        const cvv = document.getElementById('cvv').value;
        
        if (!cardNumber || !cardName || !expiry || !cvv) {
            alert('Please fill in all card details');
            return;
        }
    }
    
    // Store order data
    localStorage.setItem('eclatOrder', JSON.stringify(formData));
    
    // Clear cart
    localStorage.removeItem('eclatCart');
    
    // Show loading animation
    const btn = document.querySelector('.btn-place-order');
    btn.textContent = 'Processing...';
    btn.disabled = true;
    
    gsap.to(btn, {
        scale: 0.95,
        duration: 0.2,
        yoyo: true,
        repeat: 3
    });
    
    // Redirect to receipt page
    setTimeout(() => {
        window.location.href = 'receipt.html';
    }, 2000);
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

gsap.from('.checkout-steps', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    delay: 0.2,
    ease: 'power2.out'
});

gsap.from('.checkout-form', {
    opacity: 0,
    x: -50,
    duration: 0.8,
    delay: 0.4,
    ease: 'power2.out'
});

gsap.from('.order-summary', {
    opacity: 0,
    x: 50,
    duration: 0.8,
    delay: 0.4,
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

// ==================== NAVBAR FUNCTIONALITY ====================
// Fade in navbar on page load
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

// Initialize music player on checkout page
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
renderOrderSummary();