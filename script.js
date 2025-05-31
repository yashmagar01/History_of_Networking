// Initialize AOS
AOS.init({
    duration: 1000,
    offset: 100,
    once: true
});

// Navigation Bar functionality
// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '#0') {
            e.preventDefault();
            return;
        }
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            
            // Close mobile menu if open
            const navMenu = document.querySelector('.new-nav-menu');
            const navToggle = document.querySelector('.new-nav-toggle');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            const headerOffset = 80; // Height of fixed header
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Update URL without adding to history
            if (history.pushState) {
                history.pushState(null, null, targetId);
            } else {
                window.location.hash = targetId;
            }
            
            // Add active class to clicked link
            document.querySelectorAll('.new-nav-link').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// Update active nav link on scroll
function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 100;
    
    document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.new-nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Throttle scroll events
let isScrolling;
window.addEventListener('scroll', () => {
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(updateActiveNavLink, 100);
}, false);

document.addEventListener('DOMContentLoaded', function() {
    const newNav = document.querySelector('.new-nav');
    
    // Run this code if the new navigation exists
    if (newNav) {
        // Navigation Elements
        const navToggle = document.querySelector('.new-nav-toggle');
        const navMenu = document.querySelector('.new-nav-menu');
        const navOverlay = document.createElement('div');
        const body = document.body;
        const html = document.documentElement;
        const header = document.querySelector('.new-nav');
        let lastScroll = 0;

        // Create overlay element for mobile menu
        navOverlay.className = 'nav-overlay';
        document.body.appendChild(navOverlay);

        // Toggle mobile menu function
        function toggleMenu() {
            const isOpening = !navMenu.classList.contains('active');
            
            // Toggle classes
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            navOverlay.classList.toggle('active');
            
            // Toggle body scroll
            body.style.overflow = isOpening ? 'hidden' : '';
            
            // Toggle aria attributes for accessibility
            const expanded = isOpening ? 'true' : 'false';
            navToggle.setAttribute('aria-expanded', expanded);
            navMenu.setAttribute('aria-hidden', !isOpening);
            
            // Set focus to first item when opening
            if (isOpening) {
                const firstLink = navMenu.querySelector('a');
                if (firstLink) firstLink.focus();
            }
        }

        // Close menu when clicking on a nav link
        function handleNavLinkClick(e) {
            if (window.innerWidth <= 991) {
                const isDropdownBtn = e.target.classList.contains('dropdown-btn') || 
                                    e.target.closest('.dropdown-btn');
                
                if (isDropdownBtn) {
                    e.preventDefault();
                    const dropdown = e.target.closest('.dropdown');
                    const isExpanded = dropdown.getAttribute('aria-expanded') === 'true';
                    
                    // Close all other dropdowns
                    document.querySelectorAll('.dropdown').forEach(d => {
                        if (d !== dropdown) {
                            d.classList.remove('active');
                            d.setAttribute('aria-expanded', 'false');
                        }
                    });
                    
                    // Toggle current dropdown
                    dropdown.classList.toggle('active');
                    dropdown.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
                } else {
                    // For regular links, close the menu
                    toggleMenu();
                }
            }
        }

        // Close menu when clicking outside
        function handleOutsideClick(e) {
            const isClickInsideNav = navMenu.contains(e.target) || navToggle.contains(e.target);
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                toggleMenu();
            }
        }

        // Handle window resize
        function handleResize() {
            if (window.innerWidth > 991) {
                // Reset mobile menu state on larger screens
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navOverlay.classList.remove('active');
                body.style.overflow = '';
                
                // Reset all dropdowns
                document.querySelectorAll('.dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                    dropdown.setAttribute('aria-expanded', 'false');
                });
            }
            
            // Update header class based on scroll position
            updateHeaderOnScroll();
        }

        // Update header on scroll
        function updateHeaderOnScroll() {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                header.classList.remove('scrolled-up');
                return;
            }
            
            if (currentScroll > lastScroll && !header.classList.contains('scrolled-down')) {
                // Scroll down
                header.classList.remove('scrolled-up');
                header.classList.add('scrolled-down');
            } else if (currentScroll < lastScroll && header.classList.contains('scrolled-down')) {
                // Scroll up
                header.classList.remove('scrolled-down');
                header.classList.add('scrolled-up');
            }
            
            lastScroll = currentScroll;
        }

        // Event Listeners
        if (navToggle) {
            // Toggle menu on button click
            navToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleMenu();
            });
            
            // Add keyboard support for menu toggle
            navToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleMenu();
                }
            });
        }
        
        // Add click handlers to all nav links and dropdown buttons
        const navLinks = document.querySelectorAll('.new-nav-link, .dropdown-btn');
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavLinkClick);
            
            // Add keyboard navigation support
            link.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    toggleMenu();
                }
            });
        });
        
        // Close menu when clicking outside or pressing Escape
        document.addEventListener('click', handleOutsideClick);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                toggleMenu();
                navToggle.focus();
            }
        });
        
        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(handleResize, 250);
        });
        
        // Handle scroll events for header animation
        window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
        
        // Initialize header state
        updateHeaderOnScroll();
        
        // Set initial ARIA attributes
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Toggle navigation menu');
        navMenu.setAttribute('aria-hidden', 'true');
        navMenu.setAttribute('aria-label', 'Main navigation');
        
        // Set ARIA attributes for dropdowns
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.setAttribute('aria-expanded', 'false');
            dropdown.setAttribute('aria-haspopup', 'true');
        });
        
        // Handle dropdowns on mobile and desktop
        dropdowns.forEach(dropdown => {
            const dropdownBtn = dropdown.querySelector('.dropdown-btn');
            
            if (dropdownBtn) {
                // For mobile devices
                if (window.innerWidth <= 768) {
                    dropdownBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        dropdown.classList.toggle('active');
                    });
                }
                
                // For all devices - handle hover states
                dropdown.addEventListener('mouseenter', function() {
                    if (window.innerWidth > 768) {
                        this.classList.add('active');
                    }
                });
                
                dropdown.addEventListener('mouseleave', function() {
                    if (window.innerWidth > 768) {
                        this.classList.remove('active');
                    }
                });
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navMenu && navMenu.classList.contains('active') && !e.target.closest('.new-nav')) {
                navMenu.classList.remove('active');
                if (navToggle) navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('.new-nav-link[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Only prevent default if it's a same-page anchor
                if (href !== '#' && !href.includes('index.html')) {
                    e.preventDefault();
                    
                    const targetId = href;
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        // Close mobile menu if open
                        if (navMenu && navMenu.classList.contains('active')) {
                            navMenu.classList.remove('active');
                            if (navToggle) navToggle.classList.remove('active');
                            document.body.style.overflow = '';
                        }
                        
                        // Scroll to target
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }
});

// Particles.js Configuration
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#00ff88'
        },
        shape: {
            type: 'circle'
        },
        opacity: {
            value: 0.5,
            random: true
        },
        size: {
            value: 3,
            random: true
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#00ff88',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'grab'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        }
    },
    retina_detect: true
});

// Cursor System
class CustomCursor {
    constructor() {
        this.cursor = document.querySelector('.cursor');
        this.cursorFollower = document.querySelector('.cursor-follower');
        this.isVisible = false;
        this.isActive = false;
        this.init();
    }

    init() {
        if (!this.cursor || !this.cursorFollower) return;

        // Initial state
        this.cursor.style.opacity = '0';
        this.cursorFollower.style.opacity = '0';

        // Mouse move handler
document.addEventListener('mousemove', (e) => {
            if (!this.isVisible) {
                this.show();
            }
            this.move(e);
        });

        // Mouse leave handler
        document.addEventListener('mouseleave', () => this.hide());
        document.addEventListener('mouseenter', () => this.show());

        // Initialize interactive elements
        this.initInteractiveElements();
    }

    move(e) {
        if (!this.cursor || !this.cursorFollower) return;

        // Update cursor position
        this.cursor.style.left = e.clientX + 'px';
        this.cursor.style.top = e.clientY + 'px';

        // Update follower with delay
    setTimeout(() => {
            this.cursorFollower.style.left = e.clientX + 'px';
            this.cursorFollower.style.top = e.clientY + 'px';
    }, 50);
    }

    show() {
        if (!this.cursor || !this.cursorFollower) return;
        this.isVisible = true;
        this.cursor.style.opacity = '1';
        this.cursorFollower.style.opacity = '1';
    }

    hide() {
        if (!this.cursor || !this.cursorFollower) return;
        this.isVisible = false;
        this.cursor.style.opacity = '0';
        this.cursorFollower.style.opacity = '0';
    }

    activate() {
        if (!this.cursor || !this.cursorFollower) return;
        this.isActive = true;
        this.cursor.classList.add('active');
        this.cursorFollower.classList.add('active');
    }

    deactivate() {
        if (!this.cursor || !this.cursorFollower) return;
        this.isActive = false;
        this.cursor.classList.remove('active');
        this.cursorFollower.classList.remove('active');
    }

    initInteractiveElements() {
        const interactiveElements = document.querySelectorAll(
            'a, button, .card, .timeline-item, .challenge-card, .innovator-card, ' +
            '.dropdown-toggle, .feature-card, .spec-item, .nav-links a, .nav-toggle, ' +
            '.feature-item, .timeline-item-small, .social-icon, .scroll-btn'
        );

        interactiveElements.forEach(element => {
            if (!element) return;

            element.addEventListener('mouseenter', () => this.activate());
            element.addEventListener('mouseleave', () => this.deactivate());

            // Add touch support for mobile
            element.addEventListener('touchstart', () => this.activate());
            element.addEventListener('touchend', () => this.deactivate());
        });
    }
}

// Initialize cursor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.customCursor = new CustomCursor();
});

// Navigation System
class NavigationSystem {
    constructor() {
        this.nav = document.querySelector('.main-nav');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.dropdowns = document.querySelectorAll('.nav-item.dropdown');
        this.lastScroll = 0;
        this.isMobile = window.innerWidth <= 768;
        this.currentPath = window.location.pathname;
        this.init();
    }

    init() {
        if (!this.nav) return;

        // Initialize scroll behavior
        this.initScrollBehavior();

        // Initialize mobile menu
        this.initMobileMenu();

        // Initialize dropdowns
        this.initDropdowns();

        // Initialize smooth scroll
        this.initSmoothScroll();

        // Set active states
        this.setActiveStates();

        // Handle window resize
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 768;
            this.updateNavigationState();
        });
    }

    initScrollBehavior() {
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
            // Handle scroll direction
    if (currentScroll <= 0) {
                this.nav.classList.remove('scroll-up');
        return;
    }
    
            if (currentScroll > this.lastScroll && !this.nav.classList.contains('scroll-down')) {
                this.nav.classList.remove('scroll-up');
                this.nav.classList.add('scroll-down');
            } else if (currentScroll < this.lastScroll && this.nav.classList.contains('scroll-down')) {
                this.nav.classList.remove('scroll-down');
                this.nav.classList.add('scroll-up');
            }
            
            this.lastScroll = currentScroll;
        });
    }

    initMobileMenu() {
        if (!this.navToggle || !this.navLinks) return;

        // Toggle mobile menu
        this.navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleMobileMenu();
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.nav && !this.nav.contains(e.target) && this.navLinks.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navLinks.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });

        // Close mobile menu when clicking a link
        this.navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (this.isMobile) {
                    this.closeMobileMenu();
                }
            });
        });
    }

    initDropdowns() {
        this.dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            if (!toggle) return;

            // Click handler for dropdown toggle
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Close other dropdowns
                this.dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown && otherDropdown.classList.contains('active')) {
                        this.closeDropdown(otherDropdown);
                    }
                });

                // Toggle current dropdown
                this.toggleDropdown(dropdown);
            });

            // Handle keyboard navigation
            toggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleDropdown(dropdown);
                }
            });

            // Handle dropdown menu items
            const menuItems = dropdown.querySelectorAll('.dropdown-item');
            menuItems.forEach(item => {
                item.addEventListener('click', () => {
                    if (this.isMobile) {
                        this.closeMobileMenu();
                    } else {
                         this.closeDropdown(dropdown); // Close dropdown on desktop after clicking an item
                    }
                });
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-item.dropdown')) {
                this.dropdowns.forEach(dropdown => {
                    if (dropdown.classList.contains('active')) {
                        this.closeDropdown(dropdown);
                    }
                });
            }
        });

        // Handle escape key for dropdowns
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.dropdowns.forEach(dropdown => {
                    if (dropdown.classList.contains('active')) {
                        this.closeDropdown(dropdown);
                    }
                });
            }
        });
    }

    initSmoothScroll() {
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
        e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
                    this.closeMobileMenu();
                }
            });
        });
    }

    setActiveStates() {
        // Set active state for current page
        const currentPage = this.currentPath.split('/').pop();
        if (currentPage) {
            // Handle mobile generations
            if (currentPage.match(/^\d+g\.html$/)) {
                // Find the Mobile Generations dropdown without using :has()
                const dropdowns = this.nav.querySelectorAll('.nav-item.dropdown');
                let mobileDropdown = null;
                
                dropdowns.forEach(dropdown => {
                    const toggleText = dropdown.querySelector('.dropdown-toggle').textContent.trim();
                    if (toggleText === 'Mobile Generations') {
                        mobileDropdown = dropdown;
                    }
                });
                
                if (mobileDropdown) {
                    mobileDropdown.classList.add('active');
                    const link = mobileDropdown.querySelector(`a[href="${currentPage}"]`);
                    if (link) link.classList.add('active');
                }
            }
            // Handle computer generations
            else if (currentPage.match(/^computer\d+g\.html$/)) {
                // Find the Computer Generations dropdown without using :has()
                const dropdowns = this.nav.querySelectorAll('.nav-item.dropdown');
                let computerDropdown = null;
                
                dropdowns.forEach(dropdown => {
                    const toggleText = dropdown.querySelector('.dropdown-toggle').textContent.trim();
                    if (toggleText === 'Computer Generations') {
                        computerDropdown = dropdown;
                    }
                });
                
                if (computerDropdown) {
                    computerDropdown.classList.add('active');
                    const link = computerDropdown.querySelector(`a[href="${currentPage}"]`);
                    if (link) link.classList.add('active');
                }
            }
        }
    }

    toggleMobileMenu() {
        if (!this.navToggle || !this.navLinks) return;
        
        this.navToggle.classList.toggle('active');
        this.navLinks.classList.toggle('active');
        
        // Toggle overlay
        const overlay = document.querySelector('.nav-overlay');
        if (overlay) {
            overlay.classList.toggle('active');
        }
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.navLinks.classList.contains('active') ? 'hidden' : '';
    }

    closeMobileMenu() {
        if (!this.navToggle || !this.navLinks) return;
        
        this.navToggle.classList.remove('active');
        this.navLinks.classList.remove('active');
        
        // Remove overlay
        const overlay = document.querySelector('.nav-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
        
        document.body.style.overflow = '';
    }

    toggleDropdown(dropdown) {
        dropdown.classList.toggle('active');
        const isExpanded = dropdown.classList.contains('active');
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle) {
            toggle.setAttribute('aria-expanded', isExpanded);
        }
    }

    closeDropdown(dropdown) {
        dropdown.classList.remove('active');
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle) {
            toggle.setAttribute('aria-expanded', 'false');
        }
    }

    updateNavigationState() {
        if (!this.isMobile) {
            this.closeMobileMenu();
            this.dropdowns.forEach(dropdown => this.closeDropdown(dropdown));
        }
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const navigation = new NavigationSystem();
    navigation.init();
});

// Typing Animation (only on index.html)
const title = document.querySelector('.landing-page .title');
if (title) {
    const text = title.textContent;
    title.textContent = '';

    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            title.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }

    // Start typing animation when page loads
    window.addEventListener('load', typeWriter);
}

// Parallax Effect for Cards (only on index.html)
const cards = document.querySelectorAll('#index-main .card, #index-main .challenge-card, #index-main .innovator-card');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
});

// Intersection Observer for Timeline (only on index.html)
const timelineSection = document.querySelector('.timeline-section');
if (timelineSection) {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.5
    });

    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
}

// Touch Support for Mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchEndX - touchStartX;
    
    if (Math.abs(diff) > swipeThreshold) {
        const sections = document.querySelectorAll('section');
        const currentSection = Array.from(sections).find(section => {
            const rect = section.getBoundingClientRect();
            return rect.top >= 0 && rect.top <= window.innerHeight / 2;
        });
        
        if (currentSection) {
            const currentIndex = Array.from(sections).indexOf(currentSection);
            const targetIndex = diff > 0 ? currentIndex - 1 : currentIndex + 1;
            
            if (targetIndex >= 0 && targetIndex < sections.length) {
                sections[targetIndex].scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
}

// Prevent default touch behavior on cards
document.querySelectorAll('.card, .challenge-card, .innovator-card').forEach(card => {
    card.addEventListener('touchstart', (e) => {
        e.preventDefault();
    }, { passive: false });
});

// Network Speed Chart (only on index.html if needed)
const speedCtx = document.querySelector('.speed-chart');
if (speedCtx) {
    const speedData = {
        labels: ['2G', '3G', '4G', '5G', '6G'],
        datasets: [{
            label: 'Network Speed (Mbps)',
            data: [0.064, 2, 100, 10000, 1000000],
            backgroundColor: 'rgba(0, 255, 136, 0.2)',
            borderColor: '#00ff88',
            borderWidth: 2,
            fill: true
        }]
    };

    new Chart(speedCtx.getContext('2d'), {
        type: 'line',
        data: speedData,
        options: {
            responsive: true,
            scales: {
                y: {
                    type: 'logarithmic',
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#fff'
                    }
                }
            }
        }
    });
}

// Latency Chart (only on index.html if needed)
const latencyCtx = document.querySelector('.latency-chart');
if (latencyCtx) {
    const latencyData = {
        labels: ['2G', '3G', '4G', '5G', '6G'],
        datasets: [{
            label: 'Latency (ms)',
            data: [300, 100, 50, 1, 0.1],
            backgroundColor: 'rgba(0, 161, 255, 0.2)',
            borderColor: '#00a1ff',
            borderWidth: 2,
            fill: true
        }]
    };

    new Chart(latencyCtx.getContext('2d'), {
        type: 'line',
        data: latencyData,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    reverse: true
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#fff'
                    }
                }
            }
        }
    });
} 

// Generation-specific page animations
const generationHeader = document.querySelector('.generation-header');
if (generationHeader) {
    // Add parallax effect to header
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        generationHeader.style.backgroundPositionY = scrolled * 0.5 + 'px';
    });

    // Animate header content on load
    const headerContent = generationHeader.querySelector('.header-content');
    if (headerContent) {
        headerContent.style.opacity = '0';
        headerContent.style.transform = 'translateY(20px)';
        setTimeout(() => {
            headerContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            headerContent.style.opacity = '1';
            headerContent.style.transform = 'translateY(0)';
        }, 100);
    }
}

// Feature cards animation
const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 100 * index);
});

// Chart initialization
let speedChartInstance = null;
let latencyChartInstance = null;

function createComparisonCharts() {
    // Speed Comparison Chart
    const speedCtx = document.getElementById('speedComparisonChart');
    if (speedCtx) {
        new Chart(speedCtx, {
            type: 'bar',
            data: {
                labels: ['1G', '2G', '3G', '4G', '5G', '6G'],
                datasets: [{
                    label: 'Maximum Data Speed (Mbps)',
                    data: [0.002, 0.384, 2, 1000, 20000, 1000000],
                    backgroundColor: [
                        'rgba(0, 255, 136, 0.2)',
                        'rgba(0, 255, 136, 0.3)',
                        'rgba(0, 255, 136, 0.4)',
                        'rgba(0, 255, 136, 0.5)',
                        'rgba(0, 255, 136, 0.6)',
                        'rgba(0, 255, 136, 0.7)'
                    ],
                    borderColor: [
                        'rgba(0, 255, 136, 1)',
                        'rgba(0, 255, 136, 1)',
                        'rgba(0, 255, 136, 1)',
                        'rgba(0, 255, 136, 1)',
                        'rgba(0, 255, 136, 1)',
                        'rgba(0, 255, 136, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        type: 'logarithmic',
                        title: {
                            display: true,
                            text: 'Speed (Mbps)',
                            color: '#ffffff'
                        },
                        ticks: {
                            color: '#ffffff',
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Generation',
                            color: '#ffffff'
                        },
                        ticks: {
                            color: '#ffffff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let value = context.raw;
                                if (value >= 1000) {
                                    return `${(value/1000).toFixed(1)} Gbps`;
                                }
                                return `${value} Mbps`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Latency Comparison Chart
    const latencyCtx = document.getElementById('latencyComparisonChart');
    if (latencyCtx) {
        new Chart(latencyCtx, {
            type: 'line',
            data: {
                labels: ['1G', '2G', '3G', '4G', '5G', '6G'],
                datasets: [{
                    label: 'Latency (ms)',
                    data: [1000, 750, 100, 50, 1, 0.1],
                    borderColor: 'rgba(0, 161, 255, 1)',
                    backgroundColor: 'rgba(0, 161, 255, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        type: 'logarithmic',
                        title: {
                            display: true,
                            text: 'Latency (ms)',
                            color: '#ffffff'
                        },
                        ticks: {
                            color: '#ffffff',
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Generation',
                            color: '#ffffff'
                        },
                        ticks: {
                            color: '#ffffff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let value = context.raw;
                                return `${value} ms`;
                            }
                        }
                    }
                }
            }
        });
    }
}

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createComparisonCharts();
    
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true
    });
});

class SearchSystem {
    constructor() {
        this.searchInput = document.querySelector('.search-input');
        this.searchResults = document.querySelector('.search-results');
        this.searchTimeout = null;
        this.isSearching = false;
        this.init();
    }

    init() {
        if (!this.searchInput || !this.searchResults) return;

        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(this.searchTimeout);
            const query = e.target.value.trim();

            if (query.length < 2) {
                this.hideResults();
                return;
            }

            this.searchTimeout = setTimeout(() => {
                this.performSearch(query);
            }, 300);
        });

        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.searchInput.contains(e.target) && !this.searchResults.contains(e.target)) {
                this.hideResults();
            }
        });

        // Handle keyboard navigation
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideResults();
            }
        });
    }

    async performSearch(query) {
        if (this.isSearching) return;
        this.isSearching = true;

        try {
            this.showLoading();
            const results = await this.searchPages(query);
            this.displayResults(results, query);
        } catch (error) {
            console.error('Search error:', error);
            this.showError();
        } finally {
            this.isSearching = false;
        }
    }

    async searchPages(query) {
        const pages = [
            'index.html',
            '1g.html',
            '2g.html',
            '3g.html',
            '4g.html',
            '5g.html',
            '6g.html',
            'computer1g.html',
            'computer2g.html',
            'computer3g.html',
            'computer4g.html',
            'computer5g.html'
        ];

        const results = [];

        for (const page of pages) {
            try {
                const response = await fetch(page);
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');
                
                // Search in title
                const title = doc.querySelector('title')?.textContent || '';
                if (title.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        title,
                        url: page,
                        excerpt: this.generateExcerpt(doc.body.textContent, query),
                        type: 'title'
                    });
                }

                // Search in main content
                const mainContent = doc.querySelector('main')?.textContent || '';
                if (mainContent.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        title: title,
                        url: page,
                        excerpt: this.generateExcerpt(mainContent, query),
                        type: 'content'
                    });
                }
            } catch (error) {
                console.error(`Error searching ${page}:`, error);
            }
        }

        return results;
    }

    generateExcerpt(content, searchTerms) {
        const maxLength = 150;
        const terms = searchTerms.toLowerCase().split(' ');
        const text = content.toLowerCase();
        
        // Find the first occurrence of any search term
        let startIndex = -1;
        for (const term of terms) {
            const index = text.indexOf(term);
            if (index !== -1 && (startIndex === -1 || index < startIndex)) {
                startIndex = index;
            }
        }

        if (startIndex === -1) {
            return content.substring(0, maxLength) + '...';
        }

        // Get context around the found term
        const start = Math.max(0, startIndex - 50);
        const end = Math.min(content.length, startIndex + maxLength);
        let excerpt = content.substring(start, end);

        // Add ellipsis if needed
        if (start > 0) excerpt = '...' + excerpt;
        if (end < content.length) excerpt += '...';

        return excerpt;
    }

    displayResults(results, query) {
        if (!this.searchResults) return;

        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="search-result-item">
                    <p>No results found for "${query}"</p>
                </div>
            `;
        } else {
            this.searchResults.innerHTML = results.map(result => `
                <div class="search-result-item">
                    <a href="${result.url}">
                        <div class="result-title">${result.title}</div>
                        <div class="result-excerpt">${result.excerpt}</div>
                    </a>
                </div>
            `).join('');
        }

        this.searchResults.classList.add('active');
    }

    showLoading() {
        if (!this.searchResults) return;
        this.searchResults.innerHTML = `
            <div class="search-result-item">
                <p>Searching...</p>
            </div>
        `;
        this.searchResults.classList.add('active');
    }

    showError() {
        if (!this.searchResults) return;
        this.searchResults.innerHTML = `
            <div class="search-result-item">
                <p>An error occurred while searching. Please try again.</p>
            </div>
        `;
        this.searchResults.classList.add('active');
    }

    hideResults() {
        if (!this.searchResults) return;
        this.searchResults.classList.remove('active');
        this.searchResults.innerHTML = '';
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.searchSystem = new SearchSystem();
    
    // Initialize Did You Know section
    initDidYouKnow();
});

/* Did You Know Section */
function initDidYouKnow() {
    const facts = [
        {
            icon: 'fa-network-wired',
            text: "The first message ever sent over ARPANET, the precursor to the internet, was 'LO' - an attempt to send 'LOGIN' that crashed the system."
        },
        {
            icon: 'fa-globe',
            text: "The World Wide Web was invented by Tim Berners-Lee in 1989 while working at CERN. The first website went live in 1991."
        },
        {
            icon: 'fa-envelope',
            text: "The first email was sent in 1971 by Ray Tomlinson, who also introduced the @ symbol in email addresses."
        },
        {
            icon: 'fa-wifi',
            text: "The first wireless transmission was made in 1895 by Guglielmo Marconi, who sent radio signals over a distance of 1.5 miles."
        },
        {
            icon: 'fa-server',
            text: "The first domain name ever registered was Symbolics.com on March 15, 1985. It's now a historic site."
        },
        {
            icon: 'fa-ethernet',
            text: "Ethernet was invented at Xerox PARC in 1973 and could transmit data at 2.94 Mbps - about 33,000 times slower than modern 100 Gbps Ethernet."
        },
        {
            icon: 'fa-mobile-alt',
            text: "The first mobile phone call was made on April 3, 1973, by Martin Cooper of Motorola. The phone weighed 2.4 pounds (1.1 kg)."
        },
        {
            icon: 'fa-broadcast-tower',
            text: "The first transatlantic telephone cable (TAT-1) was laid in 1956 and could handle 36 simultaneous calls. Modern fiber optic cables can handle millions."
        },
        {
            icon: 'fa-satellite-dish',
            text: "The first communications satellite, Telstar 1, was launched in 1962 and relayed the first live transatlantic television broadcast."
        },
        {
            icon: 'fa-hashtag',
            text: "The hashtag (#) was first used on IRC (Internet Relay Chat) in 1988 to group similar messages and topics together."
        },
        {
            icon: 'fa-robot',
            text: "The first computer 'bug' was an actual insect - a moth found in the Harvard Mark II computer's relay in 1947, which was taped into the log book."
        },
        {
            icon: 'fa-barcode',
            text: "The first barcode was scanned on a pack of Wrigley's chewing gum in 1974. This technology later became crucial for inventory and logistics networks."
        },
        {
            icon: 'fa-qrcode',
            text: "QR codes can store up to 7,089 numeric characters or 4,296 alphanumeric characters, making them perfect for sharing network information."
        },
        {
            icon: 'fa-cloud',
            text: "Cloud computing dates back to the 1950s when mainframe computers were accessed via 'dumb terminals' that had no processing power of their own."
        },
        {
            icon: 'fa-shield-alt',
            text: "The first computer virus, called 'Creeper,' was created in 1971 as an experimental self-replicating program. The first antivirus, 'Reaper,' was created to delete it."
        }
    ];

    const factText = document.querySelector('.fact-text');
    const factIcon = document.querySelector('.fact-icon i');
    const factCard = document.querySelector('.fact-card');
    const factContainer = document.querySelector('.fact-container');
    const factIndicator = document.getElementById('fact-indicator');
    const prevBtn = document.getElementById('prev-fact');
    const nextBtn = document.getElementById('next-fact');
    
    let currentIndex = 0;
    let dots = [];
    
    // Create dots based on number of facts
    function createDots() {
        factIndicator.innerHTML = '';
        dots = [];
        
        for (let i = 0; i < facts.length; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot';
            if (i === 0) dot.classList.add('active');
            dot.dataset.index = i;
            dot.addEventListener('click', () => goToFact(parseInt(dot.dataset.index)));
            factIndicator.appendChild(dot);
            dots.push(dot);
        }
    }

    // Go to specific fact
    function goToFact(index) {
        if (index < 0) index = facts.length - 1;
        if (index >= facts.length) index = 0;
        
        currentIndex = index;
        updateFact(currentIndex);
    }
    
    // Update fact display with animations
    function updateFact(index) {
        // Add exit animation
        factText.classList.remove('visible');
        factIcon.style.animation = 'none';
        factIcon.offsetHeight; // Trigger reflow
        
        // Shake animation for icon
        factIcon.style.animation = 'shake 0.5s ease';
        
        // Update content after a short delay
        setTimeout(() => {
            // Update content
            factText.textContent = facts[index].text;
            factIcon.className = `fas ${facts[index].icon}`;
            
            // Update dots with animation
            dots.forEach((dot, i) => {
                const wasActive = dot.classList.contains('active');
                dot.classList.toggle('active', i === index);
                
                // Add pulse effect when dot becomes active
                if (i === index) {
                    dot.style.animation = 'none';
                    dot.offsetHeight; // Trigger reflow
                    dot.style.animation = 'pulse 0.8s ease';
                }
            });
            
            // Add enter animation
            setTimeout(() => {
                factText.classList.add('visible');
                
                // Add floating animation back to icon
                factIcon.style.animation = 'float 3s ease-in-out infinite';
                
                // Add a subtle glow effect
                const glow = document.createElement('div');
                glow.className = 'glow';
                factCard.appendChild(glow);
                
                // Remove glow after animation
                setTimeout(() => {
                    glow.remove();
                }, 1000);
                
            }, 50);
            
        }, 300);
    }

    // Next fact
    function nextFact() {
        goToFact(currentIndex + 1);
    }

    // Previous fact
    function prevFact() {
        goToFact(currentIndex - 1);
    }

    // Event listeners
    nextBtn.addEventListener('click', nextFact);
    prevBtn.addEventListener('click', prevFact);
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateFact(currentIndex);
        });
    });
    
    // Auto-rotate facts every 8 seconds, but only if not in viewport
    let rotateInterval;
    let isInViewport = true;
    
    function startAutoRotate() {
        if (!document.hidden && isInViewport) {
            rotateInterval = setInterval(nextFact, 8000);
        }
    }
    
    // Handle tab visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(rotateInterval);
        } else {
            startAutoRotate();
        }
    });
    
    // Check if element is in viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isInViewport = entry.isIntersecting;
            if (isInViewport) {
                startAutoRotate();
            } else {
                clearInterval(rotateInterval);
            }
        });
    }, { threshold: 0.1 });
    
    observer.observe(factContainer);
    
    // Pause rotation on interaction
    factContainer.addEventListener('mouseenter', () => {
        clearInterval(rotateInterval);
    });
    
    factContainer.addEventListener('mouseleave', () => {
        if (isInViewport) {
            startAutoRotate();
        }
    });
    
    // Touch devices - pause on touch start
    factContainer.addEventListener('touchstart', () => {
        clearInterval(rotateInterval);
    }, { passive: true });
    
    // Add hover effect for cards
    factCard.addEventListener('mousemove', (e) => {
        const rect = factCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        factCard.style.setProperty('--mouse-x', `${x}px`);
        factCard.style.setProperty('--mouse-y', `${y}px`);
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextFact();
        if (e.key === 'ArrowLeft') prevFact();
    });
    
    // Touch and swipe handling
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartTime = 0;
    let isScrolling = false;
    
    factContainer.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        touchStartTime = Date.now();
        isScrolling = false;
    }, { passive: true });
    
    factContainer.addEventListener('touchmove', e => {
        // Detect if the user is scrolling
        if (Math.abs(e.touches[0].clientX - touchStartX) < 10) {
            return;
        }
        isScrolling = true;
    }, { passive: true });
    
    factContainer.addEventListener('touchend', e => {
        if (isScrolling) return;
        
        touchEndX = e.changedTouches[0].clientX;
        const touchDuration = Date.now() - touchStartTime;
        handleSwipe(touchDuration);
    }, { passive: true });
    
    function handleSwipe(touchDuration) {
        const swipeThreshold = 30;
        const swipeDiff = touchStartX - touchEndX;
        const isFastSwipe = touchDuration < 300;
        
        if (Math.abs(swipeDiff) > swipeThreshold) {
            // Prevent default to avoid scrolling while swiping
            if (isFastSwipe || Math.abs(swipeDiff) > 100) {
                if (swipeDiff > 0) {
                    nextFact();
                } else {
                    prevFact();
                }
            }
        }
    }
    
    // Add confetti effect on first interaction
    let hasInteracted = false;
    const interactionEvents = ['click', 'keydown', 'touchstart'];
    
    const handleFirstInteraction = () => {
        if (!hasInteracted) {
            hasInteracted = true;
            // Remove the event listeners after first interaction
            interactionEvents.forEach(event => {
                document.removeEventListener(event, handleFirstInteraction);
            });
            
            // Trigger confetti effect
            triggerConfetti();
        }
    };
    
    // Add event listeners for first interaction
    interactionEvents.forEach(event => {
        document.addEventListener(event, handleFirstInteraction, { once: true });
    });
    
    // Simple confetti effect
    function triggerConfetti() {
        const colors = ['#00ff88', '#00b8ff', '#ff00aa', '#ffcc00'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confetti.style.opacity = Math.random() * 0.5 + 0.5;
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            document.body.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }
    }
    
    // Initialize dots and first fact with a slight delay for better page load
    document.addEventListener('DOMContentLoaded', () => {
        // Check if user is on a touch device
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Add touch-specific classes if needed
        if (isTouchDevice) {
            document.body.classList.add('touch-device');
        }
        
        // Initialize the component
        setTimeout(() => {
            createDots();
            updateFact(0);
            factContainer.style.opacity = '1';
            
            // Reduce motion for users who prefer it
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                factContainer.style.setProperty('--animation-duration', '0.1s');
            }
        }, 300); // Reduced initial delay for better perceived performance
    });
}