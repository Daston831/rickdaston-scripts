class LockedPage2 extends HTMLElement {
  connectedCallback() {
    // Make shadow root
    this.attachShadow({ mode: 'open' });

    // Create fullscreen iframe
    this.iframe = document.createElement('iframe');
    Object.assign(this.iframe.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      border: "none",
      margin: "0",
      padding: "0",
      zIndex: "999999" // stays on top
    });

    this.shadowRoot.appendChild(this.iframe);

    this.startTimer();
  }

  startTimer() {
    const now = Date.now();
    const lockData = JSON.parse(localStorage.getItem("lockedPep") || "{}");

    if (lockData.until && now < lockData.until) {
      // Locked → force pep2
      this.showPep2();
    } else {
      // Show pep first
      this.iframe.src = "https://rickdaston.com/pep";

      // After 10s → switch to pep2 and lock for 60s
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

customElements.define('locked-page2', LockedPage2);
