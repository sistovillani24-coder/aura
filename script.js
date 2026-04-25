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
                // Una transizione leggerissima invece di 'none' smorza gli scatti (jitter)
                el.style.transition = 'transform 0.15s ease-out'; 
            });
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Gradi ridotti a 5 e scale3d a 1.04: lo scale compensa il tilt
                // in modo che il bordo della card non scappi via da sotto il cursore!
                const rotateX = ((y - centerY) / centerY) * -5; // max 5 deg
                const rotateY = ((x - centerX) / centerX) * 5;
                
                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
            });
            
            el.addEventListener('mouseleave', () => {
                el.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'; // Restore CSS transition
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
            if (window.innerWidth <= 768) {
                img.style.setProperty('--parallax-y', `0px`);
                return; // Disabilita l'effetto parallax su mobile per evitare bug di scorrimento
            }
            
            const rect = img.getBoundingClientRect();
            if(rect.top < window.innerHeight && rect.bottom > 0) {
                const yOffset = (rect.top - window.innerHeight/2) * 0.15;
                img.style.setProperty('--parallax-y', `${yOffset}px`);
            }
        });

        // Pinned Horizontal Scroll Logic
        const pinnedSections = document.querySelectorAll('.menu-pinned-section');
        
        pinnedSections.forEach(section => {
            const wrapper = section.querySelector('.menu-horizontal-wrapper');
            if (section && wrapper) {
                const rect = section.getBoundingClientRect();
                const maxScroll = section.offsetHeight - window.innerHeight;
                
                if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
                    // Inside the pinned area
                    const scrolledPast = Math.abs(rect.top);
                    const progress = scrolledPast / maxScroll; // 0 to 1
                    
                    // Calculate max translate
                    const wrapperWidth = wrapper.scrollWidth;
                    const maxTranslate = wrapperWidth - window.innerWidth + (window.innerWidth * 0.10); // Match 10vw padding
                    
                    wrapper.style.transform = `translate3d(-${progress * maxTranslate}px, 0, 0)`;
                } else if (rect.top > 0) {
                    wrapper.style.transform = `translate3d(0px, 0, 0)`;
                } else if (rect.bottom < window.innerHeight) {
                    const wrapperWidth = wrapper.scrollWidth;
                    const maxTranslate = wrapperWidth - window.innerWidth + (window.innerWidth * 0.10);
                    wrapper.style.transform = `translate3d(-${maxTranslate}px, 0, 0)`;
                }
            }
        });

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
    let logoMaxScale = 5; 
    let logoAnimDistance = window.innerHeight * 0.7; 

    function initLogoAnim() {
        if (!mainLogo) return;
        
        // Disabilita l'animazione del logo nelle pagine interne (es. menu.html)
        if (document.body.classList.contains('page-inner')) {
            mainLogo.style.transform = 'none';
            mainLogo.style.color = '';
            mainLogo.style.textShadow = '';
            return;
        }

        mainLogo.style.transform = 'none'; // reset to calculate natural position in navbar
        
        // Adattiamo la scala e la distanza dell'animazione per i dispositivi mobili
        if (window.innerWidth <= 768) {
            logoMaxScale = 2.5; 
            logoAnimDistance = window.innerHeight * 0.6; // Distanza aumentata per maggiore fluidità
        } else {
            logoMaxScale = 5;
            logoAnimDistance = window.innerHeight * 0.7;
        }
        
        // Use requestAnimationFrame to ensure layout is ready
        requestAnimationFrame(() => {
            const rect = mainLogo.getBoundingClientRect();
            const centerX = window.innerWidth / 2;
            
            // Su mobile posizioniamo il logo leggermente più in alto per non coprire il testo
            const verticalCenterRatio = window.innerWidth <= 768 ? 0.42 : 0.50;
            const centerY = window.innerHeight * verticalCenterRatio; 
            
            // The center of the logo's natural position
            const naturalCenterX = rect.left + rect.width / 2;
            const naturalCenterY = rect.top + rect.height / 2;
            
            logoMaxMoveX = centerX - naturalCenterX;
            logoMaxMoveY = centerY - naturalCenterY;
            
            lastRenderedScrollY = -1; // Forza il re-render immediato con i nuovi valori
        });
    }

    let isUpdatingLogo = false;
    let lastRenderedScrollY = -1;
    
    function renderLoop() {
        const scrolled = window.scrollY;
        
        if (scrolled !== lastRenderedScrollY) {
            lastRenderedScrollY = scrolled;
            
            // 1. Logo Animation
            if (mainLogo && !document.body.classList.contains('page-inner')) {
                let progress = scrolled / logoAnimDistance;
                if (progress > 1) progress = 1;
                if (progress < 0) progress = 0;
                
                const easeProgress = progress;
                
                const currentScale = 1 + (logoMaxScale - 1) * (1 - easeProgress);
                const currentX = logoMaxMoveX * (1 - easeProgress);
                const currentY = logoMaxMoveY * (1 - easeProgress);
                
                const r = Math.round(226 + (240 - 226) * easeProgress);
                const g = Math.round(182 + (240 - 182) * easeProgress);
                const b = Math.round(89 + (240 - 89) * easeProgress);
                
                const shadowOpacity = 0.6 * (1 - easeProgress);
                
                mainLogo.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(${currentScale})`;
                mainLogo.style.color = `rgb(${r}, ${g}, ${b})`;
                
                if (window.innerWidth > 768) {
                    mainLogo.style.textShadow = `0 0 40px rgba(226, 182, 89, ${shadowOpacity})`;
                } else {
                    mainLogo.style.textShadow = 'none';
                }
            }
        }
        
        requestAnimationFrame(renderLoop);
    }
    
    requestAnimationFrame(renderLoop);

    let lastWidth = window.innerWidth;
    window.addEventListener('resize', () => {
        // Evita bug su mobile quando la barra degli indirizzi scompare durante lo scroll
        if (window.innerWidth !== lastWidth) {
            lastWidth = window.innerWidth;
            initLogoAnim();
        }
    });
    
    if (document.fonts) {
        document.fonts.ready.then(initLogoAnim);
    } else {
        setTimeout(initLogoAnim, 100);
    }

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
            const method = document.getElementById('contact-method').value;
            
            const subject = `Nuova Prenotazione AURA: ${name}`;
            const body = `Dettagli Prenotazione:\n\nNome: ${name}\nData: ${date}\nOra: ${time}\nNumero di Ospiti: ${guests}`;
            
            const btn = form.querySelector('button');
            const originalText = btn.textContent;
            
            btn.style.backgroundColor = 'var(--accent)';
            btn.style.color = 'var(--bg-color)';
            
            if (method === 'whatsapp') {
                btn.textContent = 'Apertura WhatsApp...';
                const whatsappUrl = `https://wa.me/393454697846?text=${encodeURIComponent(body)}`;
                window.open(whatsappUrl, '_blank');
            } else {
                btn.textContent = 'Apertura Mail...';
                window.location.href = `mailto:frociovillani@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            }
            
            setTimeout(() => {
                form.reset();
                btn.textContent = originalText;
                btn.style.backgroundColor = 'transparent';
                btn.style.color = 'var(--accent)';
            }, 3000);
        });
    }
});
