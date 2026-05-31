(() => {
  const grids = document.querySelectorAll('.grid');

  const waitForImages = (images) => {
    const pending = [];
    images.forEach((img) => {
      if (img.complete && img.naturalWidth > 0) {
        return;
      }
      pending.push(
        new Promise((resolve) => {
          const done = () => resolve();
          img.addEventListener('load', done, { once: true });
          img.addEventListener('error', done, { once: true });
        })
      );
    });
    return Promise.all(pending);
  };

  const layoutGrid = (grid) => {
    const items = Array.from(grid.querySelectorAll('.item'));
    if (!items.length) {
      return;
    }

    const gapValue = getComputedStyle(grid).columnGap || getComputedStyle(grid).gap;
    const gap = Number.parseFloat(gapValue) || 0;
    const minColValue = getComputedStyle(grid).getPropertyValue('--masonry-min-col');
    const minColWidth = Number.parseFloat(minColValue) || 200;
    const columns = Math.max(1, Math.floor((grid.clientWidth + gap) / (minColWidth + gap)));

    grid.querySelectorAll('.masonry-column').forEach((column) => column.remove());

    const columnEls = Array.from({ length: columns }, () => {
      const column = document.createElement('div');
      column.className = 'masonry-column';
      grid.appendChild(column);
      return column;
    });

    const columnWidths = columnEls[0]?.clientWidth || minColWidth;
    const columnHeights = Array(columns).fill(0);

    items.forEach((item) => {
      const aspect = item.naturalWidth ? item.naturalHeight / item.naturalWidth : 1;
      const estimatedHeight = columnWidths * aspect;

      let shortest = 0;
      for (let i = 1; i < columnHeights.length; i += 1) {
        if (columnHeights[i] < columnHeights[shortest]) {
          shortest = i;
        }
      }

      columnEls[shortest].appendChild(item);
      columnHeights[shortest] += estimatedHeight + gap;
    });
  };

  const overlay = document.createElement('div');
  overlay.className = 'photo-overlay';
  overlay.innerHTML = '<img alt="" />';
  document.body.appendChild(overlay);

  const overlayImg = overlay.querySelector('img');
  const closeOverlay = () => {
    overlay.classList.remove('is-open');
    overlayImg.src = '';
  };

  overlay.addEventListener('click', () => closeOverlay());
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeOverlay();
    }
  });

  grids.forEach((grid) => {
    const items = Array.from(grid.querySelectorAll('.item'));
    items.forEach((item) => {
      if (item.dataset.overlayReady) {
        return;
      }
      item.dataset.overlayReady = 'true';
      item.addEventListener('click', () => {
        overlayImg.src = item.currentSrc || item.src;
        overlay.classList.add('is-open');
      });
    });
    waitForImages(items).then(() => layoutGrid(grid));

    let resizeTimer;
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => layoutGrid(grid), 150);
    });
  });
})();
