/**
 * PostNexa - Core Frontend JavaScript
 * Interactions, Mega Menus, Sliders, Accordions, Modal & Grid Canvas Effects
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Sticky Header Scroll Indicator
  // -------------------------------------------------------------------------
  const header = document.querySelector('.sc-header');
  const backToTopBtn = document.querySelector('.sc-back-to-top');

  function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    
    if (header) {
      if (scrollY > 30) {
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
  // 2. Desktop Mega Menus & Keyboard Navigation
  // -------------------------------------------------------------------------
  const navItems = document.querySelectorAll('.sc-nav-item');

  navItems.forEach(item => {
    const headBtn = item.querySelector('.sc-nav-head');
    const menu = item.querySelector('.sc-mega-menu');

    if (!headBtn || !menu) return;

    // Hover in / out
    item.addEventListener('mouseenter', () => {
      closeAllMegaMenus();
      item.classList.add('is-open');
      headBtn.setAttribute('aria-expanded', 'true');
    });

    item.addEventListener('mouseleave', () => {
      item.classList.remove('is-open');
      headBtn.setAttribute('aria-expanded', 'false');
    });

    // Click toggle (for touch/keyboard)
    headBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = item.classList.contains('is-open');
      closeAllMegaMenus();
      if (!isOpen) {
        item.classList.add('is-open');
        headBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  function closeAllMegaMenus() {
    navItems.forEach(item => {
      item.classList.remove('is-open');
      const headBtn = item.querySelector('.sc-nav-head');
      if (headBtn) headBtn.setAttribute('aria-expanded', 'false');
    });
  }

  // Close menus when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.sc-nav-item')) {
      closeAllMegaMenus();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllMegaMenus();
      closeModal();
    }
  });

  // -------------------------------------------------------------------------
  // 3. Mobile Navigation Drawer & Accordion Submenus
  // -------------------------------------------------------------------------
  const hamburgerBtn = document.querySelector('.sc-hamburger-btn');
  const mobileMenu = document.querySelector('.sc-mobile-menu');
  const mobileItems = document.querySelectorAll('.sc-mobile-item');

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isActive = hamburgerBtn.classList.toggle('is-active');
      mobileMenu.classList.toggle('is-open', isActive);
      hamburgerBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Mobile submenu accordions
    mobileItems.forEach(item => {
      const trigger = item.querySelector('.sc-mobile-link-head');
      const submenu = item.querySelector('.sc-mobile-submenu');

      if (trigger && submenu) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          const isExpanded = item.classList.toggle('is-expanded');
          trigger.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        });
      }
    });

    // Close mobile nav when clicking any regular link
    const mobileLinks = mobileMenu.querySelectorAll('a:not(.sc-mobile-link-head)');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('is-active');
        mobileMenu.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

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
            }, 600);
          }
        });

        setTimeout(() => {
          cell.classList.remove('is-lit');
        }, 800);
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
        const factor = (idx % 3 + 1) * 8;
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
      quote: "Social Champ helped us grow our reach by 30% while making content planning, publishing, and client collaboration effortless.",
      highlight: "grow our reach by 30%",
      author: "Ashley Law-Smith",
      title: "CEO & Co-founder, The Startup Nerds",
      avatar: "assets/images/avatar-ashley.svg"
    },
    {
      quote: "Social Champ is the cleanest and most efficient tool that I've found for multi-account publishing and client visibility.",
      highlight: "cleanest and most efficient tool",
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
    
    // Smooth fade
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

    // Auto-advance testimonial every 7 seconds
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

      // Close all other accordion items for clean single-view accordion
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

    // Keyboard support for accessibility
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
      }, 2500);
    });
  }

  console.log('PostNexa (Social Champ Inspired) initialized successfully.');
});
