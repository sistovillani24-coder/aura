document.addEventListener('DOMContentLoaded', () => {
    // 0. Preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hide');
        }, 800);
    }

    // 1. Initial Hero Animation
    setTimeout(() => {
        document.querySelector('.hero').classList.add('loaded');
    }, 100);

    // 2. Custom Cursor
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            // Slight delay for the follower
            setTimeout(() => {
                follower.style.left = e.clientX + 'px';
                follower.style.top = e.clientY + 'px';
            }, 50);
        });

        // Hover effects on clickable elements and advanced cursor
        const clickables = document.querySelectorAll('a, button, input, select');
        const viewables = document.querySelectorAll('.bento-item, .gallery-item, .image-box');

        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                follower.classList.add('active');
            });
            el.addEventListener('mouseleave', () => {
                follower.classList.remove('active');
            });
        });

        viewables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                follower.classList.add('view-mode');
                follower.setAttribute('data-text', 'VIEW');
                document.getElementById('cursor').style.opacity = '0'; // Hide the small dot
            });
            el.addEventListener('mouseleave', () => {
                follower.classList.remove('view-mode');
                follower.removeAttribute('data-text');
                document.getElementById('cursor').style.opacity = '1'; // Show the small dot
            });
        });
        
        // Magnetic Buttons Logic
        const magnetics = document.querySelectorAll('.btn-primary, .nav-item');
        magnetics.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transition = 'none';
            });
            btn.addEventListener('mousemove', function(e) {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.4}px)`;
            });
            btn.addEventListener('mouseleave', function(e) {
                btn.style.transition = ''; // Restore CSS transition
                btn.style.transform = `translate(0px, 0px)`;
            });
        });

        // 3D Tilt Logic for Bento & Gallery
        viewables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.transition = 'none'; // Prevent jitter
            });
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -12; // max 12 deg
                const rotateY = ((x - centerX) / centerX) * 12;
                
                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
            });
            
            el.addEventListener('mouseleave', () => {
                el.style.transition = ''; // Restore CSS transition
                el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });
        });

        // Text Splitter for Advanced Reveal
        const splitTexts = document.querySelectorAll('.scroll-reveal-text .text-inner');
        splitTexts.forEach(el => {
            const text = el.textContent;
            el.textContent = ''; // clear
            const words = text.split(' ');
            words.forEach((word, index) => {
                const mask = document.createElement('span');
                mask.className = 'word-mask';
                const inner = document.createElement('span');
                inner.className = 'word-inner';
                inner.style.transitionDelay = `${index * 0.05}s`;
                inner.textContent = word;
                mask.appendChild(inner);
                el.parentElement.appendChild(mask);
            });
            el.remove(); // Remove the original .text-inner wrapper
        });
    }

    // 3. Parallax Effect & Sticky Navbar
    const navbar = document.getElementById('navbar');
    const heroBg = document.querySelector('.hero-bg');
    const parallaxImages = document.querySelectorAll('.gallery-img, .image-box img');
    const marqueeSec = document.querySelector('.marquee-section');
    
    let lastScrollY = window.scrollY;
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        if (scrolled > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // The hero is now fixed via CSS, so we don't need JS parallax for it.

        // Parallax Images using CSS variables to avoid conflict with hover scale
        parallaxImages.forEach(img => {
            const rect = img.getBoundingClientRect();
            if(rect.top < window.innerHeight && rect.bottom > 0) {
                const yOffset = (rect.top - window.innerHeight/2) * 0.15;
                img.style.setProperty('--parallax-y', `${yOffset}px`);
            }
        });

        // Pinned Horizontal Scroll Logic
        const pinnedSection = document.querySelector('.menu-pinned-section');
        const wrapper = document.querySelector('.menu-horizontal-wrapper');
        
        if (pinnedSection && wrapper) {
            const rect = pinnedSection.getBoundingClientRect();
            const maxScroll = pinnedSection.offsetHeight - window.innerHeight;
            
            if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
                // Inside the pinned area
                const scrolledPast = Math.abs(rect.top);
                const progress = scrolledPast / maxScroll; // 0 to 1
                
                // Calculate max translate
                const wrapperWidth = wrapper.scrollWidth;
                const maxTranslate = wrapperWidth - window.innerWidth + (window.innerWidth * 0.10); // Match 10vw padding
                
                wrapper.style.transform = `translateX(-${progress * maxTranslate}px)`;
            } else if (rect.top > 0) {
                wrapper.style.transform = `translateX(0px)`;
            } else if (rect.bottom < window.innerHeight) {
                const wrapperWidth = wrapper.scrollWidth;
                const maxTranslate = wrapperWidth - window.innerWidth + (window.innerWidth * 0.10);
                wrapper.style.transform = `translateX(-${maxTranslate}px)`;
            }
        }

        // Update Dynamic Logo
        updateLogo();

        // Scroll Skew on Marquee
        if (marqueeSec) {
            const velocity = scrolled - lastScrollY;
            const skew = Math.max(-10, Math.min(10, velocity * 0.1));
            marqueeSec.style.transform = `skewY(${skew}deg)`;
            marqueeSec.style.transition = 'none';
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (marqueeSec) {
                marqueeSec.style.transform = `skewY(0deg)`;
                marqueeSec.style.transition = `transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)`;
            }
        }, 100);
        
        lastScrollY = scrolled;
    });

    // 4. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-item');
    const mobileMenu = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });
    
    // 0. Dynamic Logo Animation
    const mainLogo = document.querySelector('.logo');
    let logoMaxMoveX = 0;
    let logoMaxMoveY = 0;
    const logoMaxScale = 5; // Aumentato per maggiore impatto
    const logoAnimDistance = window.innerHeight * 0.7; // Finishes fading before hero ends

    function initLogoAnim() {
        if (!mainLogo) return;
        mainLogo.style.transform = 'none'; // reset to calculate natural position in navbar
        
        // Use requestAnimationFrame to ensure layout is ready
        requestAnimationFrame(() => {
            const rect = mainLogo.getBoundingClientRect();
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight * 0.50; // Perfettamente centrato verticalmente
            
            // The center of the logo's natural position
            const naturalCenterX = rect.left + rect.width / 2;
            const naturalCenterY = rect.top + rect.height / 2;
            
            logoMaxMoveX = centerX - naturalCenterX;
            logoMaxMoveY = centerY - naturalCenterY;
            
            updateLogo(); // apply initial state
        });
    }

    function updateLogo() {
        if (!mainLogo) return;
        const scrolled = window.scrollY;
        let progress = scrolled / logoAnimDistance;
        if (progress > 1) progress = 1;
        if (progress < 0) progress = 0;
        
        // Cubic ease-in-out or ease-out for smoother travel
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        const currentScale = 1 + (logoMaxScale - 1) * (1 - easeProgress);
        const currentX = logoMaxMoveX * (1 - easeProgress);
        const currentY = logoMaxMoveY * (1 - easeProgress);
        
        // Interpolazione colore da Giallo (226, 182, 89) a Bianco (240, 240, 240)
        const r = Math.round(226 + (240 - 226) * easeProgress);
        const g = Math.round(182 + (240 - 182) * easeProgress);
        const b = Math.round(89 + (240 - 89) * easeProgress);
        
        // Bagliore (Glow) che si dissolve scorrendo
        const shadowOpacity = 0.6 * (1 - easeProgress);
        
        mainLogo.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale})`;
        mainLogo.style.color = `rgb(${r}, ${g}, ${b})`;
        mainLogo.style.textShadow = `0 0 40px rgba(226, 182, 89, ${shadowOpacity})`;
    }

    window.addEventListener('resize', initLogoAnim);
    setTimeout(initLogoAnim, 100); // wait for fonts

    // 5. Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (lightbox) {
        document.querySelectorAll('.bento-item, .gallery-item, .image-box').forEach(el => {
            el.addEventListener('click', () => {
                const img = el.querySelector('img');
                if (img) {
                    lightboxImg.src = img.src;
                    lightbox.classList.add('active');
                    // Hide the custom cursor text temporarily so it doesn't overlap weirdly
                    document.getElementById('cursor-follower').classList.remove('view-mode');
                    document.getElementById('cursor-follower').removeAttribute('data-text');
                }
            });
        });

        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target !== lightboxImg) {
                lightbox.classList.remove('active');
            }
        });
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    // 5. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-text, .scroll-reveal-scale');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    };

    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 6. Form Submission & Email
    const form = document.getElementById('reservation-form');
    if (form) {
        // Imposta min e max per il campo data
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date();
            const yearLater = new Date();
            yearLater.setFullYear(today.getFullYear() + 1);
            
            const formatDate = (date) => date.toISOString().split('T')[0];
            
            dateInput.min = formatDate(today);
            dateInput.max = formatDate(yearLater);
            
            // Rendi l'intero campo cliccabile per aprire il calendario (anziché solo la piccola icona)
            dateInput.addEventListener('click', function() {
                try { this.showPicker(); } catch(e) {}
            });
        }
        
        const timeInput = document.getElementById('time');
        if (timeInput) {
            timeInput.addEventListener('click', function() {
                try { this.showPicker(); } catch(e) {}
            });
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const guests = document.getElementById('guests').value;
            
            // Costruisci il mailto link
            const subject = encodeURIComponent(`Nuova Prenotazione AURA: ${name}`);
            const body = encodeURIComponent(`Dettagli Prenotazione:\n\nNome: ${name}\nData: ${date}\nOra: ${time}\nNumero di Ospiti: ${guests}`);
            
            window.location.href = `mailto:frociovillani@gmail.com?subject=${subject}&body=${body}`;
            
            const btn = form.querySelector('button');
            const originalText = btn.textContent;
            
            btn.textContent = 'Apertura Mail...';
            btn.style.backgroundColor = 'var(--accent)';
            btn.style.color = 'var(--bg-color)';
            
            setTimeout(() => {
                form.reset();
                btn.textContent = originalText;
                btn.style.backgroundColor = 'transparent';
                btn.style.color = 'var(--accent)';
            }, 3000);
        });
    }
});
