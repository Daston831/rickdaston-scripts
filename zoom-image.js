(function() {
  const image = document.getElementById("zoomImage");
  if (!image) return;

  let scale = 1.5; // initial zoom
  let offsetX = 0;
  let offsetY = 0;
  let lastX = 0, lastY = 0;
  let startDist = 0;

  // Apply initial scale from bottom-right
  image.style.transform = `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`;

  function getDistance(t1, t2) {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx*dx + dy*dy);
  }

  image.addEventListener("touchstart", e => {
    if(e.touches.length === 2) startDist = getDistance(e.touches[0], e.touches[1]);
    else if(e.touches.length === 1) { lastX = e.touches[0].clientX; lastY = e.touches[0].clientY; }
  }, { passive:false });

  image.addEventListener("touchmove", e => {
    e.preventDefault();
    if(e.touches.length === 2) {
      // Pinch zoom
      const newDist = getDistance(e.touches[0], e.touches[1]);
      const delta = newDist / startDist;
      startDist = newDist;
      scale *= delta;
      if(scale < 1) scale = 1; // minimum zoom = full container
      image.style.transform = `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`;
    } else if(e.touches.length === 1) {
      // Drag / pan
      const dx = e.touches[0].clientX - lastX;
      const dy = e.touches[0].clientY - lastY;
      offsetX += dx;
      offsetY += dy;
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
      image.style.transform = `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`;
    }
  }, { passive:false });
})();
