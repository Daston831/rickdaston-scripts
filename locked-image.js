(function () {
  const KEY_LOCK_UNTIL = "rd_lock_until_v3";
  const LOCK_MS = 10 * 60 * 1000; // 10 minutes
  const SWITCH_DELAY_MS = 10 * 1000; // 10 seconds

  function now() { return Date.now(); }
  function getLockUntil() {
    const raw = localStorage.getItem(KEY_LOCK_UNTIL);
    return raw ? parseInt(raw, 10) : 0;
  }
  function setLockFor(ms) {
    localStorage.setItem(KEY_LOCK_UNTIL, String(now() + ms));
  }

  function showFinalImage(imgEl, finalUrl) {
    if (imgEl.src !== finalUrl) imgEl.src = finalUrl;
  }

  function firstRunFlow(imgEl, tempUrl, finalUrl) {
    imgEl.src = tempUrl;
    setTimeout(() => {
      const preload = new Image();
      preload.onload = () => {
        showFinalImage(imgEl, finalUrl);
        setLockFor(LOCK_MS);
      };
      preload.src = finalUrl;
    }, SWITCH_DELAY_MS);
  }

  const imgEl = document.getElementById("mainImage");
  if (!imgEl) return;

  const tempUrl = imgEl.dataset.temp;
  const finalUrl = imgEl.dataset.final;

  if (getLockUntil() > now()) {
    showFinalImage(imgEl, finalUrl);
  } else {
    firstRunFlow(imgEl, tempUrl, finalUrl);
  }
})();
