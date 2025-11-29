// Image popup logic now uses the unified popup overlay
document.addEventListener('DOMContentLoaded', function () {
  document.body.addEventListener('click', function (e) {
    const target = e.target;
    // Only trigger for images NOT inside excluded areas and NOT inside the popup itself
    const isImg = target.tagName === 'IMG';
    const insidePhotoGrid = !!target.closest('.photo-grid');
    const insideButtons = !!target.closest('.buttons-88x31');
    const insideWebrings = !!target.closest('#ckwr') || !!target.closest('#gfdkris');
    const insideHubButton = !!target.closest('#hub-button');
    const insidePopup = !!target.closest('#popup-overlay');
    const markedNoPopup = target.hasAttribute('data-no-popup');

    if (isImg && insidePhotoGrid && !insideButtons && !insideWebrings && !insideHubButton && !insidePopup && !markedNoPopup) {
      // Use unified popup to display the image
      const alt = target.getAttribute('alt') || '';
      if (typeof openImagePopup === 'function') {
        openImagePopup(target.src, alt);
      }
    }
  });
});
