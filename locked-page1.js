class LockedPage extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });

    // Create iframe fullscreen
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
    this.preventBackButton();
  }

  startTimer() {
    const now = Date.now();
    const lockData = JSON.parse(localStorage.getItem("lockedPep") || "{}");

    if (lockData.shownOnce) {
      // Temp page already shown → go straight to pep2
      this.showPep2();
    } else {
      // Mark temp page as shown immediately
      localStorage.setItem("lockedPep", JSON.stringify({
        shownOnce: true
      }));

      // Show pep for 10s, then lock to pep2
      this.iframe.src = "https://rickdaston.com/pep";
      setTimeout(() => {
        this.showPep2();
        localStorage.setItem("lockedPep", JSON.stringify({
          shownOnce: true,
          until: Date.now() + 600000 // lock 10 minutes
        }));
      }, 10000);
    }
  }

  showPep2() {
    this.iframe.src = "https://rickdaston.com/pep2";
  }

  preventBackButton() {
    history.pushState(null, "", location.href);
    window.addEventListener("popstate", () => {
      // Trap again so user can't escape
      history.pushState(null, "", location.href);

      // Always redirect to sadle4.jpg
      window.location.replace("https://www.rickdaston.com/sadle4.jpg");
    });
  }
}

customElements.define('locked-page', LockedPage);
