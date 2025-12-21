// Scroll animation observer
document.addEventListener('DOMContentLoaded', function () {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
  animatedElements.forEach(el => observer.observe(el));

  const backToTopButton = document.getElementById('back-to-top');
  window.addEventListener('scroll', function () {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add('show');
    } else {
      backToTopButton.classList.remove('show');
    }
  });

  backToTopButton.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  const navLinks = document.querySelectorAll('.nav a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Hash update on scroll
  const hashObserverOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -50% 0px'
  };

  const hashObserver = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.target.id) {
        // Update hash without reloading
        window.history.replaceState(null, null, '#' + entry.target.id);
      }
    });
  }, hashObserverOptions);

  // Observe all sections with IDs, excluding ckwr and gfdkris
  const sections = document.querySelectorAll('[id]:not(popup-overlay):not(popup-content):not(popup-window):not(popup-close):not(popup-back-to-top):not(sticky-notes-container):not(ckwr):not(gfdkris)');
  sections.forEach(section => hashObserver.observe(section));
});

// (Removed neko logic) -- scroll.js now only handles animations and UI buttons.
