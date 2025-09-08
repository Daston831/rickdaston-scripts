(function() {
  const container = document.getElementById("imageContainer");
  const image = document.getElementById("zoomImage");
  const imageURL = "https://11z.email/api/v1/page/7811";

  // Preload the image
  const img = new Image();
  img.src = imageURL;
  img.onload = function() {
    image.src = imageURL;
    image.style.display = "block";

    image.style.width = "100%";
    image.style.height = "100%";
    image.style.objectFit = "cover";
    image.style.transformOrigin = "bottom right";

    // Initial zoom for 60% visibility
    let scale = 2; // 60% visible
    let offsetX = 0, offsetY = 0;
    let lastX = 0, lastY = 0;
    let startDist = 0;

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
        const newDist = getDistance(e.touches[0], e.touches[1]);
        const delta = newDist / startDist;
        startDist = newDist;
        scale *= delta;
        if(scale < 1) scale = 1;
        image.style.transform = `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`;
      } else if(e.touches.length === 1) {
        const dx = e.touches[0].clientX - lastX;
        const dy = e.touches[0].clientY - lastY;
        offsetX += dx;
        offsetY += dy;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
        image.style.transform = `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`;
      }
    }, { passive:false });
  };
})();
