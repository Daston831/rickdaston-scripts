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
      zIndex: "999999"
    });

    this.shadowRoot.appendChild(this.iframe);
    this.startTimer();

    // Block back button → redirect
    this.preventBackButton();
  }

  startTimer() {
    const now = Date.now();
    const lockData = JSON.parse(localStorage.getItem("lockedPep") || "{}");

    if (lockData.until && now < lockData.until) {
      this.showPep2();
    } else {
      this.iframe.src = "https://rickdaston.com/pep";
      setTimeout(() => {
        this.showPep2();
        localStorage.setItem("lockedPep", JSON.stringify({
          until: Date.now() + 600000 // lock 10 minutes
        }));
      }, 10000);
    }
  }

  showPep2() {
    this.iframe.src = "https://rickdaston.com/pep2";
  }

  preventBackButton() {
    // Add a dummy history state
    history.pushState(null, "", location.href);

    window.addEventListener("popstate", () => {
      // Re-push state to trap user in place
      history.pushState(null, "", location.href);

      // Redirect to sadle4.jpg
      window.location.replace("https://www.rickdaston.com/sadle4.jpg");
    });
  }
}

customElements.define('locked-page', LockedPage);
customElements.define('locked-page', LockedPage);
