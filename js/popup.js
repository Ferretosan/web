// popup.js
function popupwindowstart(content) {
  const overlay = document.getElementById('popup-overlay');
  const contentContainer = document.getElementById('popup-content');
  const popupBackToTop = document.getElementById('popup-back-to-top');
  
  if (overlay && contentContainer) {
    contentContainer.innerHTML = content;
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.classList.add('popup-open');
    document.documentElement.classList.add('popup-open');
    
    // Set up scroll listener for this popup instance
    setTimeout(() => {
      const popupWindow = document.getElementById('popup-window');
      if (popupWindow && popupBackToTop) {
        // Remove any existing listener
        popupWindow.removeEventListener('scroll', popupScrollHandler);
        // Add new listener
        popupWindow.addEventListener('scroll', popupScrollHandler);
      }
    }, 100);
  }
}

// Open an image inside the unified popup
function openImagePopup(src, alt = '') {
  const overlay = document.getElementById('popup-overlay');
  const contentContainer = document.getElementById('popup-content');
  const popupBackToTop = document.getElementById('popup-back-to-top');

  if (overlay && contentContainer) {
    contentContainer.innerHTML = `<img src="${src}" alt="${alt}" style="max-width:90vw;max-height:90vh;">`;
    overlay.classList.add('image-mode');
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.classList.add('popup-open');
    document.documentElement.classList.add('popup-open');

    // No scroll/back-to-top in image mode
    if (popupBackToTop) {
      popupBackToTop.classList.remove('show');
    }
  }
}

// Scroll handler function
function popupScrollHandler() {
  const popupWindow = document.getElementById('popup-window');
  const popupBackToTop = document.getElementById('popup-back-to-top');
  if (popupWindow && popupBackToTop) {
    if (popupWindow.scrollTop > 200) {
      popupBackToTop.classList.add('show');
    } else {
      popupBackToTop.classList.remove('show');
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const overlay = document.getElementById('popup-overlay');
  const closeBtn = document.getElementById('popup-close');
  const popupBackToTop = document.getElementById('popup-back-to-top');

  function closePopup() {
    if (overlay) {
      overlay.style.display = 'none';
      document.getElementById('popup-content').innerHTML = '';
      overlay.classList.remove('image-mode');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.classList.remove('popup-open');
      document.documentElement.classList.remove('popup-open');
      if (popupBackToTop) {
        popupBackToTop.classList.remove('show');
      }
    }
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closePopup);
  }

  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        closePopup();
      }
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay && overlay.style.display === 'flex') {
      closePopup();
    }
  });

  // Popup Back to Top Button functionality
  if (popupBackToTop) {
    popupBackToTop.addEventListener('click', function() {
      const popupWindow = document.getElementById('popup-window');
      if (popupWindow) {
        popupWindow.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    });
  }
});
