// Image popup modal logic
document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  const closeBtn = document.getElementById('close-modal');
  // Listen for clicks on all images except those inside .buttons-88x31, webrings, and hub button
  document.body.addEventListener('click', function (e) {
    const target = e.target;
    if (target.tagName === 'IMG' && !target.closest('.buttons-88x31') && !target.closest('#ckwr') && !target.closest('#gfdkris') && !target.closest('#hub-button')) {
      modalImg.src = target.src;
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  });
  closeBtn.addEventListener('click', function () {
    modal.style.display = 'none';
    modalImg.src = '';
    document.body.style.overflow = '';
  });
  // Close modal on background click
  modal.addEventListener('click', function (e) {
    if (e.target === modal) {
      modal.style.display = 'none';
      modalImg.src = '';
      document.body.style.overflow = '';
    }
  });
  // Optional: close modal on ESC key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      modal.style.display = 'none';
      modalImg.src = '';
      document.body.style.overflow = '';
    }
  });
});
