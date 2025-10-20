// ==================== HAMBURGER MENU FUNCTIONALITY ====================
const HamburgerMenu = {
    init() {
        this.createHamburger();
        this.setupEventListeners();
    },
    
    createHamburger() {
        // Check if hamburger already exists
        if (document.querySelector('.hamburger-menu')) return;
        
        const hamburger = document.createElement('div');
        hamburger.className = 'hamburger-menu';
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
                this.toggleMenu();
            }
            
            // Close menu when clicking on nav links
            if (navLinks && navLinks.classList.contains('active')) {
                const navLink = e.target.closest('.nav-links a');
                if (navLink) {
                    this.closeMenu();
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
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMenu();
            }
        });
    },
    
    toggleMenu() {
        const hamburger = document.querySelector('.hamburger-menu');
        const navLinks = document.querySelector('.nav-links');
        
        if (hamburger && navLinks) {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Toggle body scroll
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        }
    },
    
    closeMenu() {
        const hamburger = document.querySelector('.hamburger-menu');
        const navLinks = document.querySelector('.nav-links');
        
        if (hamburger && navLinks) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
};

// ==================== ENHANCE EXISTING NAVIGATION ====================
const EnhancedNavigation = {
    init() {
        this.setupMobileNav();
        this.enhanceCurrentPage();
    },
    
    setupMobileNav() {
        // Clone desktop nav for mobile
        const desktopNav = document.querySelector('.nav-links');
        if (!desktopNav) return;
        
        // Ensure nav has proper structure for mobile
        desktopNav.classList.add('mobile-ready');
    },
    
    enhanceCurrentPage() {
        // Highlight current page in navigation
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-links a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || 
                (currentPage === '' && href === 'index.html') ||
                (currentPage.includes(href.replace('.html', '')) && href !== '#')) {
                link.classList.add('active');
            }
        });
    }
};

// ==================== INITIALIZE ON DOM LOAD ====================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize hamburger menu
    HamburgerMenu.init();
    
    // Enhance navigation
    EnhancedNavigation.init();
    
    // Update existing Navigation module to work with hamburger
    if (window.Navigation) {
        const originalSetupActiveLinks = Navigation.setupActiveLinks;
        Navigation.setupActiveLinks = function() {
            originalSetupActiveLinks.call(this);
            EnhancedNavigation.enhanceCurrentPage();
        };
    }
});

// Export for use in other files
window.HamburgerMenu = HamburgerMenu;
window.EnhancedNavigation = EnhancedNavigation;