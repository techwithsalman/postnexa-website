/**
 * PostNexa - Core Frontend JavaScript
 * Unified Navigation, Accessible Mega Menus, Mobile Drawer, Sliders, Accordions & Filter Studios
 * Parent Brand: Tech With Salman
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Sticky Header Scroll Indicator & Back To Top
  // -------------------------------------------------------------------------
  const header = document.querySelector('.sc-header');
  const backToTopBtn = document.querySelector('.sc-back-to-top');

  function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    
    if (header) {
      if (scrollY > 20) {
        header.classList.add('sc-header-scrolled');
      } else {
        header.classList.remove('sc-header-scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // -------------------------------------------------------------------------
  // 2. Desktop Mega Menus & Keyboard Accessibility
  // -------------------------------------------------------------------------
  const navItems = document.querySelectorAll('.sc-nav-item');

  function closeAllMegaMenus() {
    navItems.forEach(item => {
      item.classList.remove('is-open');
      const headBtn = item.querySelector('.sc-nav-head');
      if (headBtn && headBtn.hasAttribute('aria-expanded')) {
        headBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  navItems.forEach(item => {
    const headBtn = item.querySelector('.sc-nav-head');
    const menu = item.querySelector('.sc-mega-menu');

    if (!headBtn || !menu) return;

    let hoverTimeout = null;

    // Hover Enter
    item.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimeout);
      navItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('is-open');
          const otherBtn = other.querySelector('.sc-nav-head');
          if (otherBtn && otherBtn.hasAttribute('aria-expanded')) {
            otherBtn.setAttribute('aria-expanded', 'false');
          }
        }
      });
      item.classList.add('is-open');
      headBtn.setAttribute('aria-expanded', 'true');
    });

    // Hover Leave with slight debounce for natural cursor motion
    item.addEventListener('mouseleave', () => {
      hoverTimeout = setTimeout(() => {
        item.classList.remove('is-open');
        headBtn.setAttribute('aria-expanded', 'false');
      }, 120);
    });

    // Click toggle (for touch / keyboard)
    headBtn.addEventListener('click', (e) => {
      const isCurrentlyOpen = item.classList.contains('is-open');
      closeAllMegaMenus();
      if (!isCurrentlyOpen) {
        item.classList.add('is-open');
        headBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Global Outside Click to Dismiss Mega Menus
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.sc-nav-item')) {
      closeAllMegaMenus();
    }
  });

  // -------------------------------------------------------------------------
  // 3. Consolidated Mobile Navigation Drawer & Backdrop
  // -------------------------------------------------------------------------
  const mobileToggles = document.querySelectorAll('.sc-hamburger-btn, .sc-mobile-toggle, #scMobileToggle');
  const mobileDrawers = document.querySelectorAll('.sc-mobile-menu, .sc-mobile-drawer, #scMobileDrawer');
  const mobileCloses = document.querySelectorAll('.sc-mobile-close-btn, .sc-mobile-close, #scMobileClose');
  
  // Ensure a mobile backdrop exists in the DOM
  let backdrop = document.querySelector('.sc-mobile-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'sc-mobile-backdrop';
    document.body.appendChild(backdrop);
  }

  function openMobileDrawer() {
    mobileDrawers.forEach(d => d.classList.add('is-open'));
    mobileToggles.forEach(t => {
      t.classList.add('is-active');
      t.setAttribute('aria-expanded', 'true');
    });
    if (backdrop) backdrop.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    mobileDrawers.forEach(d => d.classList.remove('is-open'));
    mobileToggles.forEach(t => {
      t.classList.remove('is-active');
      t.setAttribute('aria-expanded', 'false');
    });
    if (backdrop) backdrop.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  mobileToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isAnyOpen = Array.from(mobileDrawers).some(d => d.classList.contains('is-open'));
      if (isAnyOpen) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });
  });

  mobileCloses.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMobileDrawer();
    });
  });

  if (backdrop) {
    backdrop.addEventListener('click', closeMobileDrawer);
  }

  // Mobile Submenu Accordions
  const mobileItems = document.querySelectorAll('.sc-mobile-item');
  mobileItems.forEach(item => {
    const trigger = item.querySelector('.sc-mobile-link-head');
    const submenu = item.querySelector('.sc-mobile-submenu');

    if (trigger && submenu) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isExpanded = item.classList.toggle('is-expanded');
        trigger.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      });
    }
  });

  // Close mobile nav when clicking any direct link inside drawer
  const mobileNavLinks = document.querySelectorAll('.sc-mobile-menu a:not(.sc-mobile-link-head), .sc-mobile-drawer a:not(.sc-mobile-link-head)');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileDrawer();
    });
  });

  // Global Escape key handler for all overlays
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllMegaMenus();
      closeMobileDrawer();
      closeModal();
    }
  });

  // -------------------------------------------------------------------------
  // 4. Hero Section Interactive Grid Canvas
  // -------------------------------------------------------------------------
  const gridCanvas = document.getElementById('gridCanvas');

  if (gridCanvas) {
    const COLS = 20;
    const ROWS = 14;
    const totalCells = COLS * ROWS;
    const cells = [];

    for (let i = 0; i < totalCells; i++) {
      const cell = document.createElement('div');
      cell.className = 'sc-grid-cell';
      gridCanvas.appendChild(cell);
      cells.push(cell);
    }

    // Interactive mouse trail over grid
    cells.forEach((cell, index) => {
      cell.addEventListener('mouseenter', () => {
        cell.classList.add('is-lit');
        
        // Light up adjacent neighbors gently
        const neighbors = [index - 1, index + 1, index - COLS, index + COLS];
        neighbors.forEach(nIdx => {
          if (cells[nIdx]) {
            cells[nIdx].classList.add('is-lit');
            setTimeout(() => {
              cells[nIdx].classList.remove('is-lit');
            }, 500);
          }
        });

        setTimeout(() => {
          cell.classList.remove('is-lit');
        }, 700);
      });
    });
  }

  // -------------------------------------------------------------------------
  // 5. Parallax Motion for Floating Hero Icons
  // -------------------------------------------------------------------------
  const heroSection = document.querySelector('.sc-hero-section');
  const floatingIcons = document.querySelectorAll('.sc-float-icon');

  if (heroSection && floatingIcons.length > 0) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) - rect.width / 2) / (rect.width / 2);
      const ny = ((e.clientY - rect.top) - rect.height / 2) / (rect.height / 2);

      floatingIcons.forEach((icon, idx) => {
        const factor = (idx % 3 + 1) * 7;
        icon.style.transform = `translate(${nx * factor}px, ${ny * factor}px)`;
      });
    });

    heroSection.addEventListener('mouseleave', () => {
      floatingIcons.forEach(icon => {
        icon.style.transform = '';
      });
    });
  }

  // -------------------------------------------------------------------------
  // 6. Testimonial Spotlight Carousel Slider
  // -------------------------------------------------------------------------
  const testimonials = [
    {
      quote: "PostNexa helped us grow our reach by 30% while making content planning, publishing, and client collaboration effortless.",
      highlight: "grow our reach by 30%",
      author: "Ashley Law-Smith",
      title: "CEO & Co-founder, The Startup Nerds",
      avatar: "assets/images/avatar-ashley.svg"
    },
    {
      quote: "PostNexa is the cleanest and most efficient platform that I've found for multi-account publishing and cross-network visibility.",
      highlight: "cleanest and most efficient platform",
      author: "Guy Kawasaki",
      title: "Author, Chief Evangelist, Speaker",
      avatar: "assets/images/avatar-guy.svg"
    },
    {
      quote: "It isn't just a usual scheduling tool — it satisfies your inner-geek, boosts team productivity, & ensures flawless execution.",
      highlight: "boosts team productivity",
      author: "Ian Anderson Gray",
      title: "Founder, Seriously Social",
      avatar: "assets/images/avatar-ian.svg"
    }
  ];

  let currentTestimonialIndex = 0;
  const quoteEl = document.querySelector('.sc-spotlight-quote');
  const authorNameEl = document.querySelector('.sc-spotlight-author-name');
  const authorTitleEl = document.querySelector('.sc-spotlight-author-title');
  const authorAvatarEl = document.querySelector('.sc-spotlight-avatar');
  const prevBtn = document.querySelector('.sc-spotlight-prev');
  const nextBtn = document.querySelector('.sc-spotlight-next');

  function renderTestimonial(index) {
    if (!quoteEl || !authorNameEl) return;
    const t = testimonials[index];
    
    quoteEl.style.opacity = '0';
    quoteEl.style.transform = 'translateY(6px)';
    
    setTimeout(() => {
      quoteEl.innerHTML = t.quote.replace(t.highlight, `<span>${t.highlight}</span>`);
      authorNameEl.textContent = t.author;
      if (authorTitleEl) authorTitleEl.textContent = t.title;
      if (authorAvatarEl) authorAvatarEl.src = t.avatar;
      
      quoteEl.style.opacity = '1';
      quoteEl.style.transform = 'translateY(0)';
      quoteEl.style.transition = 'all 0.3s ease';
    }, 200);
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
      renderTestimonial(currentTestimonialIndex);
    });

    nextBtn.addEventListener('click', () => {
      currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
      renderTestimonial(currentTestimonialIndex);
    });

    setInterval(() => {
      currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
      renderTestimonial(currentTestimonialIndex);
    }, 7000);
  }

  // -------------------------------------------------------------------------
  // 7. Audience / Use Case Tabbed Showcase
  // -------------------------------------------------------------------------
  const tabButtons = document.querySelectorAll('.sc-audience-tab-btn');
  const tabPanes = document.querySelectorAll('.sc-audience-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('is-active'));
      tabPanes.forEach(pane => pane.classList.remove('is-active'));

      btn.classList.add('is-active');
      const activePane = document.getElementById(targetTab);
      if (activePane) {
        activePane.classList.add('is-active');
      }
    });
  });

  // -------------------------------------------------------------------------
  // 8. Frequently Asked Questions (Accordion)
  // -------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.sc-faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.sc-faq-trigger');
    const content = item.querySelector('.sc-faq-content');

    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('is-open');
          const otherTrigger = otherItem.querySelector('.sc-faq-trigger');
          const otherContent = otherItem.querySelector('.sc-faq-content');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherContent) otherContent.style.maxHeight = null;
        }
      });

      if (!isOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 40 + 'px';
      } else {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
      }
    });

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger.click();
      }
    });
  });

  // -------------------------------------------------------------------------
  // 9. Video Demo Modal
  // -------------------------------------------------------------------------
  const modalTrigger = document.querySelector('.sc-showcase-play-badge');
  const modalOverlay = document.querySelector('.sc-modal-overlay');
  const modalCloseBtn = document.querySelector('.sc-modal-close-btn');

  function openModal() {
    if (modalOverlay) {
      modalOverlay.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  if (modalTrigger) modalTrigger.addEventListener('click', openModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // -------------------------------------------------------------------------
  // 10. Cookie Notice Dismissal & Storage
  // -------------------------------------------------------------------------
  const cookieNotice = document.querySelector('.sc-cookie-notice');
  const cookieAcceptBtn = document.querySelector('.sc-cookie-btn');

  if (cookieNotice && cookieAcceptBtn) {
    if (localStorage.getItem('sc_cookie_accepted') === 'true') {
      cookieNotice.classList.add('is-hidden');
    }

    cookieAcceptBtn.addEventListener('click', () => {
      cookieNotice.classList.add('is-hidden');
      localStorage.setItem('sc_cookie_accepted', 'true');
    });
  }

  // -------------------------------------------------------------------------
  // 11. Interactive Signup & Newsletter Form Submissions
  // -------------------------------------------------------------------------
  const heroForm = document.querySelector('.sc-hero-form');
  const newsletterForm = document.querySelector('.sc-newsletter-form');

  if (heroForm) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = heroForm.querySelector('.sc-hero-input');
      const submitBtn = heroForm.querySelector('.sc-hero-submit');
      if (!input || !input.value.trim()) return;

      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Creating Account... ✓';
      submitBtn.style.backgroundColor = '#10B981';

      setTimeout(() => {
        alert(`Welcome to PostNexa! Your free trial account has been prepared for: ${input.value}`);
        submitBtn.innerHTML = originalText;
        submitBtn.style.backgroundColor = '';
        input.value = '';
      }, 700);
    });
  }

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('.sc-newsletter-input');
      const btn = newsletterForm.querySelector('button[type="submit"]');
      if (!input || !input.value.trim()) return;

      const origText = btn.textContent;
      btn.textContent = 'Subscribed! ✓';
      btn.style.backgroundColor = '#10B981';

      setTimeout(() => {
        btn.textContent = origText;
        btn.style.backgroundColor = '';
        input.value = '';
      }, 1500);
    });
  }

  // Contact Form Netlify AJAX Submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const statusDiv = document.getElementById('contactFormStatus');
      const submitBtn = document.getElementById('contactSubmitBtn') || contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Inquiry ➔';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending Inquiry...';
      }

      const formData = new FormData(contactForm);

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      })
      .then((response) => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
        if (statusDiv) {
          statusDiv.style.display = 'block';
          statusDiv.style.backgroundColor = '#ecfdf5';
          statusDiv.style.color = '#065f46';
          statusDiv.style.border = '1px solid #a7f3d0';
          statusDiv.innerHTML = '<strong>Inquiry Sent!</strong> Thank you for reaching out. The PostNexa support team will get back to you within 24–48 hours.';
        }
        contactForm.reset();
      })
      .catch((err) => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
        if (statusDiv) {
          statusDiv.style.display = 'block';
          statusDiv.style.backgroundColor = '#fef2f2';
          statusDiv.style.color = '#991b1b';
          statusDiv.style.border = '1px solid #fecaca';
          statusDiv.innerHTML = '<strong>Submission Notice:</strong> Unable to process automatically right now. Please email our team directly at <strong>support@techwithsalman.online</strong>.';
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // 12. Pricing Billing Switcher (Monthly / Annual)
  // -------------------------------------------------------------------------
  const monthlyBtn = document.getElementById('billingMonthly');
  const annualBtn = document.getElementById('billingAnnual');
  const priceElements = document.querySelectorAll('.sc-plan-price[data-monthly]');

  if (monthlyBtn && annualBtn) {
    monthlyBtn.addEventListener('click', () => {
      monthlyBtn.classList.add('is-active');
      annualBtn.classList.remove('is-active');
      priceElements.forEach(el => {
        el.textContent = el.getAttribute('data-monthly');
      });
    });

    annualBtn.addEventListener('click', () => {
      annualBtn.classList.add('is-active');
      monthlyBtn.classList.remove('is-active');
      priceElements.forEach(el => {
        el.textContent = el.getAttribute('data-annual');
      });
    });
  }

  // -------------------------------------------------------------------------
  // 13. Interactive Category Filter Tabs
  // -------------------------------------------------------------------------
  const filterButtons = document.querySelectorAll('.sc-filter-tab-btn');
  const filterCards = document.querySelectorAll('[data-category]');

  if (filterButtons.length > 0 && filterCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        const category = btn.getAttribute('data-filter');
        filterCards.forEach(card => {
          if (category === 'all' || card.getAttribute('data-category').includes(category)) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // -------------------------------------------------------------------------
  // 14. Live Search Filter for Blog & Help Center
  // -------------------------------------------------------------------------
  const searchInput = document.querySelector('.sc-blog-search-input');
  const searchableCards = document.querySelectorAll('.sc-blog-card, .sc-search-item');

  if (searchInput && searchableCards.length > 0) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      searchableCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(query)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  console.log('PostNexa (Tech With Salman) initialized successfully.');
});
