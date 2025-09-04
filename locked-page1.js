class LockedPage extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });

    // Create iframe that fills the entire viewport
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
      zIndex: "999999" // ensures it's on top
    });

    this.shadowRoot.appendChild(this.iframe);
    this.startTimer();
  }

  startTimer() {
    const now = Date.now();
    const lockData = JSON.parse(localStorage.getItem("lockedPep") || "{}");

    if (lockData.shownOnce) {
      // Temp page was already shown once → always show pep2
      this.showPep2();
    } else {
      // Show temp page (pep) only once
      this.iframe.src = "https://rickdaston.com/pep";

      // After 10 seconds → switch to pep2 + set 10min lock
      setTimeout(() => {
        this.showPep2();
        localStorage.setItem("lockedPep", JSON.stringify({
          shownOnce: true,
          until: Date.now() + 600000 // lock 10 minutes (600k ms)
        }));
      }, 10000);
    }
  }

  showPep2() {
    this.iframe.src = "https://rickdaston.com/pep2";
  }
}

customElements.define('locked-page', LockedPage);
