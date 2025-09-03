class LockedPage extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.iframe = document.createElement('iframe');
    this.iframe.style.width = "250%";
    this.iframe.style.height = "250%";
    this.iframe.style.border = "none";
    this.shadowRoot.appendChild(this.iframe);

    this.startTimer();
  }

  startTimer() {
    // Check if user is in locked period
    const now = Date.now();
    const lockData = JSON.parse(localStorage.getItem("lockedPep") || "{}");

    if (lockData.until && now < lockData.until) {
      // Still locked -> force pep2
      this.showPep2();
    } else {
      // Show pep first
      this.iframe.src = "https://rickdaston.com/pep";

      // After 10 seconds switch & lock for 60
      setTimeout(() => {
        this.showPep2();
        localStorage.setItem("lockedPep", JSON.stringify({
          until: Date.now() + 60000 // lock 60s
        }));
      }, 10000);
    }
  }

  showPep2() {
    this.iframe.src = "https://rickdaston.com/pep2";
  }
}

customElements.define('locked-page', LockedPage);
