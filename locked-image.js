class LockedImage extends HTMLElement {
  connectedCallback() {
    const tempUrl = this.getAttribute('temp');
    const finalUrl = this.getAttribute('final');

    this.style.display = "block";
    this.style.width = "100%";
    this.style.height = "100vh";

    // See if the final page is already locked in
    const isLocked = localStorage.getItem("locked-final") === "true";

    if (isLocked) {
      // Show final only (after a refresh or back nav)
      this.innerHTML = `<iframe src="${finalUrl}" style="width:100%;height:100%;border:none;"></iframe>`;
    } else {
      // First time: show temp
      this.innerHTML = `<iframe src="${tempUrl}" style="width:100%;height:100%;border:none;"></iframe>`;
      
      // After 10s, switch to final
      setTimeout(() => {
        this.innerHTML = `<iframe src="${finalUrl}" style="width:100%;height:100%;border:none;"></iframe>`;
        localStorage.setItem("locked-final", "true");
      }, 10000); // 10 seconds
    }

    // Prevent back/forward nav
    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', () => {
      history.pushState(null, null, document.URL);
    });

    // Auto-unlock after 60s
    setTimeout(() => {
      localStorage.removeItem("locked-final");
    }, 60000);
  }
}

customElements.define('locked-image', LockedImage);
