// ==================== HAMBURGER MENU FUNCTIONALITY ====================
const HamburgerMenu = {
    init() {
        this.createHamburger();
        this.setupEventListeners();
    },
    
    createHamburger() {
        // Check if hamburger already exists
        if (document.querySelector('.hamburger-menu')) return;
        
        const hamburger = document.createElement('button');
        hamburger.className = 'hamburger-menu';
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.innerHTML = `
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
        `;
        
        // Insert hamburger into navbar
        const navContent = document.querySelector('.nav-content');
        if (navContent) {
            navContent.appendChild(hamburger);
        }
    },
    
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const hamburger = e.target.closest('.hamburger-menu');
            const navLinks = document.querySelector('.nav-links');
            
            if (hamburger) {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMenu();
                return;
            }
            
            // Close menu when clicking on nav links
            if (navLinks && navLinks.classList.contains('active')) {
                const navLink = e.target.closest('.nav-links a');
                if (navLink) {
                    this.closeMenu();
                    return;
                }
            }
            
            // Close menu when clicking outside
            if (navLinks && navLinks.classList.contains('active') && 
                !e.target.closest('.nav-links') && 
                !e.target.closest('.hamburger-menu')) {
                this.closeMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMenu();
            }
        });
        
        // Handle window resize - Close menu when going to desktop view
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 912) {
                    this.closeMenu();
                    // Hide hamburger on desktop
                    const hamburger = document.querySelector('.hamburger-menu');
                    if (hamburger) {
                        hamburger.style.display = 'none';
                    }
                } else {
                    // Show hamburger on mobile/tablet
                    const hamburger = document.querySelector('.hamburger-menu');
                    if (hamburger) {
                        hamburger.style.display = 'flex';
                    }
                }
            }, 100);
        });
    },
    
    toggleMenu() {
        const hamburger = document.querySelector('.hamburger-menu');
        const navLinks = document.querySelector('.nav-links');
        const body = document.body;
        
        if (hamburger && navLinks) {
            const isOpening = !hamburger.classList.contains('active');
            
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Toggle body scroll and class
            if (isOpening) {
                body.style.overflow = 'hidden';
                body.classList.add('menu-open');
                hamburger.setAttribute('aria-expanded', 'true');
            } else {
                body.style.overflow = '';
                body.classList.remove('menu-open');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        }
    },
    
    closeMenu() {
        const hamburger = document.querySelector('.hamburger-menu');
        const navLinks = document.querySelector('.nav-links');
        const body = document.body;
        
        if (hamburger && navLinks) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            body.style.overflow = '';
            body.classList.remove('menu-open');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    }
};

// ==================== ENHANCE EXISTING NAVIGATION ====================
const EnhancedNavigation = {
    init() {
        this.setupMobileNav();
        this.enhanceCurrentPage();
        this.setupSmoothScroll();
    },
    
    setupMobileNav() {
        // Ensure nav has proper structure for mobile
        const desktopNav = document.querySelector('.nav-links');
        if (desktopNav) {
            desktopNav.classList.add('mobile-ready');
        }
    },
    
    enhanceCurrentPage() {
        // Highlight current page in navigation
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-links a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || 
                (currentPage === '' && href === 'index.html') ||
                (currentPage.includes(href.replace('.html', '')) && href !== '#' && href !== '')) {
                link.classList.add('active');
            }
        });
    },
    
    setupSmoothScroll() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Close menu after clicking anchor link
                    HamburgerMenu.closeMenu();
                }
            });
        });
    }
};

// ==================== INITIALIZE ON DOM LOAD ====================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize hamburger menu
    HamburgerMenu.init();
    
    // Enhance navigation
    EnhancedNavigation.init();
    
    // Check initial screen size and set hamburger visibility
    const hamburger = document.querySelector('.hamburger-menu');
    if (hamburger) {
        if (window.innerWidth > 912) {
            hamburger.style.display = 'none';
        } else {
            hamburger.style.display = 'flex';
        }
    }
    
    console.log('Hamburger menu initialized for all tablets');
});

// Export for use in other files
window.HamburgerMenu = HamburgerMenu;
window.EnhancedNavigation = EnhancedNavigation;