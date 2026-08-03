/* ==========================================================================
   NAIKIN.ID - AGENCY SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Modal Elements
  const modalOverlay = document.getElementById('contactModal');
  const modalClose = document.getElementById('modalClose');
  const triggerBtns = document.querySelectorAll('.open-contact-modal');
  const contactForm = document.getElementById('agencyContactForm');

  // Open Modal
  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modalOverlay) {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
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

  // Form Submit Handler
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Terima kasih! Pesan Anda telah terkirim ke tim Naikin.ID. Kami akan segera menghubungi Anda.');
      contactForm.reset();
      closeModal();
    });
  }
});
