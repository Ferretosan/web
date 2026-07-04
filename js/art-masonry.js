(() => {
  const grids = document.querySelectorAll('.grid');
  const loadingScreen = document.getElementById('loadingScreen');

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
  overlay.innerHTML = '<img alt="" /><button class="download-btn"><i> Download Full Res</i></button>';
  document.body.appendChild(overlay);

  const overlayImg = overlay.querySelector('img');
  const downloadBtn = overlay.querySelector('.download-btn');
  const closeOverlay = () => {
    overlay.classList.remove('is-open');
    overlayImg.src = '';
  };

  downloadBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const url = overlayImg.src.split('?')[0];
    const fullResUrl = url + '?ixlib=rb-4.0.3&force=true';
    
    fetch(fullResUrl)
      .then(res => res.blob())
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'photo.jpg';
        link.click();
        URL.revokeObjectURL(blobUrl);
      });
  });

  overlay.addEventListener('click', () => closeOverlay());
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeOverlay();
    }
  });

  const gridPromises = Array.from(grids).map((grid) => {
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
    
    let resizeTimer;
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => layoutGrid(grid), 150);
    });

    return waitForImages(items).then(() => layoutGrid(grid));
  });

  Promise.all(gridPromises).then(() => {
    if (loadingScreen) {
      loadingScreen.style.display = 'none';
    }
  });
})();

