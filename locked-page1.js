class LockedPage extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });

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
      zIndex: "999999"
    });

    this.shadowRoot.appendChild(this.iframe);
    this.startTimer();
  }

  startTimer() {
    const now = Date.now();
    const lockData = JSON.parse(localStorage.getItem("lockedPep") || "{}");

    // If already locked → show Sadle4
    if (lockData.until && now < lockData.until) {
      this.showSadle4();
      return;
    }

    // If first time OR timer already started
    if (!lockData.start) {
      // Store when Pep started
      localStorage.setItem("lockedPep", JSON.stringify({
        start: now,
        until: now + 15 * 60 * 1000 // lock for 15 minutes
      }));
      this.iframe.src = "https://rickdaston.com/pep";
    } else {
      // We are mid-session, check elapsed
      const elapsed = now - lockData.start;
      if (elapsed < 10000) {
        // Still within the original 10s window
        this.iframe.src = "https://rickdaston.com/pep";
        setTimeout(() => this.showSadle4(), 10000 - elapsed);
      } else {
        // Already past the window → go straight to Sadle4
        this.showSadle4();
      }
    }
  }

  showSadle4() {
    this.iframe.src = "https://rickdaston.com/sadle4-jpg";
  }
}

customElements.define('locked-page1', LockedPage);
