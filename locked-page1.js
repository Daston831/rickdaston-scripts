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

    if (lockData.until && now < lockData.until) {
      // Still locked → always show sadle4-jpg
      this.showSadle4();
    } else {
      // Show pep first
      this.iframe.src = "https://rickdaston.com/pep";

      // After 10 seconds → switch to sadle4-jpg and lock for 1 minute
      setTimeout(() => {
        this.showSadle4();
        localStorage.setItem("lockedPep", JSON.stringify({
          until: Date.now() + 60000 // 1 minute lock for testing
        }));
      }, 10000);
    }
  }

  showSadle4() {
    this.iframe.src = "https://www.rickdaston.com/sadle4-jpg";
  }

  preventBackButton() {
    // Push dummy state so "back" won't leave the page
    history.pushState(null, "", location.href);

    window.addEventListener("popstate", () => {
      // Re-push dummy state
      history.pushState(null, "", location.href);

      // Redirect browser immediately to static lock page
      window.location.replace("https://www.rickdaston.com/sadle4-jpg");
    });
  }
}

customElements.define('locked-page', LockedPage);
customElements.define('locked-page', LockedPage);
customElements.define('locked-page', LockedPage);
