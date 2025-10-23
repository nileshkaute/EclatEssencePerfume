// ==================== RECEIPT PAGE FUNCTIONALITY ====================

// Get order data from memory
const orderData = JSON.parse(localStorage.getItem('eclatOrder'));

// Format price to INR
function formatPrice(usdPrice) {
    const inrPrice = usdPrice * 83;
    return `₹${Math.round(inrPrice).toLocaleString('en-IN')}`;
}

// Update cart count display
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        const cart = JSON.parse(localStorage.getItem('eclatCart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

// Display receipt data
function displayReceipt() {
    if (!orderData) return;
    
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
        'upi': 'UPI Payment',
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

// Generate PDF receipt - COMPACT VERSION
function downloadReceipt() {
    const printWindow = window.open('', '_blank');
    const orderDate = new Date(orderData.orderDate);
    const formattedDate = orderDate.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const paymentMethods = {
        'card': 'Credit/Debit Card',
        'paypal': 'PayPal',
        'upi': 'UPI Payment',
        'cod': 'Cash on Delivery'
    };
    
    const totals = orderData.totals;
    
    const receiptHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Receipt - ${orderData.orderNumber}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; padding: 15px; background: #fff; color: #333; font-size: 12px; }
        .receipt-container { max-width: 700px; margin: 0 auto; border: 1px solid #d4af37; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #d4af37; padding-bottom: 10px; margin-bottom: 15px; }
        .company-name { font-size: 20px; font-weight: bold; color: #000; margin-bottom: 3px; }
        .company-name span { color: #d4af37; }
        .tagline { font-size: 10px; color: #666; font-style: italic; }
        .receipt-title { font-size: 16px; font-weight: bold; color: #d4af37; text-align: center; margin: 10px 0; }
        .info-section { margin: 10px 0; }
        .info-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #eee; font-size: 11px; }
        .info-label { font-weight: bold; color: #666; }
        .info-value { color: #000; }
        .section-title { font-size: 13px; font-weight: bold; color: #d4af37; margin: 15px 0 8px; padding-bottom: 4px; border-bottom: 1px solid #d4af37; }
        .address-block { background: #f9f9f9; padding: 8px; border-left: 2px solid #d4af37; margin: 5px 0; font-size: 11px; }
        .address-block p { margin: 3px 0; line-height: 1.4; }
        .items-table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 11px; }
        .items-table th { background: #d4af37; color: #fff; padding: 6px; text-align: left; font-weight: bold; }
        .items-table td { padding: 6px; border-bottom: 1px solid #ddd; }
        .summary-table { width: 300px; margin-left: auto; margin-top: 15px; font-size: 11px; }
        .summary-row { display: flex; justify-content: space-between; padding: 4px 0; }
        .summary-label { color: #666; }
        .summary-value { font-weight: bold; color: #000; }
        .summary-divider { height: 1px; background: #d4af37; margin: 8px 0; }
        .summary-total { font-size: 14px; color: #d4af37; font-weight: bold; }
        .footer { text-align: center; margin-top: 20px; padding-top: 10px; border-top: 1px solid #d4af37; color: #666; font-size: 10px; }
        .thank-you { font-size: 13px; font-weight: bold; color: #d4af37; margin-bottom: 5px; }
        @media print { 
            body { padding: 10px; margin: 0; }
            .receipt-container { border: 1px solid #000; page-break-inside: avoid; }
            @page { margin: 0.5cm; size: A4; }
        }
    </style>
</head>
<body>
    <div class="receipt-container">
        <div class="header">
            <div class="company-name">Éclat <span>Essence</span></div>
            <div class="tagline">Luxury fragrances, timeless memories</div>
        </div>
        <div class="receipt-title">ORDER RECEIPT</div>
        <div class="info-section">
            <div class="info-row"><span class="info-label">Order Number:</span><span class="info-value">${orderData.orderNumber}</span></div>
            <div class="info-row"><span class="info-label">Order Date:</span><span class="info-value">${formattedDate}</span></div>
            <div class="info-row"><span class="info-label">Payment Method:</span><span class="info-value">${paymentMethods[orderData.paymentMethod]}</span></div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 10px 0;">
            <div>
                <div class="section-title">Customer Information</div>
                <div class="address-block">
                    <p><strong>${orderData.firstName} ${orderData.lastName}</strong></p>
                    <p>Email: ${orderData.email}</p>
                    <p>Phone: ${orderData.phone}</p>
                </div>
            </div>
            <div>
                <div class="section-title">Shipping Address</div>
                <div class="address-block">
                    <p>${orderData.address}</p>
                    <p>${orderData.city}, ${orderData.state}</p>
                    <p>${orderData.zip}, ${orderData.country}</p>
                </div>
            </div>
        </div>
        
        <div class="section-title">Order Items</div>
        <table class="items-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${orderData.cart.map(item => `
                    <tr>
                        <td><strong>${item.name}</strong></td>
                        <td>${item.quantity}</td>
                        <td>${formatPrice(item.price)}</td>
                        <td><strong>${formatPrice(item.price * item.quantity)}</strong></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        <div class="summary-table">
            <div class="summary-row"><span class="summary-label">Subtotal:</span><span class="summary-value">${formatPrice(totals.subtotal)}</span></div>
            <div class="summary-row"><span class="summary-label">Shipping:</span><span class="summary-value">${totals.shipping === 0 ? 'FREE' : formatPrice(totals.shipping)}</span></div>
            <div class="summary-row"><span class="summary-label">Tax (10%):</span><span class="summary-value">${formatPrice(totals.tax)}</span></div>
            <div class="summary-divider"></div>
            <div class="summary-row summary-total"><span>TOTAL PAID:</span><span>${formatPrice(totals.total)}</span></div>
        </div>
        
        <div class="footer">
            <p class="thank-you">Thank You for Your Purchase!</p>
            <p>For any queries, contact us at support@eclatessence.com</p>
            <p>© 2025 Éclat Essence. All Rights Reserved.</p>
        </div>
    </div>
    <script>
        window.onload = function() { 
            setTimeout(function() { 
                window.print(); 
            }, 300); 
        };
        window.onafterprint = function() { 
            setTimeout(function() { 
                window.close(); 
            }, 100); 
        };
    </script>
</body>
</html>`;
    
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
}

// Print receipt - SAME STRUCTURE AS DOWNLOAD
function printReceipt() {
    const printWindow = window.open('', '_blank');
    const orderDate = new Date(orderData.orderDate);
    const formattedDate = orderDate.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const paymentMethods = {
        'card': 'Credit/Debit Card',
        'paypal': 'PayPal',
        'upi': 'UPI Payment',
        'cod': 'Cash on Delivery'
    };
    
    const totals = orderData.totals;
    
    const receiptHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Receipt - ${orderData.orderNumber}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; padding: 15px; background: #fff; color: #333; font-size: 12px; }
        .receipt-container { max-width: 700px; margin: 0 auto; border: 1px solid #d4af37; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #d4af37; padding-bottom: 10px; margin-bottom: 15px; }
        .company-name { font-size: 20px; font-weight: bold; color: #000; margin-bottom: 3px; }
        .company-name span { color: #d4af37; }
        .tagline { font-size: 10px; color: #666; font-style: italic; }
        .receipt-title { font-size: 16px; font-weight: bold; color: #d4af37; text-align: center; margin: 10px 0; }
        .info-section { margin: 10px 0; }
        .info-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #eee; font-size: 11px; }
        .info-label { font-weight: bold; color: #666; }
        .info-value { color: #000; }
        .section-title { font-size: 13px; font-weight: bold; color: #d4af37; margin: 15px 0 8px; padding-bottom: 4px; border-bottom: 1px solid #d4af37; }
        .address-block { background: #f9f9f9; padding: 8px; border-left: 2px solid #d4af37; margin: 5px 0; font-size: 11px; }
        .address-block p { margin: 3px 0; line-height: 1.4; }
        .items-table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 11px; }
        .items-table th { background: #d4af37; color: #fff; padding: 6px; text-align: left; font-weight: bold; }
        .items-table td { padding: 6px; border-bottom: 1px solid #ddd; }
        .summary-table { width: 300px; margin-left: auto; margin-top: 15px; font-size: 11px; }
        .summary-row { display: flex; justify-content: space-between; padding: 4px 0; }
        .summary-label { color: #666; }
        .summary-value { font-weight: bold; color: #000; }
        .summary-divider { height: 1px; background: #d4af37; margin: 8px 0; }
        .summary-total { font-size: 14px; color: #d4af37; font-weight: bold; }
        .footer { text-align: center; margin-top: 20px; padding-top: 10px; border-top: 1px solid #d4af37; color: #666; font-size: 10px; }
        .thank-you { font-size: 13px; font-weight: bold; color: #d4af37; margin-bottom: 5px; }
        @media print { 
            body { padding: 10px; margin: 0; }
            .receipt-container { border: 1px solid #000; page-break-inside: avoid; }
            @page { margin: 0.5cm; size: A4; }
        }
    </style>
</head>
<body>
    <div class="receipt-container">
        <div class="header">
            <div class="company-name">Éclat <span>Essence</span></div>
            <div class="tagline">Luxury fragrances, timeless memories</div>
        </div>
        <div class="receipt-title">ORDER RECEIPT</div>
        <div class="info-section">
            <div class="info-row"><span class="info-label">Order Number:</span><span class="info-value">${orderData.orderNumber}</span></div>
            <div class="info-row"><span class="info-label">Order Date:</span><span class="info-value">${formattedDate}</span></div>
            <div class="info-row"><span class="info-label">Payment Method:</span><span class="info-value">${paymentMethods[orderData.paymentMethod]}</span></div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 10px 0;">
            <div>
                <div class="section-title">Customer Information</div>
                <div class="address-block">
                    <p><strong>${orderData.firstName} ${orderData.lastName}</strong></p>
                    <p>Email: ${orderData.email}</p>
                    <p>Phone: ${orderData.phone}</p>
                </div>
            </div>
            <div>
                <div class="section-title">Shipping Address</div>
                <div class="address-block">
                    <p>${orderData.address}</p>
                    <p>${orderData.city}, ${orderData.state}</p>
                    <p>${orderData.zip}, ${orderData.country}</p>
                </div>
            </div>
        </div>
        
        <div class="section-title">Order Items</div>
        <table class="items-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${orderData.cart.map(item => `
                    <tr>
                        <td><strong>${item.name}</strong></td>
                        <td>${item.quantity}</td>
                        <td>${formatPrice(item.price)}</td>
                        <td><strong>${formatPrice(item.price * item.quantity)}</strong></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        <div class="summary-table">
            <div class="summary-row"><span class="summary-label">Subtotal:</span><span class="summary-value">${formatPrice(totals.subtotal)}</span></div>
            <div class="summary-row"><span class="summary-label">Shipping:</span><span class="summary-value">${totals.shipping === 0 ? 'FREE' : formatPrice(totals.shipping)}</span></div>
            <div class="summary-row"><span class="summary-label">Tax (10%):</span><span class="summary-value">${formatPrice(totals.tax)}</span></div>
            <div class="summary-divider"></div>
            <div class="summary-row summary-total"><span>TOTAL PAID:</span><span>${formatPrice(totals.total)}</span></div>
        </div>
        
        <div class="footer">
            <p class="thank-you">Thank You for Your Purchase!</p>
            <p>For any queries, contact us at support@eclatessence.com</p>
            <p>© 2025 Éclat Essence. All Rights Reserved.</p>
        </div>
    </div>
    <script>
        window.onload = function() { 
            setTimeout(function() { 
                window.print(); 
            }, 300); 
        };
        window.onafterprint = function() { 
            setTimeout(function() { 
                window.close(); 
            }, 100); 
        };
    </script>
</body>
</html>`;
    
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
}

// Music player functionality
function initMusicPlayer() {
    const musicPlayer = document.getElementById('musicPlayer');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const volumeBtn = document.getElementById('volumeBtn');
    
    let isPlaying = false;
    let isMuted = false;
    
    const user = localStorage.getItem('eclatUser');
    if (user && user !== 'null' && user !== 'undefined' && musicPlayer) {
        musicPlayer.classList.add('active');
        setTimeout(() => {
            if (backgroundMusic) {
                backgroundMusic.play().then(() => {
                    isPlaying = true;
                    updatePlayButton();
                }).catch(error => console.log('Auto-play prevented'));
            }
        }, 500);
    }
    
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
    
    if (volumeBtn) {
        volumeBtn.addEventListener('click', () => {
            isMuted = !isMuted;
            backgroundMusic.muted = isMuted;
            updateVolumeButton();
        });
    }
    
    function updatePlayButton() {
        const icon = playPauseBtn?.querySelector('i');
        if (icon) icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
    }
    
    function updateVolumeButton() {
        const icon = volumeBtn?.querySelector('i');
        if (icon) icon.className = isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
    }
}

// Initialize animations
function initAnimations() {
    // Success animations
    gsap.from('.checkmark-circle', {
        scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(2)', delay: 0.2
    });
    gsap.from('.success-title', {
        opacity: 0, y: 30, duration: 0.8, delay: 0.5, ease: 'power2.out'
    });
    gsap.from('.success-message', {
        opacity: 0, y: 20, duration: 0.8, delay: 0.7, ease: 'power2.out'
    });
    gsap.from('.receipt-card', {
        opacity: 0, x: -50, duration: 0.8, delay: 0.9, ease: 'power2.out'
    });
    gsap.from('.next-steps', {
        opacity: 0, x: 50, duration: 0.8, delay: 0.9, ease: 'power2.out'
    });
    gsap.from('.step-item', {
        opacity: 0, y: 20, duration: 0.6, stagger: 0.15, delay: 1.2, ease: 'power2.out'
    });

    // Footer animations
    gsap.from(".social-link", {
        opacity: 0, y: 20, stagger: 0.1, duration: 0.8,
        scrollTrigger: { trigger: ".footer-section", start: "top 80%" }
    });

    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(link, { scale: 1.2, rotation: 10, duration: 0.3, ease: 'back.out(2)' });
        });
        link.addEventListener('mouseleave', () => {
            gsap.to(link, { scale: 1, rotation: 0, duration: 0.3, ease: 'power2.out' });
        });
    });

    // Navbar animations
    window.addEventListener("load", () => {
        gsap.fromTo(".navbar", 
            { opacity: 0, y: -30 },
            { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
        );
    });

    // Sticky navbar
    window.addEventListener("scroll", () => {
        const nav = document.querySelector(".navbar");
        nav?.classList.toggle("sticky", window.scrollY > 100);
    });
}

// Event listeners
function initEventListeners() {
    // Cart icon click
    document.querySelector('.cart-icon')?.addEventListener('click', () => {
        window.location.href = 'cart.html';
    });
    
    // Print receipt button
    document.querySelector('.btn-print')?.addEventListener('click', printReceipt);
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    if (!orderData) {
        window.location.href = 'index.html';
        return;
    }
    
    displayReceipt();
    updateCartCount();
    initMusicPlayer();
    initAnimations();
    initEventListeners();
});