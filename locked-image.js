class LockedImage extends HTMLElement {
  connectedCallback() {
    const tempUrl = this.getAttribute("temp");
    const finalUrl = this.getAttribute("final");
    const KEY_LOCK_UNTIL = "rd_lock_until_v3";
    const LOCK_MS = 10 * 60 * 1000; // 10 minutes
    const SWITCH_DELAY_MS = 10 * 1000; // 10 seconds

    const frame = document.createElement("iframe");
    frame.style.width = "100%";
    frame.style.height = "600px"; // adjust height as needed
    frame.style.border = "none";
    this.appendChild(frame);

    function now() { return Date.now(); }
    function getLockUntil() {
      const raw = localStorage.getItem(KEY_LOCK_UNTIL);
      return raw ? parseInt(raw, 10) : 0;
    }
    function setLockFor(ms) {
      localStorage.setItem(KEY_LOCK_UNTIL, String(now() + ms));
    }
    function showFinal() {
      frame.src = finalUrl;
    }

    if (getLockUntil() > now()) {
      // Still locked → show final immediately
      showFinal();
    } else {
      // Not locked → show temp first, then swap after 10s
      frame.src = tempUrl;
      setTimeout(() => {
        showFinal();
        setLockFor(LOCK_MS);
      }, SWITCH_DELAY_MS);
    }
  }
}

customElements.define("locked-image", LockedImage);
