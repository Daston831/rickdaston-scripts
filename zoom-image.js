$w.onReady(function () {
  const image = $w('#zoomImage');
  let scale = 2.5; // initial zoom scale
  let offsetX = -60; // initial horizontal offset in percentage
  let offsetY = -60; // initial vertical offset in percentage
  let startDist = 0;
  let lastX = 0, lastY = 0;

  function getDistance(t1, t2) {
    let dx = t1.clientX - t2.clientX;
    let dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  image.onTouchStart((e) => {
    if (e.touches.length === 2) {
      startDist = getDistance(e.touches[0], e.touches[1]);
    } else if (e.touches.length === 1) {
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
    }
  });

  image.onTouchMove((e) => {
    e.preventDefault();
    if (e.touches.length === 2) {
      const newDist = getDistance(e.touches[0], e.touches[1]);
      let delta = newDist / startDist;
      startDist = newDist;
      scale *= delta;
      if (scale < 1) scale = 1; // prevent zooming out beyond original size
      image.style.transform = `scale(${scale}) translate(${offsetX}%, ${offsetY}%)`;
    } else if (e.touches.length === 1) {
      let dx = e.touches[0].clientX - lastX;
      let dy = e.touches[0].clientY - lastY;
      offsetX += dx / image.width * 100;
      offsetY += dy / image.height * 100;
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
      image.style.transform = `scale(${scale}) translate(${offsetX}%, ${offsetY}%)`;
    }
  });
});
