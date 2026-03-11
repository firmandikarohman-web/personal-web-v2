document.addEventListener("DOMContentLoaded", () => {

    // --- 1. Mobile Menu Toggle ---
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    menuBtn.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        if (navLinksContainer.classList.contains('active')) {
            menuBtn.innerHTML = '<i data-feather="x"></i>';
        } else {
            menuBtn.innerHTML = '<i data-feather="menu"></i>';
        }
        feather.replace();
    });

    // Close menu when a link is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
                menuBtn.innerHTML = '<i data-feather="menu"></i>';
                feather.replace();
            }
        });
    });


    // --- 2. Parallax Blobs ---
    const blobWrapper = document.getElementById('blobWrapper');
    let rafId;

    window.addEventListener('scroll', () => {
        if (blobWrapper) {
            // Use requestAnimationFrame for smoother performance
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                // Sangat lambat dan halus
                blobWrapper.style.transform = `translateY(${scrolled * 0.15}px)`;
            });
        }
    });

    // --- 3. Enhanced Reveal Animation (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal-stagger');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
                // Biarkan elemen "menjauh" (pudar) saat tidak terlihat
                // Ini memberikan efek mengalir saat scrolling
                entry.target.classList.remove('in-view');
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
    });

    revealElements.forEach((el) => {
        // Otomatisasi stagger delay berdasarkan posisi dalam grup
        if (el.parentElement.classList.contains('fluid-icons') ||
            el.parentElement.classList.contains('bento-grid') ||
            el.parentElement.classList.contains('minimal-book-list')) {
            const index = Array.from(el.parentElement.children).indexOf(el);
            el.style.transitionDelay = `${index * 0.1}s`;
        }

        revealObserver.observe(el);
    });

    // Trigger hero animation immediately since it's above fold
    setTimeout(() => {
        const heroElements = document.querySelectorAll('#home .reveal-stagger');
        heroElements.forEach(el => el.classList.add('in-view'));
    }, 100);


    // --- 4. Magnetic Hover Effect ---
    const initMagneticEffects = () => {
        if (window.matchMedia("(pointer: fine)").matches) {
            const magneticElements = document.querySelectorAll('.magnetic, .magnetic-row');

            magneticElements.forEach(elem => {
                // Remove existing listener if any to avoid duplicates
                elem.removeEventListener('mousemove', handleMagneticMove);
                elem.removeEventListener('mouseleave', handleMagneticLeave);

                elem.addEventListener('mousemove', handleMagneticMove);
                elem.addEventListener('mouseleave', handleMagneticLeave);
            });
        }
    };

    function handleMagneticMove(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const strength = this.classList.contains('magnetic-row') ? 0.05 : 0.3;
        const deltaX = (x - centerX) * strength;
        const deltaY = (y - centerY) * strength;

        let scale = this.classList.contains('fluid-icon') ? 1.1 : 1.0;
        this.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scale})`;
    }

    function handleMagneticLeave() {
        this.style.transform = ``;
    }

    initMagneticEffects();

    // --- 5. Sticky Nav Background on Scroll ---
    const nav = document.querySelector('.sticky-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // --- 6. Scroll Spy ---
    const sections = document.querySelectorAll('.section-scroll');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // --- 7. Dynamic Data Connection ---
    // --- 7. Reusable Carousel Handler ---
    class CarouselHandler {
        constructor(containerId, data, renderItemFn) {
            this.container = document.getElementById(containerId);
            if (!this.container) return;
            this.wrapper = this.container.parentElement;
            this.data = data;
            this.renderItemFn = renderItemFn;
            this.currentIndex = 0;
            this.interval = null;
            this.init();
        }

        init() {
            this.render();
            this.startAutoSlide();
            this.setupNavigation();
            this.setupHoverPause();
        }

        render() {
            this.container.innerHTML = this.data.map((item, index) => this.renderItemFn(item, index)).join('');
            feather.replace();
        }

        startAutoSlide() {
            if (this.interval) clearInterval(this.interval);
            this.interval = setInterval(() => this.next(), 2000); // 2 seconds
        }

        next() {
            this.currentIndex = (this.currentIndex + 1) % this.data.length;
            this.updateSlider();
        }

        prev() {
            this.currentIndex = (this.currentIndex - 1 + this.data.length) % this.data.length;
            this.updateSlider();
        }

        updateSlider() {
            this.container.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        }

        setupNavigation() {
            const prevBtn = this.wrapper.querySelector('.nav-btn.prev');
            const nextBtn = this.wrapper.querySelector('.nav-btn.next');

            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.prev();
                    this.startAutoSlide();
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.next();
                    this.startAutoSlide();
                });
            }
        }

        setupHoverPause() {
            this.wrapper.addEventListener('mouseenter', () => clearInterval(this.interval));
            this.wrapper.addEventListener('mouseleave', () => this.startAutoSlide());
        }
    }

    // --- 8. Dynamic Data Connection ---
    const fetchData = async () => {
        try {
            const response = await fetch('data/data.json');
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();

            // Setup Certifications Carousel
            new CarouselHandler('certifications-list', data.certifications, (cert) => `
                <a href="${cert.link}" target="_blank" class="carousel-item">
                    <div class="carousel-image-container">
                        <img src="${cert.image || 'https://via.placeholder.com/400x225?text=Certificate'}" 
                             alt="${cert.title}" class="carousel-image"
                             onerror="this.src='https://via.placeholder.com/400x225?text=Certificate'">
                    </div>
                    <div class="carousel-info">
                        <h4>${cert.title}</h4>
                        <span>${cert.issuer}</span>
                    </div>
                </a>
            `);

            // Setup Activities Carousel
            new CarouselHandler('activities-list', data.activities, (act) => `
                <div class="carousel-item">
                    <div class="carousel-image-container">
                        <img src="${act.image || 'https://via.placeholder.com/400x225?text=Activity'}" 
                             alt="${act.title}" class="carousel-image"
                             onerror="this.src='https://via.placeholder.com/400x225?text=Activity'">
                    </div>
                    <div class="carousel-info">
                        <p class="date">${act.date}</p>
                        <h4>${act.title}</h4>
                        <p>${act.location}</p>
                    </div>
                </div>
            `);

            // Setup Projects Carousel
            new CarouselHandler('projects-list', data.projects, (project) => `
                <a href="${project.link}" target="_blank" class="carousel-item project-item">
                    <div class="carousel-image-container">
                        <img src="${project.image || 'https://via.placeholder.com/400x225?text=Project'}" 
                             alt="${project.title}" class="carousel-image"
                             onerror="this.src='https://via.placeholder.com/400x225?text=Project'">
                    </div>
                    <div class="carousel-info">
                        <h4>${project.title}</h4>
                        <p>${project.description}</p>
                    </div>
                </a>
            `);

            renderReadingList(data.readingList);

            // Re-initialize for new elements
            feather.replace();
            initMagneticEffects();

        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const renderReadingList = (books) => {
        const container = document.getElementById('reading-list-container');
        if (!container) return;

        container.innerHTML = books.map((book, index) => `
            <li class="minimal-book-item magnetic-row reveal-stagger">
                <div class="book-primary">
                    <h4>${book.title}</h4>
                    <p class="book-author">${book.author}</p>
                </div>
                <div class="book-reveal-detail">
                    <p class="rating">${book.rating}</p>
                    <p class="review">${book.review}</p>
                </div>
                ${book.cover ? `<img src="${book.cover}" alt="${book.title}" class="book-cover-preview" loading="lazy"/>` : ''}
            </li>
        `).join('');

        observeElements(container);
    };

    const observeElements = (container) => {
        const elements = container.querySelectorAll('.reveal-stagger');
        elements.forEach((el, index) => {
            el.style.transitionDelay = `${index * 0.1}s`;
            revealObserver.observe(el);
        });
    };

    // Start fetching
    fetchData();

});