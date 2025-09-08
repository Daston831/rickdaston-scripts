(function() {
  const image = document.getElementById("zoomImage");
  if (!image) return;

  // Make sure the image fills the container properly
  image.style.width = "100%";
  image.style.height = "100%";
  image.style.objectFit = "cover";
  image.style.display = "block";

  image.onload = function() {
    let scale = 2.5; // initial zoom
    let offsetX = -60;
    let offsetY = -60;
    let startDist = 0;
    let lastX = 0, lastY = 0;

    // Small timeout to let the browser render image first
    setTimeout(() => {
      image.style.transform = `scale(${scale}) translate(${offsetX}%, ${offsetY}%)`;
    }, 50);

    function getDistance(t1, t2) {
      const dx = t1.clientX - t2.clientX;
      const dy = t1.clientY - t2.clientY;
      return Math.sqrt(dx*dx + dy*dy);
    }

    image.addEventListener("touchstart", e => {
      if (e.touches.length === 2) {
        startDist = getDistance(e.touches[0], e.touches[1]);
      } else if (e.touches.length === 1) {
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
      }
    }, { passive: false });

    image.addEventListener("touchmove", e => {
      e.preventDefault();
      if (e.touches.length === 2) {
        const newDist = getDistance(e.touches[0], e.touches[1]);
        const delta = newDist / startDist;
        startDist = newDist;
        scale *= delta;
        if (scale < 1) scale = 1;
        image.style.transform = `scale(${scale}) translate(${offsetX}%, ${offsetY}%)`;
      } else if (e.touches.length === 1) {
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
