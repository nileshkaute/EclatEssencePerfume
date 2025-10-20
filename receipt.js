// ==================== RECEIPT PAGE FUNCTIONALITY ====================

// Get order data from memory
const orderData = JSON.parse(localStorage.getItem('eclatOrder'));

// Format price to INR
function formatPrice(usdPrice) {
    const inrPrice = usdPrice * 83;
    return `₹${Math.round(inrPrice).toLocaleString('en-IN')}`;
}

// Update cart count display (should be 0 after order)
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        const cart = JSON.parse(localStorage.getItem('eclatCart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        
        if (totalItems > 0) {
            cartCountElement.style.display = 'block';
        } else {
            cartCountElement.style.display = 'none';
        }
    }
}

if (!orderData) {
    // No order data, redirect to home
    window.location.href = 'index.html';
} else {
    displayReceipt();
}

function displayReceipt() {
    // Order Number
    document.getElementById('orderNumber').textContent = orderData.orderNumber;
    
    // Order Date
    const orderDate = new Date(orderData.orderDate);
    const formattedDate = orderDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('orderDate').textContent = formattedDate;
    
    // Payment Method
    const paymentMethods = {
        'card': 'Credit/Debit Card',
        'paypal': 'PayPal',
        'cod': 'Cash on Delivery'
    };
    document.getElementById('paymentMethod').textContent = paymentMethods[orderData.paymentMethod] || orderData.paymentMethod;
    
    // Shipping Details
    const shippingHTML = `
        <p><strong>${orderData.firstName} ${orderData.lastName}</strong></p>
        <p>${orderData.address}</p>
        <p>${orderData.city}, ${orderData.state} ${orderData.zip}</p>
        <p>${orderData.country}</p>
        <p>Email: ${orderData.email}</p>
        <p>Phone: ${orderData.phone}</p>
    `;
    document.getElementById('shippingDetails').innerHTML = shippingHTML;
    document.getElementById('customerEmail').textContent = orderData.email;
    
    // Order Items
    const orderItemsHTML = orderData.cart.map(item => `
        <div class="order-item">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>Quantity: ${item.quantity} × ${formatPrice(item.price)}</p>
            </div>
            <span class="item-total">${formatPrice(item.price * item.quantity)}</span>
        </div>
    `).join('');
    document.getElementById('orderItemsList').innerHTML = orderItemsHTML;
    
    // Order Summary
    const totals = orderData.totals;
    document.getElementById('receiptSubtotal').textContent = formatPrice(totals.subtotal);
    document.getElementById('receiptShipping').textContent = totals.shipping === 0 ? 'FREE' : formatPrice(totals.shipping);
    document.getElementById('receiptTax').textContent = formatPrice(totals.tax);
    document.getElementById('receiptTotal').textContent = formatPrice(totals.total);
}

// Download Receipt as text
function downloadReceipt() {
    const receiptText = `
╔═══════════════════════════════════════════════════════════╗
            ÉCLAT ESSENCE - ORDER RECEIPT
╚═══════════════════════════════════════════════════════════╝

Order Number: ${orderData.orderNumber}
Order Date: ${new Date(orderData.orderDate).toLocaleString()}

CUSTOMER INFORMATION:
────────────────────────────────────────────────────────────
Name: ${orderData.firstName} ${orderData.lastName}
Email: ${orderData.email}
Phone: ${orderData.phone}

SHIPPING ADDRESS:
────────────────────────────────────────────────────────────
${orderData.address}
${orderData.city}, ${orderData.state} ${orderData.zip}
${orderData.country}

ORDER ITEMS:
────────────────────────────────────────────────────────────
${orderData.cart.map(item => 
    `${item.name}
    Quantity: ${item.quantity} × ${formatPrice(item.price)} = ${formatPrice(item.price * item.quantity)}`
).join('\n')}

ORDER SUMMARY:
────────────────────────────────────────────────────────────
Subtotal:          ${formatPrice(orderData.totals.subtotal)}
Shipping:          ${orderData.totals.shipping === 0 ? 'FREE' : formatPrice(orderData.totals.shipping)}
Tax (10%):         ${formatPrice(orderData.totals.tax)}
────────────────────────────────────────────────────────────
TOTAL PAID:        ${formatPrice(orderData.totals.total)}

PAYMENT METHOD: ${orderData.paymentMethod.toUpperCase()}

╔═══════════════════════════════════════════════════════════╗
        Thank you for shopping with Éclat Essence!
              Luxury fragrances, timeless memories
╚═══════════════════════════════════════════════════════════╝
    `;
    
    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Eclat_Essence_Receipt_${orderData.orderNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Cart icon click
document.querySelector('.cart-icon')?.addEventListener('click', () => {
    window.location.href = 'cart.html';
});

// Animations
gsap.from('.checkmark-circle', {
    scale: 0,
    opacity: 0,
    duration: 0.6,
    ease: 'back.out(2)',
    delay: 0.2
});

gsap.from('.success-title', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 0.5,
    ease: 'power2.out'
});

gsap.from('.success-message', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    delay: 0.7,
    ease: 'power2.out'
});

gsap.from('.receipt-card', {
    opacity: 0,
    x: -50,
    duration: 0.8,
    delay: 0.9,
    ease: 'power2.out'
});

gsap.from('.next-steps', {
    opacity: 0,
    x: 50,
    duration: 0.8,
    delay: 0.9,
    ease: 'power2.out'
});

gsap.from('.step-item', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    stagger: 0.15,
    delay: 1.2,
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

// Initialize music player on receipt page
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