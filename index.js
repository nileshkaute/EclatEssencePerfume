// ==================== HOMEPAGE ANIMATIONS & INTERACTIONS ====================

function initHomePage() {
    // Convert USD prices to INR on homepage
    convertHomepagePricesToINR();
    
    // Hero section animations
    gsap.from(".hero-text h1", { 
        opacity: 0, 
        y: 60, 
        duration: 1.2, 
        ease: "power3.out", 
        delay: 0.3 
        
    });

    gsap.from(".hero-text p", { 
        opacity: 0, 
        y: 40, 
        duration: 1, 
        ease: "power2.out", 
        delay: 0.6 
    });

    gsap.from(".hero-text .btn-primary", { 
        opacity: 0, 
        y: 30, 
        duration: 1, 
        ease: "power2.out", 
        delay: 0.9 
    });

    gsap.from(".hero-bottle", { 
        opacity: 0, 
        scale: 0.7, 
        rotation: -10,
        duration: 1.4, 
        ease: "elastic.out(1, 0.5)", 
        delay: 1 
    });

    // Story cards animation
    gsap.utils.toArray(".story-card").forEach((card, index) => {
        gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: index * 0.2,
            ease: "power2.out",
            yoyo:true,
           
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                  scrub:2,
                toggleActions: "play none none none"
            }
        });
    });

    // Collection cards animation
    gsap.utils.toArray(".product-card").forEach((card, index) => {
        gsap.to(card, {
            opacity: 1,
            scale: 1,
            duration: 0.9,
            delay: index * 0.15,
            ease: "back.out(1.7)",
            
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                  scrub:2,
                toggleActions: "play none none none"
            }
        });
    });

    // Testimonial cards animation
    gsap.utils.toArray(".testimonial-card").forEach((card, index) => {
        gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 2,
            delay: index * 0.2,
            ease: "power2.out",
            
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                  scrub:2,
                toggleActions: "play none none none",
                 

            }
        });
    });

    // Experience section - Particle Canvas
    initExperienceCanvas();
   gsap.registerPlugin(ScrollTrigger);

// Animate all inner elements of experience section
gsap.from(".experience-section .container > *", {
  opacity: 0,           // start invisible
  y: 50,                // start slightly below
  duration: 2,
  ease: "power3.out",
  stagger: 0.3,         // stagger each child element
  scrollTrigger: {
    trigger: ".experience-section",
    scroller: "body",
    start: "top 70%",   // start when section hits 70% of viewport
    end: "top 40%",
    scrub: 1.5,         // smooth scroll-linked animation
  }
});





    // Parallax effect for hero bottle
    window.addEventListener("scroll", () => {
        const scrolled = window.pageYOffset;
        const heroBottle = document.querySelector(".hero-bottle");
        if (heroBottle) {
            gsap.to(heroBottle, {
                y: scrolled * 0.3,
                duration: 0.5,
                
                ease: "power1.out"
            });
        }
    });

    // Add to cart buttons for homepage collection
    document.querySelectorAll(".btn-secondary").forEach((btn, index) => {
        btn.addEventListener("click", function(e) {
            e.preventDefault();
            
            const productCard = btn.closest(".product-card");
            const productName = productCard.querySelector("h3").textContent;
            const productPriceText = productCard.querySelector(".product-price").textContent;
            const productPrice = productPriceText.replace('₹', '').replace(',', '');
            const productImg = productCard.querySelector(".product-img").src;
            const productNotes = productCard.querySelector(".product-notes").textContent;
            
            // Convert INR back to USD for storage (divide by conversion rate)
            const usdPrice = parseFloat(productPrice.replace(/,/g, '')) / CONFIG.currency.conversionRate;
            
            const added = Cart.add({
                id: `home-${index + 1}`,
                name: productName,
                price: usdPrice,
                image: productImg,
                notes: productNotes
            });
            
            if (added) {
                gsap.to(btn, {
                    scale: 0.95,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.inOut",
                    onComplete: () => {
                        const cartIcon = document.querySelector('.cart-icon');
                        if (cartIcon) {
                            gsap.to(cartIcon, {
                                scale: 1.4,
                                duration: 0.3,
                                yoyo: true,
                                repeat: 1,
                                
                                ease: "elastic.out(1, 0.3)"
                            });
                        }
                    }
                });
                
                Utils.showNotification(`${productName} added to cart!`);
            }
        });
    });

    // Video animations
    gsap.utils.toArray(".video-card").forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 80,
            duration: 1,
            delay: i * 0.2,
           
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                  scrub:2,
            },
        });
    });

    // Footer icons
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
    
    // Footer social link interactions
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
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (email) {
                Utils.showNotification('Thank you for subscribing!');
                emailInput.value = '';
                
                const submitBtn = newsletterForm.querySelector('button');
                gsap.to(submitBtn, {
                    scale: 0.95,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    scrub:2,
                });
            }
        });
    }
    
    // Protected Products Link
    const productsLink = document.getElementById('productsLink');
    if (productsLink) {
        productsLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (Auth.isLoggedIn()) {
                window.location.href = 'products.html';
            } else {
                Utils.showNotification('Please login to view products!');
                const loginModal = document.getElementById('loginModal');
                Auth.showModal(loginModal);
            }
        });
    }
}

// ==================== HOMEPAGE PRICE CONVERSION ====================
function convertHomepagePricesToINR() {
    document.querySelectorAll('.product-price').forEach(priceElement => {
        // Check if price is already in INR (contains ₹ symbol)
        if (!priceElement.textContent.includes('₹')) {
            const usdPrice = parseFloat(priceElement.textContent.replace('$', ''));
            priceElement.textContent = Utils.formatPrice(usdPrice);
        }
    });
}

// ==================== EXPERIENCE CANVAS INITIALIZATION ====================
function initExperienceCanvas() {
    const canvas = document.getElementById("experienceCanvas");
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let particles = [];

    function createParticles(color) {
        particles = [];
        const particleCount = 100;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                radius: Math.random() * 3 + 1,
                alpha: Math.random() * 0.8 + 0.2,
                color: color,
                life: 1
            });
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.005;
            p.life -= 0.005;
            
            if (p.alpha <= 0 || p.life <= 0) {
                p.x = canvas.width / 2;
                p.y = canvas.height / 2;
                p.alpha = Math.random() * 0.8 + 0.2;
                p.life = 1;
                p.vx = (Math.random() - 0.5) * 4;
                p.vy = (Math.random() - 0.5) * 4;
            }
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
            ctx.fill();
        });
        
        requestAnimationFrame(animateParticles);
    }

    createParticles("212,175,55");
    animateParticles();

    const scentBtns = document.querySelectorAll(".scent-btn");
    const experienceBottle = document.querySelector(".experience-bottle");

    scentBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            scentBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const emotion = btn.dataset.emotion;
            let color, glowColor;
            
            switch(emotion) {
                case "joy":
                    color = "212,175,55";
                    glowColor = "rgba(212,175,55,0.9)";
                    break;
                case "calm":
                    color = "135,206,235";
                    glowColor = "rgba(135,206,235,0.8)";
                    break;
                case "passion":
                    color = "255,105,180";
                    glowColor = "rgba(255,105,180,0.8)";
                    break;
                case "mystery":
                    color = "138,43,226";
                    glowColor = "rgba(138,43,226,0.8)";
                    break;
            }
            
            createParticles(color);
            
            if (experienceBottle) {
                gsap.to(experienceBottle, {
                    duration: 0.6,
                    filter: `drop-shadow(0 0 50px ${glowColor})`,
                    scale: 1.1,
                    ease: "power2.out",
                    yoyo: true,
                    repeat: 1
                });
                
                gsap.to(experienceBottle, {
                    duration: 0.8,
                    rotation: 5,
                    ease: "power2.inOut",
                    yoyo: true,
                    repeat: 1
                });
            }
        });
    });
}