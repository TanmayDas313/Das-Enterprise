/**
 * HISAB KITAB - Core Interactive UI Logic
 * Powered by Das Enterprises | Tally Prime Solutions
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileDrawer();
  initAnimatedCounters();
  initTabs();
  initFaqAccordion();
  initPricingToggle();
  initTestimonials();
  initDemoModal();
  initFormValidation();
  initBackToTop();
  initResourceFilter();
  initProductSubtabs();
});

/* ==========================================================================
   1. STICKY HEADER SCROLL COMPACT
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   2. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.drawer-backdrop');
  const closeBtn = document.querySelector('.drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!toggleBtn || !drawer || !backdrop) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   3. ANIMATED COUNTERS FOR STATS
   ========================================================================== */
function initAnimatedCounters() {
  const statNumbers = document.querySelectorAll('.stat-count');
  if (!statNumbers.length) return;

  let hasAnimated = false;

  const animateCounters = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const duration = 1800;
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeOut * target);

        stat.textContent = currentVal.toLocaleString('en-IN');

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          stat.textContent = target.toLocaleString('en-IN');
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.25 });

  const statsSection = document.querySelector('.stats-banner') || document.querySelector('.stats-grid');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ==========================================================================
   4. INTERACTIVE TABS (Industries & Features)
   ========================================================================== */
function initTabs() {
  const tabContainers = document.querySelectorAll('.tabs-container');

  tabContainers.forEach(container => {
    const tabButtons = container.querySelectorAll('.tab-btn');
    const tabPanels = container.querySelectorAll('.tab-panel');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab');

        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPanel = container.querySelector(`#${targetId}`);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  });
}

/* ==========================================================================
   5. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Optional: close other open items for cleaner accordion
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('open')) {
          otherItem.classList.remove('open');
          const otherContent = otherItem.querySelector('.faq-content');
          if (otherContent) otherContent.style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        content.style.maxHeight = null;
      } else {
        item.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   6. PRICING BILLING TOGGLE (Monthly / Annual)
   ========================================================================== */
function initPricingToggle() {
  const toggle = document.querySelector('#pricingBillingToggle');
  if (!toggle) return;

  const priceElements = document.querySelectorAll('.price-val');
  const periodElements = document.querySelectorAll('.tier-period');

  const updatePrices = (isAnnual) => {
    priceElements.forEach(el => {
      const monthly = el.getAttribute('data-monthly');
      const annual = el.getAttribute('data-annual');
      el.textContent = isAnnual ? annual : monthly;
    });

    periodElements.forEach(el => {
      el.textContent = isAnnual ? '/ year (billed annually)' : '/ month (billed monthly)';
    });
  };

  toggle.addEventListener('change', () => {
    updatePrices(toggle.checked);
  });
}

/* ==========================================================================
   7. TESTIMONIALS CAROUSEL
   ========================================================================== */
function initTestimonials() {
  const track = document.querySelector('.testimonials-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');

  if (!slides.length || !dots.length) return;

  let currentIndex = 0;
  let autoPlayTimer = null;

  const goToSlide = (index) => {
    slides.forEach(s => s.style.display = 'none');
    dots.forEach(d => d.classList.remove('active'));

    currentIndex = (index + slides.length) % slides.length;
    slides[currentIndex].style.display = 'block';
    if (dots[currentIndex]) {
      dots[currentIndex].classList.add('active');
    }
  };

  const nextSlide = () => goToSlide(currentIndex + 1);
  const prevSlide = () => goToSlide(currentIndex - 1);

  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => goToSlide(idx));
  });

  // Start auto play
  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayTimer = setInterval(nextSlide, 6500);
  };

  const stopAutoPlay = () => {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
  };

  if (track) {
    track.addEventListener('mouseenter', stopAutoPlay);
    track.addEventListener('mouseleave', startAutoPlay);
  }

  goToSlide(0);
  startAutoPlay();
}

/* ==========================================================================
   8. DEMO MODAL SYSTEM
   ========================================================================== */
function initDemoModal() {
  const modal = document.querySelector('#demoModal');
  const openButtons = document.querySelectorAll('[data-open-modal="demoModal"], .btn-free-demo');
  const closeButton = modal ? modal.querySelector('.modal-close') : null;

  if (!modal) return;

  const openModal = (e) => {
    if (e) e.preventDefault();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  openButtons.forEach(btn => btn.addEventListener('click', openModal));
  if (closeButton) closeButton.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Modal Form Submission
  const modalForm = modal.querySelector('#modalDemoForm');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm(modalForm)) {
        closeModal();
        modalForm.reset();
        showToast('Demo Request Received! Our Tally Specialist will reach out within 2 business hours.');
      }
    });
  }
}

/* ==========================================================================
   9. FORM VALIDATION & FEEDBACK
   ========================================================================== */
function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

  inputs.forEach(input => {
    const value = input.value.trim();
    let fieldValid = true;

    if (!value) {
      fieldValid = false;
    } else if (input.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      fieldValid = emailRegex.test(value);
    } else if (input.type === 'tel' || input.name === 'phone') {
      const cleanPhone = value.replace(/[\s\-\+\(\)]/g, '');
      fieldValid = cleanPhone.length >= 10;
    }

    if (!fieldValid) {
      input.classList.add('error');
      isValid = false;
    } else {
      input.classList.remove('error');
    }

    input.addEventListener('input', () => {
      input.classList.remove('error');
    }, { once: true });
  });

  return isValid;
}

function initFormValidation() {
  const forms = document.querySelectorAll('.validated-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm(form)) {
        form.reset();
        showToast('Thank you! Your message has been received. A Hisab Kitab consultant will contact you shortly.');
      }
    });
  });
}

function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 4500);
}

/* ==========================================================================
   10. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backBtn = document.querySelector('.back-to-top');
  if (!backBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  }, { passive: true });

  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   11. RESOURCES LIVE FILTER & SEARCH
   ========================================================================== */
function initResourceFilter() {
  const searchInput = document.querySelector('#resourceSearchInput');
  const categoryButtons = document.querySelectorAll('.resource-cat-btn');
  const resourceCards = document.querySelectorAll('.resource-card');

  if (!resourceCards.length) return;

  let activeCategory = 'all';
  let searchTerm = '';

  const filterCards = () => {
    resourceCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const cardTitle = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
      const cardText = card.querySelector('.card-text')?.textContent.toLowerCase() || '';

      const matchesCat = activeCategory === 'all' || cardCategory === activeCategory;
      const matchesSearch = !searchTerm || cardTitle.includes(searchTerm) || cardText.includes(searchTerm);

      if (matchesCat && matchesSearch) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  };

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.toLowerCase().trim();
      filterCards();
    });
  }

  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category');
      filterCards();
    });
  });
}

/* ==========================================================================
   12. PRODUCT SUBTABS INTERACTION (PRICING DIRECTORY)
   ========================================================================== */
function initProductSubtabs() {
  const subtabLinks = document.querySelectorAll('.product-subtab-link');
  if (!subtabLinks.length) return;

  const sections = Array.from(subtabLinks).map(link => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return null;
    return document.getElementById(href.substring(1));
  }).filter(Boolean);

  subtabLinks.forEach(link => {
    link.addEventListener('click', () => {
      subtabLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  const onScroll = () => {
    const scrollPos = window.scrollY + 160;
    let currentId = '';

    for (const section of sections) {
      if (section.offsetTop <= scrollPos) {
        currentId = section.getAttribute('id');
      }
    }

    if (currentId) {
      subtabLinks.forEach(link => {
        const isMatch = link.getAttribute('href') === `#${currentId}`;
        link.classList.toggle('active', isMatch);
      });
    }
  };

  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
    scrollTimeout = requestAnimationFrame(onScroll);
  }, { passive: true });
}

