
/* --- main.js --- */
/**
 * STACKLY - Main Javascript
 * Handles global UI logic (Navbar, Mobile Menu, Utility functions)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        // Initial check
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        }
    }

    // 2. Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle icon
            const icon = mobileToggle.querySelector('i');
            if(navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
                mobileToggle.style.color = 'var(--neutral)';
                document.body.style.overflow = 'hidden';
                document.documentElement.style.overflow = 'hidden';
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
                mobileToggle.style.color = '';
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
                const icon = mobileToggle.querySelector('i');
                if(icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                    mobileToggle.style.color = '';
                }
            });
        });
    }

    // 2.5 Dashboard Mobile Toggle
    const dashMobileToggle = document.querySelector('.dashboard-mobile-toggle');
    const dashSidebar = document.querySelector('.sidebar');
    const dashSidebarClose = document.querySelector('.sidebar .mobile-toggle');

    if (dashMobileToggle && dashSidebar) {
        dashMobileToggle.addEventListener('click', () => {
            dashSidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        });
        
        if (dashSidebarClose) {
            dashSidebarClose.addEventListener('click', () => {
                dashSidebar.classList.remove('active');
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
            });
        }

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 992) {
                if (!dashSidebar.contains(e.target) && !dashMobileToggle.contains(e.target) && dashSidebar.classList.contains('active')) {
                    dashSidebar.classList.remove('active');
                    document.body.style.overflow = '';
                    document.documentElement.style.overflow = '';
                }
            }
        });
    }

    // 3. Counter Animation (Simple fallback if GSAP not used for everything)
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText.replace(/,/g, '');
                
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc).toLocaleString();
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target.toLocaleString();
                }
            };
            
            // Only trigger if in viewport (basic IntersectionObserver)
            const observer = new IntersectionObserver((entries) => {
                if(entries[0].isIntersecting) {
                    updateCount();
                    observer.disconnect();
                }
            });
            observer.observe(counter);
        });
    };
    
    if(counters.length > 0) animateCounters();
});


/* --- animations.js --- */
/**
 * STACKLY - GSAP and AOS Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize AOS (for simple scroll reveals)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50
        });
    }

    // 2. GSAP Animations
    if (typeof gsap !== 'undefined') {
        // Register ScrollTrigger if available
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        /* --- Navbar Entrance --- */
        const navLinks = document.querySelectorAll('.nav-links .nav-link');
        if (navLinks.length > 0) {
            gsap.fromTo(navLinks, 
                { y: -20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.2 }
            );
        }
        
        const navBrand = document.querySelector('.nav-brand');
        if(navBrand) {
            gsap.fromTo(navBrand, 
                { x: -20, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
            );
        }

        /* --- Hero Section --- */
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            // Simple split text simulation
            const text = heroTitle.innerText;
            heroTitle.innerHTML = '';
            text.split(' ').forEach(word => {
                const wordSpan = document.createElement('span');
                wordSpan.style.display = 'inline-block';
                wordSpan.style.overflow = 'hidden';
                wordSpan.style.marginRight = '8px';
                
                const charSpan = document.createElement('span');
                charSpan.className = 'split-char';
                charSpan.innerText = word;
                
                wordSpan.appendChild(charSpan);
                heroTitle.appendChild(wordSpan);
            });

            gsap.to('.split-char', {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.05,
                ease: 'power3.out',
                delay: 0.3
            });
        }

        // Hero Dashboard Floating Elements
        const floatCards = document.querySelectorAll('.float-card');
        if (floatCards.length > 0) {
            gsap.fromTo(floatCards, 
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'back.out(1.7)', delay: 0.8 }
            );

            // Parallax mouse movement
            document.addEventListener('mousemove', (e) => {
                const mouseX = e.clientX / window.innerWidth - 0.5;
                const mouseY = e.clientY / window.innerHeight - 0.5;

                gsap.to('.hero-dashboard-mock', {
                    rotateY: -10 + (mouseX * 10),
                    rotateX: 5 + (mouseY * -10),
                    duration: 1,
                    ease: 'power2.out'
                });
                
                gsap.to(floatCards, {
                    x: mouseX * 30,
                    y: mouseY * 30,
                    duration: 1.5,
                    ease: 'power2.out'
                });
            });
        }

        /* --- Payroll Workflow ScrollTrigger --- */
        const workflowSection = document.querySelector('.workflow-section');
        if (workflowSection && typeof ScrollTrigger !== 'undefined') {
            const steps = document.querySelectorAll('.workflow-step');
            const progress = document.querySelector('.workflow-progress');
            
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.workflow-track',
                    start: 'top 60%',
                    end: 'bottom 40%',
                    scrub: 1
                }
            });

            // Animate progress line width
            tl.to(progress, {
                width: '100%',
                ease: 'none'
            });

            // Activate steps progressively based on scroll position
            // Since scrub is true, we map the step activation to the timeline progress
            steps.forEach((step, index) => {
                ScrollTrigger.create({
                    trigger: step,
                    start: 'top 70%',
                    onEnter: () => step.classList.add('active'),
                    onLeaveBack: () => step.classList.remove('active')
                });
            });
        }

        /* --- Split Section Auto Items --- */
        const autoItems = document.querySelectorAll('.auto-list .auto-item');
        if (autoItems.length > 0 && typeof ScrollTrigger !== 'undefined') {
            gsap.fromTo(autoItems,
                { x: 30, opacity: 0 },
                { 
                    x: 0, opacity: 1, 
                    duration: 0.6, 
                    stagger: 0.15, 
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.auto-list',
                        start: 'top 85%'
                    }
                }
            );
        }

        /* --- Analytics Dashboard Charts --- */
        const analyticsDashboard = document.querySelector('.analytics-dashboard');
        if (analyticsDashboard && typeof ScrollTrigger !== 'undefined') {
            // Animate Vertical Bars
            const chartBars = document.querySelectorAll('.chart-bar');
            if(chartBars.length > 0) {
                gsap.fromTo(chartBars, 
                    { height: 0 },
                    { 
                        height: (index, target) => target.getAttribute('data-height') + '%',
                        duration: 1.2, 
                        stagger: 0.1, 
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: '.analytics-dashboard',
                            start: 'top 80%'
                        }
                    }
                );
            }

            // Animate Horizontal Bars
            const horizBars = document.querySelectorAll('.analytics-grid > div:nth-child(2) div[style*="height: 100%"]');
            if(horizBars.length > 0) {
                horizBars.forEach(bar => { bar.dataset.origWidth = bar.style.width; });
                gsap.fromTo(horizBars,
                    { width: 0 },
                    { 
                        width: (index, target) => target.dataset.origWidth, 
                        duration: 1.2, 
                        stagger: 0.15, 
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: '.analytics-dashboard',
                            start: 'top 80%'
                        }
                    }
                );
            }
        }
        
        /* --- Case Studies Stack --- */
        const caseCards = document.querySelectorAll('.case-card');
        if(caseCards.length > 0 && typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.create({
                trigger: '.case-stack',
                start: 'top 60%',
                onEnter: () => {
                    gsap.to(caseCards[0], { y: -20, scale: 1.05, duration: 0.5 });
                },
                onLeaveBack: () => {
                    gsap.to(caseCards[0], { y: 0, scale: 1, duration: 0.5 });
                }
            });
        }
        
        /* --- Auth Page Animations --- */
        const authVisual = document.querySelector('.auth-visual-content');
        if(authVisual) {
            gsap.from(authVisual, {
                x: -50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });
            gsap.from('.auth-form-container', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                delay: 0.3,
                ease: 'power3.out'
            });
        }
    }
});


/* --- dashboard.js --- */
/**
 * STACKLY - Dashboard Interactions (Admin & Client)
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Dashboard Custom CSS Charts Animation
    const animateCharts = () => {
        const chartBars = document.querySelectorAll('.chart-bar .fill');
        
        if(chartBars.length > 0 && typeof gsap !== 'undefined') {
            gsap.fromTo(chartBars, 
                { height: "0%" },
                { 
                    height: (index, target) => {
                        // For demo purposes, we randomly set heights if not specified via data attribute
                        const dataHeight = target.parentElement.getAttribute('data-height');
                        return dataHeight ? dataHeight + "%" : (Math.random() * 60 + 20) + "%";
                    },
                    duration: 1.5,
                    stagger: 0.1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: '.css-chart',
                        start: 'top 80%'
                    }
                }
            );
        }
    };
    
    animateCharts();

    // 2. Client Salary Breakdown Animation
    const salaryBars = document.querySelectorAll('.sb-segment');
    if(salaryBars.length > 0 && typeof gsap !== 'undefined') {
        gsap.from(salaryBars, {
            width: "0%",
            duration: 1.5,
            stagger: 0.2,
            ease: "power3.out",
            delay: 0.5
        });
    }

    // 3. Notification bell pulse
    const notifDot = document.querySelector('.notification-dot');
    if(notifDot && typeof gsap !== 'undefined') {
        gsap.to(notifDot, {
            scale: 1.2,
            opacity: 0.7,
            duration: 1,
            yoyo: true,
            repeat: -1
        });
    }

});


/* --- email-data.js --- */
/**
 * STACKLY - Dynamic Email Data Simulator
 */

const adminEmails = [
    {
        subject: "Payroll Approval Required",
        sender: "Finance Department",
        time: "10 min ago",
        unread: true,
        icon: "fa-solid fa-file-signature"
    },
    {
        subject: "Employee Bank Details Updated",
        sender: "HR Department",
        time: "28 min ago",
        unread: true,
        icon: "fa-solid fa-building-columns"
    },
    {
        subject: "Payroll Successfully Processed",
        sender: "System",
        time: "1 hour ago",
        unread: false,
        icon: "fa-solid fa-check-double"
    },
    {
        subject: "Tax Report Generated",
        sender: "Compliance",
        time: "3 hours ago",
        unread: false,
        icon: "fa-solid fa-file-invoice-dollar"
    }
];

const clientEmails = [
    {
        subject: "Your August Payslip Is Ready",
        sender: "Payroll System",
        time: "10 min ago",
        unread: true,
        icon: "fa-solid fa-file-invoice"
    },
    {
        subject: "Leave Request Approved",
        sender: "HR Department",
        time: "2 hours ago",
        unread: true,
        icon: "fa-solid fa-calendar-check"
    },
    {
        subject: "Payroll Processing Scheduled",
        sender: "Finance Team",
        time: "Yesterday",
        unread: false,
        icon: "fa-solid fa-clock"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    
    const emailListContainer = document.getElementById('dynamic-email-list');
    
    if (emailListContainer) {
        // Determine if admin or client based on data attribute on container
        const isClient = emailListContainer.getAttribute('data-type') === 'client';
        const data = isClient ? clientEmails : adminEmails;
        
        emailListContainer.innerHTML = ''; // Clear static fallback
        
        data.forEach((email, index) => {
            const el = document.createElement('div');
            el.className = `email-item ${email.unread ? 'unread' : ''}`;
            
            // For animation delay
            el.style.opacity = '0';
            el.style.transform = 'translateY(10px)';
            
            el.innerHTML = `
                <div class="email-icon"><i class="${email.icon}"></i></div>
                <div class="email-content">
                    <div class="email-subject">${email.subject}</div>
                    <div class="email-sender">${email.sender}</div>
                </div>
                <div class="email-time">${email.time}</div>
            `;
            
            emailListContainer.appendChild(el);
            
            // GSAP Entrance
            if(typeof gsap !== 'undefined') {
                gsap.to(el, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    delay: 0.1 * index,
                    ease: "power2.out"
                });
            } else {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    }
});


/* --- validation.js --- */
/**
 * STACKLY - Form Validation
 */

document.addEventListener('DOMContentLoaded', () => {
    
    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const validatePhone = (phone) => {
        return String(phone).match(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im);
    };

    const forms = document.querySelectorAll('.validate-form, form:not(.dashboard-form)');

    forms.forEach(form => {
        // Skip dashboard internal forms
        if (form.closest('.dashboard-layout') || form.closest('.dashboard-main')) {
            return;
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            
            const inputs = form.querySelectorAll('.form-control[required], input[required], select[required], textarea[required]');
            
            inputs.forEach(input => {
                const group = input.closest('.form-group') || input.parentElement;
                let errorMsg = group.querySelector('.error-message');
                if (!errorMsg && group.parentElement) {
                    errorMsg = group.parentElement.querySelector('.error-message');
                }
                let validField = true;
                
                // Clear previous
                group.classList.remove('error');
                if (errorMsg) errorMsg.innerText = 'This field is required';

                // Basic empty check
                if (input.value.trim() === '') {
                    validField = false;
                } else {
                    // Specific types
                    if (input.type === 'email' && !validateEmail(input.value)) {
                        validField = false;
                        if (errorMsg) errorMsg.innerText = 'Please enter a valid email address';
                    }
                    if (input.type === 'tel' && !validatePhone(input.value)) {
                        validField = false;
                        if (errorMsg) errorMsg.innerText = 'Please enter a valid phone number';
                    }
                    if (input.hasAttribute('minlength')) {
                        const min = parseInt(input.getAttribute('minlength'), 10);
                        if (input.value.trim().length < min) {
                            validField = false;
                            if (errorMsg) errorMsg.innerText = `Must be at least ${min} characters`;
                        }
                    }
                    if (input.id === 'password' && input.value.length < 8) {
                        validField = false;
                        if (errorMsg) errorMsg.innerText = 'Password must be at least 8 characters';
                    }
                    if (input.id === 'confirm-password') {
                        const pass = form.querySelector('#password');
                        if (pass && pass.value !== input.value) {
                            validField = false;
                            if (errorMsg) errorMsg.innerText = 'Passwords do not match';
                        }
                    }
                }

                if (!validField) {
                    group.classList.add('error');
                    isValid = false;
                }
            });

            if (isValid) {
                // Simulate form submission
                const btn = form.querySelector('button[type="submit"]') || form.querySelector('button');
                const originalText = btn ? btn.innerHTML : 'Submit';
                if (btn) {
                    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
                    btn.disabled = true;
                }
                
                setTimeout(() => {
                    const currentUrl = window.location.href.toLowerCase();
                    const isLoginPage = currentUrl.includes('login') || form.querySelector('#role') !== null;
                    const isSignupPage = currentUrl.includes('signup') || form.querySelector('#companyName') !== null;

                    if (isLoginPage) {
                        const emailInput = form.querySelector('#email');
                        if (emailInput && emailInput.value) {
                            const emailStr = emailInput.value;
                            const namePart = emailStr.split('@')[0];
                            const loginName = namePart.charAt(0).toUpperCase() + namePart.slice(1).replace(/\./g, ' ');
                            localStorage.setItem('loginEmail', emailStr);
                            localStorage.setItem('loginName', loginName);
                        }

                        const roleSelect = form.querySelector('#role');
                        if (roleSelect) {
                            const role = roleSelect.value;
                            if (role === 'admin') {
                                window.location.href = 'admin dashboard.html';
                                return;
                            } else if (role === 'user') {
                                window.location.href = 'client dashboard.html';
                                return;
                            }
                        }
                        window.location.href = 'admin dashboard.html';
                    } else if (isSignupPage) {
                        const fullName = form.querySelector('#fullName');
                        const emailInput = form.querySelector('#email');
                        if (fullName && fullName.value) {
                            localStorage.setItem('loginName', fullName.value);
                        }
                        if (emailInput && emailInput.value) {
                            localStorage.setItem('loginEmail', emailInput.value);
                        }
                        window.location.href = 'login.html';
                    } else {
                        // All other forms (e.g. Contact Us): after successful validation, redirect to 404 page!
                        window.location.href = '404.html';
                    }
                }, 1000);
            }
        });
        
        // Remove error state on input
        const inputs = form.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                const group = input.closest('.form-group') || input.parentElement;
                if (group) group.classList.remove('error');
            });
        });
    });

    // Password Visibility Toggle
    const togglePasswords = document.querySelectorAll('#toggle-password, .toggle-password');
    togglePasswords.forEach(toggle => {
        toggle.addEventListener('click', function (e) {
            // Find the input field relative to this toggle (usually the previous sibling)
            const passwordInput = this.previousElementSibling;
            if (passwordInput && passwordInput.tagName === 'INPUT') {
                // toggle the type attribute
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                // toggle the icon
                const icon = this.querySelector('i');
                if (icon) {
                    if (type === 'text') {
                        icon.classList.remove('fa-eye');
                        icon.classList.add('fa-eye-slash');
                    } else {
                        icon.classList.remove('fa-eye-slash');
                        icon.classList.add('fa-eye');
                    }
                }
            }
        });
    });
});

/* ==========================================================================
   UI Enhancements GSAP Initializations
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Page Transition
    document.body.classList.add('page-transition');
    
    // Smooth navigation transitions
    const links = document.querySelectorAll('a[href]:not([target="_blank"]):not([href^="#"])');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            if(link.hostname === window.location.hostname && !link.hasAttribute('download')) {
                e.preventDefault();
                const targetUrl = link.getAttribute('href');
                document.body.style.animation = 'fadeIn 0.5s ease-in-out reverse forwards';
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 400);
            }
        });
    });

    // --- GLOBAL 404 REDIRECTION ---
    // Rules:
    // 1. Fully EXCLUDED pages: Login page (login.html), Signup page (signup.html), 404 page (404.html).
    // 2. Dashboard pages (admin dashboard.html, client dashboard.html):
    //    - EXCLUDE ONLY: Sidebar menus (.sidebar, .sidebar-menu, .menu-link, .sidebar-brand) and mobile toggle (.dashboard-mobile-toggle).
    //    - ALL OTHER links, buttons, headers, notification bell, user profile, quick action buttons, table buttons redirect to 404.html!
    // 3. Marketing/Public pages:
    //    - EXCLUDE: Navbar & Navlinks, Footer links & brand, FAQ accordions, Form validation.
    //    - ALL OTHER buttons and links redirect to 404.html!
    const currentUrl = window.location.href.toLowerCase();
    const isDashboard = 
        currentUrl.includes('dashboard') || 
        currentUrl.includes('admin') || 
        currentUrl.includes('client') || 
        document.querySelector('.dashboard-layout') !== null;
        
    const isAuthOr404Page = 
        currentUrl.includes('login') || 
        currentUrl.includes('signup') || 
        currentUrl.includes('404');
    
    if (!isAuthOr404Page) {
        if (isDashboard) {
            // --- DASHBOARD PAGES REDIRECTION ---
            // Intercept all links and buttons except the sidebar menus and mobile sidebar toggle
            const dashElements = document.querySelectorAll('a, button, .notification-bell, .user-profile, .dash-panel.hover-glow, .glass-card.hover-zoom, form');
            dashElements.forEach(el => {
                // Keep sidebar menu items and mobile toggle functional
                if (el.closest('.sidebar') || el.classList.contains('dashboard-mobile-toggle') || el.closest('.dashboard-mobile-toggle')) {
                    return;
                }

                // If form, redirect on submit
                if (el.tagName === 'FORM') {
                    if (el.hasAttribute('onsubmit')) el.removeAttribute('onsubmit');
                    el.onsubmit = null;
                    el.addEventListener('submit', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.location.href = '404.html';
                    }, true);
                    return;
                }

                // Remove inline onclick
                if (el.hasAttribute('onclick')) {
                    el.removeAttribute('onclick');
                }
                el.onclick = null;

                if (el.tagName === 'A') {
                    el.href = '404.html';
                }

                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = '404.html';
                }, true);
            });

            // Global delegated click listener on dashboard to catch any other buttons or action elements
            document.addEventListener('click', (e) => {
                // Do not intercept sidebar navigation or mobile sidebar toggle
                if (e.target.closest('.sidebar') || e.target.closest('.dashboard-mobile-toggle')) {
                    return;
                }

                const clickable = e.target.closest('a, button, .notification-bell, .user-profile, .dash-panel, .glass-card, .btn, [onclick]');
                if (clickable) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = '404.html';
                }
            }, true);

        } else {
            // --- MARKETING / PUBLIC PAGES REDIRECTION ---
            const elements = document.querySelectorAll('a, button');
            elements.forEach(el => {
                // Exclude Navbar & Navlinks
                if (el.closest('.navbar') || el.closest('nav') || el.closest('.nav-links') || el.classList.contains('nav-link') || el.classList.contains('nav-brand') || el.classList.contains('mobile-toggle')) {
                    return;
                }
                
                // Exclude Footer
                if (el.closest('.footer') || el.closest('footer') || el.classList.contains('footer-brand') || el.closest('.footer-links') || el.closest('.footer-socials')) {
                    return;
                }

                // Exclude Accordion toggles and Password toggles
                if (el.closest('.accordion-header') || el.classList.contains('accordion-header') || el.closest('.accordion-item') || el.classList.contains('toggle-password') || el.id === 'toggle-password') {
                    return;
                }

                // Exclude Form submit buttons (they run form validation first!)
                if (el.closest('form') || el.type === 'submit') {
                    return;
                }
                
                // Remove inline onclick
                if (el.hasAttribute('onclick')) {
                    el.removeAttribute('onclick');
                }
                el.onclick = null;
                
                // Apply 404 Redirection
                if (el.tagName === 'A') {
                    el.href = '404.html';
                }
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = '404.html';
                }, true);
            });

            // Intercept interactive cards outside navbar, footer, and forms
            const divButtons = document.querySelectorAll('.dash-panel.hover-glow, .glass-card.hover-zoom');
            divButtons.forEach(el => {
                if (el.closest('.footer') || el.closest('footer') || el.closest('.navbar') || el.closest('nav') || el.closest('form') || el.closest('.accordion-item')) {
                    return;
                }
                if (el.hasAttribute('onclick')) {
                    el.removeAttribute('onclick');
                }
                el.onclick = null;
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = '404.html';
                }, true);
            });
        }
    }

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // 2. Timeline Reveal Animation
        const timelineItems = document.querySelectorAll('.timeline-item');
        if(timelineItems.length > 0) {
            gsap.fromTo(timelineItems, 
                { opacity: 0, y: 50 },
                {
                    opacity: 1, 
                    y: 0, 
                    duration: 0.8, 
                    stagger: 0.2,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.timeline',
                        start: 'top 80%'
                    }
                }
            );
        }
        
        // Animate Timeline vertical line drawing
        const timelines = document.querySelectorAll('.timeline');
        timelines.forEach(timeline => {
            gsap.fromTo(timeline, 
                { "--line-height": "0%" },
                {
                    "--line-height": "100%",
                    ease: "none",
                    scrollTrigger: {
                        trigger: timeline,
                        start: "top 60%",
                        end: "bottom 80%",
                        scrub: true
                    }
                }
            );
        });

        // 3. Progress Bars Animation
        const progressFills = document.querySelectorAll('.progress-fill');
        if(progressFills.length > 0) {
            progressFills.forEach(fill => {
                const targetWidth = fill.getAttribute('data-width');
                if(targetWidth) {
                    gsap.fromTo(fill,
                        { width: '0%' },
                        {
                            width: targetWidth,
                            duration: 1.5,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: fill,
                                start: 'top 85%'
                            }
                        }
                    );
                }
            });
        }
        
        // 4. Circular Progress Animation
        const circles = document.querySelectorAll('.circular-chart .circle');
        if(circles.length > 0) {
            circles.forEach(circle => {
                const percentage = circle.getAttribute('data-percentage');
                if(percentage) {
                    gsap.to(circle, {
                        strokeDasharray: `${percentage}, 100`,
                        duration: 1.5,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: circle,
                            start: 'top 85%'
                        }
                    });
                }
            });
        }

        // 5. Accordion Logic
        const accordions = document.querySelectorAll('.accordion-item');
        if(accordions.length > 0) {
            accordions.forEach(item => {
                const header = item.querySelector('.accordion-header');
                if(header) {
                    header.addEventListener('click', () => {
                        item.classList.toggle('active');
                        // Close others
                        accordions.forEach(other => {
                            if(other !== item) other.classList.remove('active');
                        });
                    });
                }
            });
        }
    }
});

// Global Dashboard Fix: Un-nest SPA views to ensure they are direct siblings of main
document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main.dashboard-main');
    if (main) {
        document.querySelectorAll('.spa-view').forEach(view => {
            main.appendChild(view);
        });
    }

    // Initialize Dashboard Header Dropdowns & User Profile
    initDashboardDropdowns();
});

// --- GLOBAL DROPDOWN TOGGLE HANDLERS ---
function toggleNotifDropdown(e, el) {
    if (e) {
        if (e.target && e.target.closest('.notification-dropdown')) return;
        e.stopPropagation();
    }
    const bell = el || document.querySelector('.notification-bell');
    if (!bell) return;
    const dropdown = bell.querySelector('.notification-dropdown');
    document.querySelectorAll('.profile-dropdown').forEach(d => d.classList.remove('active'));
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}
window.toggleNotifDropdown = toggleNotifDropdown;

function toggleProfileDropdown(e, el) {
    if (e) {
        if (e.target && e.target.closest('.profile-dropdown')) return;
        e.stopPropagation();
    }
    const profile = el || document.querySelector('.user-profile');
    if (!profile) return;
    const dropdown = profile.querySelector('.profile-dropdown');
    document.querySelectorAll('.notification-dropdown').forEach(d => d.classList.remove('active'));
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}
window.toggleProfileDropdown = toggleProfileDropdown;

// --- DASHBOARD NOTIFICATIONS & PROFILE DROPDOWN INITIALIZATION ---
function initDashboardDropdowns() {
    const notifBells = document.querySelectorAll('.notification-bell');
    const userProfiles = document.querySelectorAll('.user-profile');

    notifBells.forEach(bell => {
        bell.onclick = (e) => toggleNotifDropdown(e, bell);
    });

    userProfiles.forEach(profile => {
        profile.onclick = (e) => toggleProfileDropdown(e, profile);
    });

    // Close all dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.notification-bell')) {
            document.querySelectorAll('.notification-dropdown').forEach(d => d.classList.remove('active'));
        }
        if (!e.target.closest('.user-profile')) {
            document.querySelectorAll('.profile-dropdown').forEach(d => d.classList.remove('active'));
        }
    });

    // Mark all as read button
    document.querySelectorAll('.dropdown-mark-read').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.notification-dot').forEach(dot => dot.style.display = 'none');
            document.querySelectorAll('.notification-item.unread').forEach(item => item.classList.remove('unread'));
            document.querySelectorAll('.dropdown-header .badge').forEach(badge => badge.innerText = '0 New');
            showToast('All notifications marked as read', 'info');
        });
    });

    // --- UPDATE DASHBOARD PROFILE INFO FROM LOCALSTORAGE ---
    const loginEmail = localStorage.getItem('loginEmail');
    const loginName = localStorage.getItem('loginName');
    if (loginEmail && loginName) {
        const profileEmailEl = document.getElementById('profile-email');
        const profileNameEl = document.getElementById('profile-name');
        const profileAvatarEl = document.getElementById('profile-avatar');
        const welcomeNameEl = document.getElementById('welcome-name');
        const dropdownProfileName = document.getElementById('dropdown-profile-name');
        const dropdownProfileEmail = document.getElementById('dropdown-profile-email');

        if (profileEmailEl) profileEmailEl.innerText = loginEmail;
        if (profileNameEl) profileNameEl.innerText = loginName;
        if (profileAvatarEl) profileAvatarEl.innerText = loginName.charAt(0).toUpperCase();
        if (welcomeNameEl) {
            const firstName = loginName.split(' ')[0];
            welcomeNameEl.innerText = firstName;
        }
        if (dropdownProfileName) dropdownProfileName.innerText = loginName;
        if (dropdownProfileEmail) dropdownProfileEmail.innerText = loginEmail;
        document.querySelectorAll('.profile-dropdown .user-avatar').forEach(av => {
            av.innerText = loginName.charAt(0).toUpperCase();
        });
    }
}

// --- GLOBAL TOAST NOTIFICATION HELPER ---
function showToast(message, type = 'success') {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.cssText = 'position: fixed; bottom: 24px; right: 24px; z-index: 99999; display: flex; flex-direction: column; gap: 10px; pointer-events: none;';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    const bg = type === 'success' ? '#18A999' : (type === 'danger' ? '#E74C3C' : '#182B49');
    const icon = type === 'success' ? 'fa-circle-check' : (type === 'danger' ? 'fa-circle-exclamation' : 'fa-circle-info');
    
    toast.style.cssText = `background: ${bg}; color: #ffffff; padding: 12px 20px; border-radius: 8px; font-size: 0.875rem; font-weight: 500; display: flex; align-items: center; gap: 10px; box-shadow: 0 8px 25px rgba(0,0,0,0.2); animation: toastIn 0.3s ease; pointer-events: auto;`;
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- DASHBOARD INTERACTIVE ACTIONS ---
function simulateDownload(btn) {
    const icon = btn.querySelector ? btn.querySelector('i') : null;
    let originalClass = '';
    if (icon) {
        originalClass = icon.className;
        icon.className = 'fa-solid fa-spinner fa-spin';
    }
    setTimeout(() => {
        if (icon) {
            icon.className = 'fa-solid fa-check';
            icon.style.color = 'var(--accent)';
        }
        showToast('Document downloaded successfully!', 'success');
        setTimeout(() => {
            if (icon) {
                icon.className = originalClass;
                icon.style.color = '';
            }
        }, 1500);
    }, 1000);
}

function approveBatch(btn) {
    const row = btn.closest('tr');
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Approved';
    btn.style.background = '#2ecc71';
    btn.style.color = '#ffffff';
    btn.disabled = true;
    if (row) {
        const statusBadge = row.querySelector('td span');
        if (statusBadge) {
            statusBadge.innerHTML = '<i class="fa-solid fa-check-circle"></i> Approved';
            statusBadge.style.background = 'rgba(46, 204, 113, 0.1)';
            statusBadge.style.color = '#2ecc71';
        }
    }
    showToast('Payroll batch approved successfully!', 'success');
}

function approveAllBatches(btn) {
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Approving...';
    btn.disabled = true;
    setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-check-double"></i> All Approved';
        btn.style.background = '#2ecc71';
        document.querySelectorAll('#view-payroll-approval tbody tr').forEach(row => {
            const approveBtn = row.querySelector('button.hover-glow');
            if (approveBtn) {
                approveBtn.innerHTML = '<i class="fa-solid fa-check"></i> Approved';
                approveBtn.style.background = '#2ecc71';
                approveBtn.style.color = '#ffffff';
                approveBtn.disabled = true;
            }
            const statusBadge = row.querySelector('td span');
            if (statusBadge) {
                statusBadge.innerHTML = '<i class="fa-solid fa-check-circle"></i> Approved';
                statusBadge.style.background = 'rgba(46, 204, 113, 0.1)';
                statusBadge.style.color = '#2ecc71';
            }
        });
        showToast('All pending batches approved!', 'success');
    }, 1000);
}

function handleLeaveAction(btn, action) {
    const card = btn.closest('.glass-card') || btn.closest('.dash-panel') || btn.closest('div[style*="background"]');
    const isApprove = action === 'approved';
    if (btn.parentElement) {
        btn.parentElement.innerHTML = `<span style="color: ${isApprove ? '#2ecc71' : '#E74C3C'}; font-size: 0.875rem; font-weight: 600;"><i class="fa-solid ${isApprove ? 'fa-check-circle' : 'fa-circle-xmark'}"></i> ${isApprove ? 'Approved' : 'Rejected'}</span>`;
    }
    showToast(`Leave request ${action}!`, isApprove ? 'success' : 'danger');
}


