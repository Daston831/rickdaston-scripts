class LockedPage extends HTMLElement {
  connectedCallback() {
    // ----- CONFIGURATION -----
    const LOCK_DURATION = 60000; // 1 minute for testing, 600000 = 10 minutes for production
    const PEP_URL = "https://rickdaston.com/pep"; // 10-second effect
    const FINAL_PAGE = "https://www.rickdaston.com/sadle4-jpg"; // story final page
    const PEP_DISPLAY_TIME = 10000; // 10 seconds
    // --------------------------

    const now = Date.now();
    const lockData = JSON.parse(localStorage.getItem("lockedPep") || "{}");

    // If lock is active → redirect immediately to final story page
    if (lockData.until && now < lockData.until) {
      window.location.replace(FINAL_PAGE);
      return; // stop execution
    }

    // Lock not active → show pep effect
    this.attachShadow({ mode: 'open' });

    // Full-screen iframe for pep effect
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

    // Load the temporary pep content
    this.iframe.src = PEP_URL;

    // After 10 seconds → set lock and show final page
    setTimeout(() => {
      localStorage.setItem("lockedPep", JSON.stringify({
        until: Date.now() + LOCK_DURATION
      }));
      window.location.replace(FINAL_PAGE);
    }, PEP_DISPLAY_TIME);

    // Trap back button to go straight to final page
    history.pushState(null, "", location.href);
    window.addEventListener("popstate", () => {
      history.pushState(null, "", location.href);
      window.location.replace(FINAL_PAGE);
    });
  }
}

// Register the custom element
customElements.define('locked-page', LockedPage);
