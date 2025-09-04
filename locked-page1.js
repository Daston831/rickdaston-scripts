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
    const lockData = JSON.parse(sessionStorage.getItem("lockedPep") || "{}");

    if (lockData.shownOnce && lockData.until && now < lockData.until) {
      // Locked → go straight to pep2
      this.showPep2();
    } else {
      // Show pep (only once per session)
      sessionStorage.setItem("lockedPep", JSON.stringify({
        shownOnce: true
      }));

      this.iframe.src = "https://rickdaston.com/pep";

      // After 10s → switch to pep2 + set 1-minute lock
      setTimeout(() => {
        this.showPep2();
        sessionStorage.setItem("lockedPep", JSON.stringify({
          shownOnce: true,
          until: Date.now() + 60000 // lock 1 minute
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
      history.pushState(null, "", location.href);
      window.location.replace("https://www.rickdaston.com/sadle4-jpg");
    });
  }
}

customElements.define('locked-page', LockedPage);
