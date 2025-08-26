class LockedImage extends HTMLElement {
  connectedCallback() {
    const tempUrl = this.getAttribute('temp');
    const finalUrl = this.getAttribute('final');
    const lockTime = parseInt(this.getAttribute('locktime')) || 60000;

    // Start with temp
    this.innerHTML = `<iframe src="${tempUrl}" style="width:100%;height:100%;border:none;"></iframe>`;

    // After 10 seconds, load final
    setTimeout(() => {
      this.innerHTML = `<iframe src="${finalUrl}" style="width:100%;height:100%;border:none;"></iframe>`;

      // Prevent back refresh until lock expires
      const start = Date.now();
      const check = () => {
        if (Date.now() - start < lockTime) {
          history.pushState(null, '', location.href);
        }
      };
      window.addEventListener('popstate', check);

      // Unlock after lockTime
      setTimeout(() => {
        window.removeEventListener('popstate', check);
      }, lockTime);

    }, 10000); // 10 seconds
  }
}
customElements.define('locked-image', LockedImage);
