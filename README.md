class LockedImage extends HTMLElement {
  connectedCallback() {
    const tempUrl = this.getAttribute("temp");
    const finalUrl = this.getAttribute("final");
    const KEY_LOCK_UNTIL = "rd_lock_until_v3";
    const LOCK_MS = 10 * 60 * 1000; // 10 minutes
    const SWITCH_DELAY_MS = 10 * 1000; // 10 seconds

    const img = document.createElement("img");
    img.style.maxWidth = "100%";
    img.style.height = "auto";
    this.appendChild(img);

    function now() { return Date.now(); }
    function getLockUntil() {
      const raw = localStorage.getItem(KEY_LOCK_UNTIL);
      return raw ? parseInt(raw, 10) : 0;
    }
    function setLockFor(ms) {
      localStorage.setItem(KEY_LOCK_UNTIL, String(now() + ms));
    }
    function showFinal() {
      img.src = finalUrl;
    }

    if (getLockUntil() > now()) {
      // Still in lock window → show final immediately
      showFinal();
    } else {
      // Not locked → show temp first, then swap after 10s
      img.src = tempUrl;
      setTimeout(() => {
        const preload = new Image();
        preload.onload = () => {
          showFinal();
          setLockFor(LOCK_MS);
        };
        preload.src = finalUrl;
      }, SWITCH_DELAY_MS);
    }
  }
}

// Register custom <locked-image> tag
customElements.define("locked-image", LockedImage);
