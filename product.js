// ==================== PRODUCTS PAGE FUNCTIONALITY ====================

function initProductsPage() {
    // Convert USD prices to INR
    convertPricesToINR();
    
    // Animate page elements
    animateProductsPage();
    
    // Setup filters and sorting
    setupFilters();
    setupSorting();
    
    // Setup add to cart buttons
    setupAddToCart();
    
    // Setup product card interactions
    setupProductCardInteractions();
}

// ==================== PRICE CONVERSION ====================
function convertPricesToINR() {
    document.querySelectorAll('.price').forEach(priceElement => {
        const usdPrice = parseFloat(priceElement.textContent.replace('$', ''));
        priceElement.textContent = Utils.formatPrice(usdPrice);
    });
}

// ==================== ANIMATIONS ====================
function animateProductsPage() {
    gsap.from('.hero-title', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2
    });

    gsap.from('.hero-subtitle', {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power2.out',
        delay: 0.4
    });

    gsap.fromTo('.filter-btn', 
        { opacity: 0, y: 20 },
        {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out',
            delay: 0.6
        }
    );

    gsap.fromTo('.sort-select', 
        { opacity: 0, x: 20 },
        {
            opacity: 1,
            x: 0,
            duration: 0.5,
            ease: 'power2.out',
            delay: 0.8
        }
    );

    gsap.utils.toArray('.product-card').forEach((card, index) => {
        gsap.from(card, {
            opacity: 0,
            y: 50,
            scale: 0.9,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                toggleActions: 'play none none none'
            }
        });
    });
}

// ==================== FILTER FUNCTIONALITY ====================
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const category = button.dataset.category;
            
            productCards.forEach((card, index) => {
                const cardCategory = card.dataset.category;
                
                if (category === 'all' || cardCategory === category) {
                    gsap.to(card, {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        duration: 0.5,
                        delay: index * 0.05,
                        ease: 'back.out(1.7)',
                        display: 'block'
                    });
                } else {
                    gsap.to(card, {
                        opacity: 0,
                        scale: 0.8,
                        y: 20,
                        duration: 0.3,
                        ease: 'power2.in',
                        onComplete: () => {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        });
    });
}

// ==================== SORTING FUNCTIONALITY ====================
function setupSorting() {
    const sortSelect = document.getElementById('sortSelect');
    const productsGrid = document.getElementById('productsGrid');
    const productCards = document.querySelectorAll('.product-card');

    if (!sortSelect || !productsGrid) return;

    sortSelect.addEventListener('change', () => {
        const sortValue = sortSelect.value;
        const productsArray = Array.from(productCards);
        
        productsArray.sort((a, b) => {
            switch(sortValue) {
                case 'price-low':
                    return parseInt(a.dataset.price) - parseInt(b.dataset.price);
                case 'price-high':
                    return parseInt(b.dataset.price) - parseInt(a.dataset.price);
                case 'name':
                    return a.dataset.name.localeCompare(b.dataset.name);
                default:
                    return 0;
            }
        });
        
        gsap.to(productCards, {
            opacity: 0,
            y: 20,
            duration: 0.3,
            stagger: 0.03,
            onComplete: () => {
                productsArray.forEach(card => {
                    productsGrid.appendChild(card);
                });
                
                gsap.to(productCards, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.05,
                    ease: 'back.out(1.7)'
                });
            }
        });
    });
}

// ==================== ADD TO CART ====================
function setupAddToCart() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const productId = this.dataset.id;
            const productName = this.dataset.name;
            const productPrice = parseFloat(this.dataset.price); // USD price
            
            const productCard = this.closest('.product-card');
            const productImg = productCard.querySelector('.product-image img').src;
            const productNotes = productCard.querySelector('.product-notes').textContent;
            
            const added = Cart.add({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImg,
                notes: productNotes
            });
            
            if (added) {
                gsap.to(button, {
                    scale: 0.9,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        const cartIcon = document.querySelector('.cart-icon');
                        if (cartIcon) {
                            gsap.to(cartIcon, {
                                scale: 1.4,
                                duration: 0.3,
                                yoyo: true,
                                repeat: 1,
                                ease: 'elastic.out(1, 0.3)'
                            });
                        }
                    }
                });
                
                Utils.showNotification(`${productName} added to cart!`);
                
                const originalText = button.textContent;
                button.textContent = 'Added!';
                button.style.background = 'var(--gold)';
                button.style.color = 'var(--bg-dark)';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = 'transparent';
                    button.style.color = 'var(--text)';
                }, 1500);
            }
        });
    });
}

// ==================== PRODUCT CARD INTERACTIONS ====================
function setupProductCardInteractions() {
    const productCards = document.querySelectorAll('.product-card');
    
    // 3D Tilt Effect
    productCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return;
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            gsap.to(card, {
                rotationX: rotateX,
                rotationY: rotateY,
                duration: 0.4,
                ease: 'power2.out',
                transformPerspective: 1000,
                transformStyle: 'preserve-3d'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationX: 0,
                rotationY: 0,
                duration: 0.6,
                ease: 'power2.out'
            });
        });
    });
}