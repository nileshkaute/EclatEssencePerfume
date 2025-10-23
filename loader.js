// ==================== PREMIUM PERFUME LOADER ANIMATION ====================

// Only run loader on initial homepage load, not on navigation
if (window.location.pathname === '/' || window.location.pathname === '/index.html' || window.location.pathname.endsWith('index.html')) {
  
  // Check if this is the first visit or page refresh
  if (!sessionStorage.getItem('loaderShown')) {
    
    // Wait for page to load
    window.addEventListener("load", () => {
      // Disable scrolling while loader is active
      document.body.style.overflow = "hidden";
      
      // Initialize GSAP timeline
      const tl = gsap.timeline({ delay: 0.3 });
      
      // ==================== ANIMATION SEQUENCE ====================
      
      // Step 1: Draw bottle outline (2 seconds)
      tl.fromTo(".bottle-outline", 
        { 
          opacity: 0,
          scale: 0.8
        },
        { 
          opacity: 0.6,
          scale: 1,
          duration: 1.5,
          ease: "power2.out",
          stagger: 0.2
        }
      );
      
      // Step 2: Bottle cap appears
      tl.fromTo(".perfume-bottle rect",
        {
          opacity: 0,
          y: -20
        },
        {
          opacity: 0.9,
          y: 0,
          duration: 0.8,
          ease: "bounce.out"
        },
        "-=0.5"
      );
      
      // Step 3: Liquid fills up from bottom
      tl.to("#bottle-fill",
        {
          opacity: 0.9,
          attr: { y: 60, height: 110 },
          duration: 2,
          ease: "power2.inOut"
        },
        "-=0.3"
      );
      
      // Step 4: Shimmer light effect
      tl.to(".shimmer-light",
        {
          opacity: 0.4,
          duration: 1,
          repeat: 2,
          yoyo: true,
          ease: "sine.inOut"
        },
        "-=1.5"
      );
      
      // Step 5: Bottle glow pulse
      tl.to(".perfume-bottle",
        {
          filter: "drop-shadow(0 10px 40px rgba(212,175,55,0.6))",
          duration: 1.2,
          ease: "power2.inOut",
          yoyo: true,
          repeat: 1
        },
        "-=1"
      );
      
      // Step 6: Title appears with elegant fade
      tl.to(".loader-title",
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out"
        },
        "-=0.5"
      );
      
      // Step 7: Tagline fades in
      tl.to(".loader-tagline",
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out"
        },
        "-=0.8"
      );
      
      // Step 8: Progress bar appears
      tl.to(".loading-progress",
        {
          opacity: 1,
          duration: 0.5
        },
        "-=0.5"
      );
      
      // Step 9: Progress bar fills
      tl.to(".progress-bar",
        {
          width: "100%",
          duration: 1.5,
          ease: "power2.inOut"
        },
        "-=0.3"
      );
      
      // Step 10: Loading text appears
      tl.to(".loading-text",
        {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out"
        },
        "-=1"
      );
      
      // Step 11: Hold for a moment
      tl.to({}, { duration: 0.8 });
      
      // Step 12: Fade out entire loader
      tl.to("#perfume-loader",
        {
          opacity: 0,
          scale: 1.05,
          duration: 1.5,
          ease: "power2.inOut",
          onComplete: () => {
            // Remove loader from DOM
            const loader = document.getElementById("perfume-loader");
            if (loader) {
              loader.style.display = "none";
              loader.remove();
            }
            
            // Enable body scrolling
            document.body.style.overflow = "auto";
            
            // Mark loader as shown for this session
            sessionStorage.setItem('loaderShown', 'true');
            
            // Trigger page entrance animations
            initPageAnimations();
          }
        }
      );
    });
    
  } else {
    // Loader already shown - just hide it immediately
    document.addEventListener("DOMContentLoaded", () => {
      const loader = document.getElementById("perfume-loader");
      if (loader) {
        loader.style.display = "none";
        loader.remove();
      }
      document.body.style.overflow = "auto";
      initPageAnimations();
    });
  }
  
} else {
  // Not on homepage - hide loader immediately
  document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("perfume-loader");
    if (loader) {
      loader.style.display = "none";
      loader.remove();
    }
    document.body.style.overflow = "auto";
  });
}

// ==================== PAGE ENTRANCE ANIMATIONS ====================
function initPageAnimations() {
  // Only animate if on homepage
  if (window.location.pathname === '/' || window.location.pathname === '/index.html' || window.location.pathname.endsWith('index.html')) {
    
    // Fade in main content
    gsap.from("body", {
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    });
    
    // Animate navbar
    gsap.from(".navbar", {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      delay: 0.2
    });
    
    // Animate hero section
    gsap.from(".hero-text", {
      x: -50,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.4
    });
    
    gsap.from(".hero-image", {
      x: 50,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.6
    });
  }
}

// ==================== NAVIGATION HANDLER ====================
// Prevent full page reloads for internal navigation
document.addEventListener('DOMContentLoaded', function() {
  // Handle navbar link clicks
  document.querySelectorAll('.nav-links a, .logo a').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // If it's a section link on the same page, don't prevent default
      if (href.startsWith('#')) {
        return;
      }
      
      // If it's an external link or different page, allow normal navigation
      if (href.includes('http') || href.includes('.html') || href === '/') {
        // For navigation to other pages, clear the session storage
        // so loader shows again when returning to homepage
        if (href === '/' || href === 'index.html') {
          sessionStorage.removeItem('loaderShown');
        }
        return;
      }
      
      e.preventDefault();
    });
  });
});