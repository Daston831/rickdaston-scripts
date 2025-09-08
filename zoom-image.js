(function() {
  const image = document.getElementById("zoomImage");
  if (!image) return;

  image.onload = function() { // Wait until the image has fully loaded
    let scale = 2.5; // Initial zoom (~40%)
    let offsetX = -60; // Bottom-right horizontal offset in %
    let offsetY = -60; // Bottom-right vertical offset in %
    let startDist = 0;
    let lastX = 0, lastY = 0;

    // Apply initial zoom & offset
    image.style.transform = `scale(${scale}) translate(${offsetX}%, ${offsetY}%)`;

    // Calculate distance between two touch points
    function getDistance(t1, t2) {
      const dx = t1.clientX - t2.clientX;
      const dy = t1.clientY - t2.clientY;
      return Math.sqrt(dx*dx + dy*dy);
    }

    // Touch start
    image.addEventListener("touchstart", e => {
      if (e.touches.length === 2) {
        startDist = getDistance(e.touches[0], e.touches[1]);
      } else if (e.touches.length === 1) {
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
      }
    }, { passive: false });

    // Touch move (drag & pinch)
    image.addEventListener("touchmove", e => {
      e.preventDefault();
      if (e.touches.length === 2) {
        // Pinch zoom
        const newDist = getDistance(e.touches[0], e.touches[1]);
        const delta = newDist / startDist;
        startDist = newDist;
        scale *= delta;
        if (scale < 1) scale = 1; // Minimum zoom = full page
        image.style.transform = `scale(${scale}) translate(${offsetX}%, ${offsetY}%)`;
      } else if (e.touches.length === 1) {
        // Drag/pan
        const dx = e.touches[0].clientX - lastX;
        const dy = e.touches[0].clientY - lastY;
        offsetX += dx / window.innerWidth * 100;
        offsetY += dy / window.innerHeight * 100;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
        image.style.transform = `scale(${scale}) translate(${offsetX}%, ${offsetY}%)`;
      }
    }, { passive: false });
  };
})();
