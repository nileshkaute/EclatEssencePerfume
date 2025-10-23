// ==================== CONFIGURATION ====================
const CONFIG = {
    currency: {
        symbol: '₹',
        conversionRate: 83, // 1 USD = 83 INR (adjust as needed)
    },
    music: {
        autoPlay: true,
        volume: 0.5,
    },
    animations: {
        staggerDelay: 0.1,
        duration: 0.6,
    }
};

// ==================== UTILITY FUNCTIONS ====================
const Utils = {
    formatPrice(usdPrice) {
        const inrPrice = usdPrice * CONFIG.currency.conversionRate;
        return `${CONFIG.currency.symbol}${Math.round(inrPrice).toLocaleString('en-IN')}`;
    },
    
    parsePrice(priceString) {
        return parseFloat(priceString.replace(/[^0-9.]/g, ''));
    },
    
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            background: linear-gradient(135deg, var(--gold), #c9a745);
            color: var(--bg-dark);
            padding: 1rem 1.8rem;
            border-radius: 10px;
            font-weight: 600;
            z-index: 9999;
            box-shadow: 0 15px 40px rgba(212, 175, 55, 0.5);
            font-size: 0.95rem;
        `;
        
        document.body.appendChild(notification);
        
        gsap.from(notification, {
            opacity: 0,
            x: 100,
            duration: 0.5,
            ease: 'back.out(2)'
        });
        
        setTimeout(() => {
            gsap.to(notification, {
                opacity: 0,
                x: 100,
                duration: 0.5,
                ease: 'power2.in',
                onComplete: () => notification.remove()
            });
        }, 3000);
    }
};

// ==================== MUSIC PLAYER MODULE ====================
const MusicPlayer = {
    player: null,
    audio: null,
    playPauseBtn: null,
    volumeBtn: null,
    isPlaying: false,
    isMuted: false,
    
    init() {
        this.player = document.getElementById('musicPlayer');
        this.audio = document.getElementById('backgroundMusic');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.volumeBtn = document.getElementById('volumeBtn');
        
        if (!this.audio) return;
        
        this.audio.volume = CONFIG.music.volume;
        this.setupEventListeners();
        this.restoreState();
    },
    
    setupEventListeners() {
        if (this.playPauseBtn) {
            this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        }
        
        if (this.volumeBtn) {
            this.volumeBtn.addEventListener('click', () => this.toggleVolume());
        }
        
        if (this.audio) {
            this.audio.addEventListener('timeupdate', () => {
                if (this.isPlaying) {
                    sessionStorage.setItem('musicCurrentTime', this.audio.currentTime);
                }
            });
        }
        
        window.addEventListener('beforeunload', () => this.saveState());
    },
    
    play() {
        if (!this.audio) return;
        
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updatePlayButton();
        }).catch(error => {
            console.log('Audio play failed:', error);
        });
    },
    
    pause() {
        if (!this.audio) return;
        
        this.audio.pause();
        this.isPlaying = false;
        this.updatePlayButton();
    },
    
    togglePlayPause() {
        this.isPlaying ? this.pause() : this.play();
    },
    
    toggleVolume() {
        if (!this.audio) return;
        
        this.isMuted = !this.isMuted;
        this.audio.muted = this.isMuted;
        this.updateVolumeButton();
    },
    
    updatePlayButton() {
        if (!this.playPauseBtn) return;
        
        const icon = this.playPauseBtn.querySelector('i');
        if (icon) {
            icon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
        }
    },
    
    updateVolumeButton() {
        if (!this.volumeBtn) return;
        
        const icon = this.volumeBtn.querySelector('i');
        if (icon) {
            icon.className = this.isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
        }
    },
    
    show() {
        if (this.player) {
            this.player.classList.add('active');
            if (CONFIG.music.autoPlay) {
                setTimeout(() => this.play(), 500);
            }
        }
    },
    
    hide() {
        if (this.player) {
            this.player.classList.remove('active');
            this.pause();
        }
    },
    
    saveState() {
        if (this.audio && this.isPlaying) {
            sessionStorage.setItem('musicCurrentTime', this.audio.currentTime);
            sessionStorage.setItem('musicWasPlaying', 'true');
        }
    },
    
    restoreState() {
        const savedTime = sessionStorage.getItem('musicCurrentTime');
        if (savedTime && this.audio) {
            this.audio.currentTime = parseFloat(savedTime);
        }
    }
};

// ==================== AUTHENTICATION MODULE ====================
const Auth = {
    init() {
        this.setupModalControls();
        this.setupForms();
        this.updateUI();
    },
    
    isLoggedIn() {
        const user = localStorage.getItem('eclatUser');
        if (!user || user === 'null' || user === 'undefined' || user === '') {
            return false;
        }
        
        try {
            const userObj = JSON.parse(user);
            return !!(userObj && userObj.email);
        } catch (e) {
            console.error('Error parsing user data:', e);
            localStorage.removeItem('eclatUser');
            return false;
        }
    },
    
    getCurrentUser() {
        const user = localStorage.getItem('eclatUser');
        if (!user || user === 'null' || user === 'undefined') return null;
        
        try {
            return JSON.parse(user);
        } catch (e) {
            console.error('Error parsing user data:', e);
            localStorage.removeItem('eclatUser');
            return null;
        }
    },
    
    login(email, password) {
        const users = JSON.parse(localStorage.getItem('eclatUsers') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            localStorage.setItem('eclatUser', JSON.stringify({ 
                name: user.name, 
                email: user.email 
            }));
            return { success: true, user };
        }
        
        return { success: false, message: 'Invalid email or password' };
    },
    
    signup(name, email, password) {
        const users = JSON.parse(localStorage.getItem('eclatUsers') || '[]');
        
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'Email already registered' };
        }
        
        users.push({ name, email, password });
        localStorage.setItem('eclatUsers', JSON.stringify(users));
        
        return { success: true };
    },
    
    logout() {
        localStorage.removeItem('eclatUser');
        sessionStorage.removeItem('musicCurrentTime');
        sessionStorage.removeItem('musicWasPlaying');
        
        // Clear cart when logging out
        Cart.clear(); // Add this line to clear the cart
        
        this.updateUI();
        MusicPlayer.hide();
        Utils.showNotification('Logged out successfully!');
    },
    
     updateUI() {
        const authButtons = document.getElementById('authButtons');
        const userInfo = document.getElementById('userInfo');
        const userName = document.getElementById('userName');
        const cartCount = document.querySelector('.cart-count');
        
        if (this.isLoggedIn()) {
            const user = this.getCurrentUser();
            if (authButtons) authButtons.style.display = 'none';
            if (userInfo) {
                userInfo.style.display = 'flex';
                if (userName) userName.textContent = `Hello, ${user.name}`;
            }
            // Show cart count only when logged in
            if (cartCount) {
                const total = Cart.items.reduce((sum, item) => sum + item.quantity, 0);
                cartCount.textContent = total;
                cartCount.style.display = total > 0 ? 'block' : 'none';
            }
            MusicPlayer.show();
        } else {
            if (authButtons) authButtons.style.display = 'flex';
            if (userInfo) userInfo.style.display = 'none';
            // Hide cart count when logged out
            if (cartCount) {
                cartCount.style.display = 'none';
            }
            MusicPlayer.hide();
        }
    },
    
    setupModalControls() {
        const loginModal = document.getElementById('loginModal');
        const signupModal = document.getElementById('signupModal');
        
        // Open modals
        document.getElementById('loginBtn')?.addEventListener('click', () => {
            this.showModal(loginModal);
        });
        
        document.getElementById('signupBtn')?.addEventListener('click', () => {
            this.showModal(signupModal);
        });
        
        // Close modals
        document.getElementById('closeLogin')?.addEventListener('click', () => {
            loginModal?.classList.remove('active');
        });
        
        document.getElementById('closeSignup')?.addEventListener('click', () => {
            signupModal?.classList.remove('active');
        });
        
        // Switch between modals
        document.getElementById('switchToSignup')?.addEventListener('click', () => {
            loginModal?.classList.remove('active');
            this.showModal(signupModal);
        });
        
        document.getElementById('switchToLogin')?.addEventListener('click', () => {
            signupModal?.classList.remove('active');
            this.showModal(loginModal);
        });
        
        // Close on outside click
        [loginModal, signupModal].forEach(modal => {
            modal?.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.remove('active');
            });
        });
    },
    
    showModal(modal) {
        if (!modal) return;
        modal.classList.add('active');
        gsap.from('.auth-container', {
            scale: 0.8,
            opacity: 0,
            duration: 0.4,
            ease: 'back.out(1.7)'
        });
    },
    
    setupForms() {
        // Login form
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            const result = this.login(email, password);
            
            if (result.success) {
                document.getElementById('loginModal').classList.remove('active');
                this.updateUI();
                Utils.showNotification('Welcome back! Login successful.');
            } else {
                Utils.showNotification(result.message, 'error');
            }
        });
        
        // Signup form
        document.getElementById('signupForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            
            const result = this.signup(name, email, password);
            
            if (result.success) {
                document.getElementById('signupModal').classList.remove('active');
                Utils.showNotification('Account created! Please login to continue.');
                
                setTimeout(() => {
                    const loginModal = document.getElementById('loginModal');
                    this.showModal(loginModal);
                    document.getElementById('loginEmail').value = email;
                }, 1000);
            } else {
                Utils.showNotification(result.message, 'error');
            }
        });
        
        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            this.logout();
        });
    }
};

// ==================== CART MODULE ====================
const Cart = {
    items: [],
    
    init() {
        this.load();
        this.updateCount();
        this.setupCartLink();
        
        // Only show cart count if user is logged in
        if (!Auth.isLoggedIn()) {
            this.hideCount();
        }
    },
    
    load() {
        this.items = JSON.parse(localStorage.getItem('eclatCart')) || [];
    },
    
    save() {
        localStorage.setItem('eclatCart', JSON.stringify(this.items));
    },
    
    // Add this new function to clear cart
    clear() {
        this.items = [];
        this.save();
        this.updateCount();
    },
    
    // Add this new function to hide count
    hideCount() {
        const countElement = document.querySelector('.cart-count');
        if (countElement) {
            countElement.style.display = 'none';
        }
    },
    
    add(product) {
        if (!Auth.isLoggedIn()) {
            Utils.showNotification('Please login to add items to cart!');
            const loginModal = document.getElementById('loginModal');
            Auth.showModal(loginModal);
            return false;
        }
        
        const existing = this.items.find(item => item.id === product.id);
        
        if (existing) {
            existing.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }
        
        this.save();
        this.updateCount();
        return true;
    },
    
    updateCount() {
        const countElement = document.querySelector('.cart-count');
        if (!countElement) return;
        
        const total = this.items.reduce((sum, item) => sum + item.quantity, 0);
        countElement.textContent = total;
        
        // Only show count if user is logged in AND there are items
        if (Auth.isLoggedIn() && total > 0) {
            countElement.style.display = 'block';
        } else {
            countElement.style.display = 'none';
        }
    },
    
    setupCartLink() {
        const cartLink = document.getElementById('cartLink');
        if (!cartLink) return;
        
        cartLink.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (Auth.isLoggedIn()) {
                window.location.href = 'cart.html';
            } else {
                Utils.showNotification('Please login to view your cart!');
                const loginModal = document.getElementById('loginModal');
                Auth.showModal(loginModal);
            }
        });
    }
};

// ==================== NAVIGATION MODULE ====================
const Navigation = {
    init() {
        this.setupStickyNav();
        this.setupActiveLinks();
        this.setupSmoothScroll();
        this.animateNavbar();
    },
    
    setupStickyNav() {
        window.addEventListener('scroll', () => {
            const nav = document.querySelector('.navbar');
            if (!nav) return;
            
            if (window.scrollY > 100) {
                nav.classList.add('sticky');
            } else {
                nav.classList.remove('sticky');
            }
        });
    },
    
    setupActiveLinks() {
        const updateActive = () => {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-links a');
            
            let currentSection = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                const sectionId = section.getAttribute('id');
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    currentSection = sectionId;
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                
                if (href === `#${currentSection}` || 
                    (currentSection === '' && href === 'index.html')) {
                    link.classList.add('active');
                }
            });
        };
        
        window.addEventListener('scroll', updateActive);
        window.addEventListener('load', updateActive);
    },
    
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelectorAll(this.getAttribute('href'));
                
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        });
    },
    
    animateNavbar() {
        window.addEventListener('load', () => {
            gsap.fromTo('.navbar', 
                { opacity: 0, y: -30 },
                { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
            );
        });
    }
};

// ==================== PRODUCT QUICK VIEW MODULE ====================
const QuickView = {
    modal: null,
    
    init() {
        this.createModal();
        this.setupTriggers();
    },
    
    createModal() {
        const modal = document.createElement('div');
        modal.id = 'quickViewModal';
        modal.className = 'quick-view-modal';
        modal.innerHTML = `
            <div class="quick-view-overlay"></div>
            <div class="quick-view-content">
                <button class="quick-view-close">&times;</button>
                <div class="quick-view-body">
                    <div class="quick-view-image">
                        <img src="" alt="Product">
                    </div>
                    <div class="quick-view-details">
                        <div class="quick-view-category"></div>
                        <h2 class="quick-view-name"></h2>
                        <p class="quick-view-notes"></p>
                        <p class="quick-view-description"></p>
                        <div class="quick-view-rating"></div>
                        <div class="quick-view-price"></div>
                        <button class="quick-view-add-cart">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.modal = modal;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .quick-view-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
            }
            
            .quick-view-modal.active {
                display: block;
            }
            
            .quick-view-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
            }
            
            .quick-view-content {
                position: relative;
                max-width: 900px;
                margin: 5% auto;
                background: var(--charcoal);
                border: 2px solid var(--gold);
                border-radius: 20px;
                padding: 2rem;
                z-index: 10001;
            }
            
            .quick-view-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                color: var(--gold);
                font-size: 2rem;
                cursor: pointer;
                transition: transform 0.3s;
                z-index: 10002;
            }
            
            .quick-view-close:hover {
                transform: rotate(90deg);
            }
            
            .quick-view-body {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
            }
            
            .quick-view-image {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
                background: var(--muted);
                border-radius: 12px;
            }
            
            .quick-view-image img {
                max-width: 100%;
                max-height: 400px;
                object-fit: contain;
                filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.4));
            }
            
            .quick-view-details {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            .quick-view-category {
                color: var(--gold);
                font-size: 0.9rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .quick-view-name {
                font-family: 'Cinzel', serif;
                font-size: 2rem;
                color: var(--gold);
                margin: 0;
            }
            
            .quick-view-notes {
                color: #aaa;
                font-style: italic;
                font-size: 0.95rem;
            }
            
            .quick-view-description {
                color: #ccc;
                line-height: 1.8;
            }
            
            .quick-view-rating {
                color: var(--gold);
                font-size: 1.1rem;
            }
            
            .quick-view-price {
                font-family: 'Cinzel', serif;
                font-size: 2rem;
                color: var(--gold);
                font-weight: 700;
            }
            
            .quick-view-add-cart {
                background: var(--gold);
                border: none;
                color: var(--bg-dark);
                padding: 1rem 2rem;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
                margin-top: 1rem;
            }
            
            .quick-view-add-cart:hover {
                background: #c9a745;
                transform: translateY(-2px);
                box-shadow: 0 10px 30px rgba(212, 175, 55, 0.4);
            }
            
            @media (max-width: 768px) {
                .quick-view-content {
                    margin: 10% 5%;
                    padding: 1.5rem;
                }
                
                .quick-view-body {
                    grid-template-columns: 1fr;
                }
                
                .quick-view-image {
                    padding: 1rem;
                }
                
                .quick-view-image img {
                    max-height: 250px;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Setup close handlers
        modal.querySelector('.quick-view-close').addEventListener('click', () => {
            this.close();
        });
        
        modal.querySelector('.quick-view-overlay').addEventListener('click', () => {
            this.close();
        });
    },
    
    setupTriggers() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-view')) {
                e.stopPropagation();
                const productCard = e.target.closest('.product-card');
                if (productCard) {
                    this.show(productCard);
                }
            }
        });
    },
    
    show(productCard) {
        const data = {
            image: productCard.querySelector('.product-image img')?.src || '',
            category: productCard.querySelector('.product-category')?.textContent || '',
            name: productCard.querySelector('.product-name')?.textContent || '',
            notes: productCard.querySelector('.product-notes')?.textContent || '',
            description: productCard.querySelector('.product-description')?.textContent || '',
            rating: productCard.querySelector('.rating')?.innerHTML || '',
            price: productCard.querySelector('.price')?.textContent || '',
            id: productCard.querySelector('.add-to-cart')?.dataset.id || '',
            usdPrice: productCard.querySelector('.add-to-cart')?.dataset.price || ''
        };
        
        this.modal.querySelector('.quick-view-image img').src = data.image;
        this.modal.querySelector('.quick-view-category').textContent = data.category;
        this.modal.querySelector('.quick-view-name').textContent = data.name;
        this.modal.querySelector('.quick-view-notes').textContent = data.notes;
        this.modal.querySelector('.quick-view-description').textContent = data.description;
        this.modal.querySelector('.quick-view-rating').innerHTML = data.rating;
        this.modal.querySelector('.quick-view-price').textContent = data.price;
        
        const addButton = this.modal.querySelector('.quick-view-add-cart');
        addButton.onclick = () => {
            const added = Cart.add({
                id: data.id,
                name: data.name,
                price: Utils.parsePrice(data.usdPrice),
                image: data.image,
                notes: data.notes
            });
            
            if (added) {
                Utils.showNotification(`${data.name} added to cart!`);
                this.close();
            }
        };
        
        this.modal.classList.add('active');
        
        gsap.from('.quick-view-content', {
            scale: 0.8,
            opacity: 0,
            duration: 0.4,
            ease: 'back.out(1.7)'
        });
    },
    
    close() {
        gsap.to('.quick-view-content', {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                this.modal.classList.remove('active');
            }
        });
    }
};

// ==================== INITIALIZE APP ====================
document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Initialize modules
    MusicPlayer.init();
    Auth.init();
    Cart.init();
    Navigation.init();
    QuickView.init();
    
    // Initialize page-specific functionality
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (currentPage === 'index.html' || currentPage === '') {
        initHomePage();
    } else if (currentPage === 'products.html') {
        initProductsPage();
    }
    
    // Protected page check
    if (currentPage === 'products.html' && !Auth.isLoggedIn()) {
        Utils.showNotification('Please login to access products page!');
        window.location.href = 'index.html';
    }
});

// Export for use in other files
window.EclatEssence = {
    Utils,
    MusicPlayer,
    Auth,
    Cart,
    Navigation,
    QuickView
};