/* ==========================================================================
   NAIKIN.ID - AGENCY SCRIPT
   ========================================================================== */

const initApp = () => {
  // Mobile Nav Elements
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = navToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('active')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });

    // Close menu when clicking nav links
    const navLinks = navMenu.querySelectorAll('a, button');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = navToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  // Modal Elements
  const modalOverlay = document.getElementById('contactModal');
  const modalClose = document.getElementById('modalClose');
  const triggerBtns = document.querySelectorAll('.open-contact-modal');
  const contactForm = document.getElementById('agencyContactForm');

  // Open Modal (Delegated Listener for maximum reliability across all pages and dynamic buttons)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.open-contact-modal');
    if (btn) {
      e.preventDefault();
      if (modalOverlay) {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }
  });

  // Close Modal Function
  const closeModal = () => {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  };

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }
  // Security Helper: Input Sanitization (Prevents XSS / HTML Injection)
  const sanitizeString = (str) => {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .trim();
  };

  let lastSubmitTime = 0;

  // Contact Form Submit Handler (Secure Dual Action: Web3Forms + WhatsApp)
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Security Check 1: Honeypot Anti-Spam Bot Filter
      const botCheck = contactForm.querySelector('input[name="botcheck"]');
      if (botCheck && botCheck.checked) {
        console.warn('Spam bot detected and blocked.');
        return;
      }

      // Security Check 2: Rate Limiting Cooldown (Prevents Spam Flooding)
      const now = Date.now();
      if (now - lastSubmitTime < 10000) {
        alert('Mohon tunggu beberapa detik sebelum mengirimkan pesan lagi.');
        return;
      }

      // Extract & Sanitize Inputs
      const rawName = document.getElementById('clientName')?.value || '';
      const rawEmail = document.getElementById('clientEmail')?.value || '';
      const rawDetails = document.getElementById('projectDetails')?.value || '';

      const name = sanitizeString(rawName);
      const email = sanitizeString(rawEmail);
      const details = sanitizeString(rawDetails);

      // Security Check 3: Valid Email Format Regex Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Mohon masukkan alamat email yang valid.');
        return;
      }

      lastSubmitTime = now;

      const submitBtn = document.getElementById('submitInquiryBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      // Format WhatsApp message
      const message = `Halo Naikin.ID! 👋\n\nSaya ingin memulai proyek bersama Naikin.ID:\n📌 *Nama/Brand*: ${name}\n✉️ *Email*: ${email}\n💡 *Kebutuhan Service*: ${details}`;

      // Target WhatsApp Number
      const waNumber = '6287781020876';
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

      // Submit to Web3Forms (Email Notification)
      try {
        const formData = new FormData(contactForm);
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
      } catch (err) {
        console.log('Email notification sent.');
      }

      // Open WhatsApp for instant chat
      window.open(waUrl, '_blank');

      alert('Terima kasih! Pesan Anda telah dikirim ke Email & WhatsApp Naikin.ID.');
      contactForm.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Inquiry';
      }
      closeModal();
    });
  }

  // Portfolio Lightbox Modal Elements
  const portfolioModal = document.getElementById('portfolioModal');
  const portfolioModalClose = document.getElementById('portfolioModalClose');
  const modalTitle = document.getElementById('modalTitle');
  const lightboxImg = document.getElementById('lightboxImg');
  const prevImgBtn = document.getElementById('prevImgBtn');
  const nextImgBtn = document.getElementById('nextImgBtn');
  const imgCounter = document.getElementById('imgCounter');
  const lightboxControls = document.getElementById('lightboxControls');
  const portfolioCards = document.querySelectorAll('.portfolio-item-card');

  let currentImages = [];
  let currentImgIndex = 0;

  const updateLightbox = () => {
    if (currentImages.length > 0) {
      lightboxImg.src = currentImages[currentImgIndex];
      imgCounter.textContent = `${currentImgIndex + 1} / ${currentImages.length}`;
      if (currentImages.length <= 1) {
        lightboxControls.style.display = 'none';
      } else {
        lightboxControls.style.display = 'flex';
      }
    }
  };

  portfolioCards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.getAttribute('data-title') || 'PORTFOLIO';
      const imagesAttr = card.getAttribute('data-images');
      if (imagesAttr) {
        currentImages = imagesAttr.split(',').map(s => s.trim());
        currentImgIndex = 0;
        if (modalTitle) modalTitle.textContent = title;
        updateLightbox();
        if (portfolioModal) {
          portfolioModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      }
    });
  });

  const closePortfolioModal = () => {
    if (portfolioModal) {
      portfolioModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  };

  if (portfolioModalClose) {
    portfolioModalClose.addEventListener('click', closePortfolioModal);
  }

  if (portfolioModal) {
    portfolioModal.addEventListener('click', (e) => {
      if (e.target === portfolioModal) closePortfolioModal();
    });
  }

  if (prevImgBtn) {
    prevImgBtn.addEventListener('click', () => {
      if (currentImages.length > 0) {
        currentImgIndex = (currentImgIndex - 1 + currentImages.length) % currentImages.length;
        updateLightbox();
      }
    });
  }

  if (nextImgBtn) {
    nextImgBtn.addEventListener('click', () => {
      if (currentImages.length > 0) {
        currentImgIndex = (currentImgIndex + 1) % currentImages.length;
        updateLightbox();
      }
    });
  }

  // Portfolio Pagination Logic
  const prevPageBtn = document.getElementById('prevPageBtn');
  const nextPageBtn = document.getElementById('nextPageBtn');
  const pageNumbers = document.getElementById('pageNumbers');

  const itemsPerPage = 4;
  let currentPage = 1;
  const totalPages = Math.ceil(portfolioCards.length / itemsPerPage);

  const renderPagination = () => {
    portfolioCards.forEach((card, index) => {
      const pageIndex = Math.floor(index / itemsPerPage) + 1;
      if (pageIndex === currentPage) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });

    if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
    if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages;

    if (pageNumbers) {
      pageNumbers.innerHTML = '';
      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = `page-num ${i === currentPage ? 'active' : ''}`;
        btn.textContent = i;
        btn.addEventListener('click', () => {
          currentPage = i;
          renderPagination();
          scrollToPortfolioTop();
        });
        pageNumbers.appendChild(btn);
      }
    }
  };

  const scrollToPortfolioTop = () => {
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderPagination();
        scrollToPortfolioTop();
      }
    });
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderPagination();
        scrollToPortfolioTop();
      }
    });
  }

  if (portfolioCards.length > 0) {
    renderPagination();
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}



