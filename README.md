class LockedImage extends HTMLElement {
  connectedCallback() {
    const tempUrl = this.getAttribute("temp");
    const finalUrl = this.getAttribute("final");
    const autoResize = this.hasAttribute("auto-resize");
    const lockKey = "locked-image-unlock-time";
    const lockDuration = 10 * 60 * 1000; // 10 minutes

    const now = Date.now();
    const unlockTime = localStorage.getItem(lockKey);

    // Create container
    const container = document.createElement("div");
    container.style.position = "relative";
    container.style.width = "100%";
    container.style.height = "100%";

    const iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";

    // Decide whether to show temp or final
    if (unlockTime && now < parseInt(unlockTime, 10)) {
      iframe.src = finalUrl;
    } else {
      iframe.src = tempUrl;

      // Start 10 minute lock countdown
      localStorage.setItem(lockKey, now + lockDuration);

      // After 10 minutes, switch to final
      setTimeout(() => {
        iframe.src = finalUrl;
      }, lockDuration);
    }

    container.appendChild(iframe);
    this.appendChild(container);

    // Auto resize height if requested
    if (autoResize) {
      window.addEventListener("message", (event) => {
        if (event.data.type === "resize-iframe" && event.data.height) {
          iframe.style.height = event.data.height + "px";
        }
      });
    }
  }
}

customElements.define("locked-image", LockedImage);
