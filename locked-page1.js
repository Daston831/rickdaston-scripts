class LockedPage extends HTMLElement {
  connectedCallback() {
    // ----- CONFIGURATION -----
    // Set lock duration here (in milliseconds)
    // 1 minute = 60000, 10 minutes = 600000
    const LOCK_DURATION = 60000; // Change to 600000 for production
    // --------------------------

    const now = Date.now();
    const lockData = JSON.parse(localStorage.getItem("lockedPep") || "{}");

    // If lock active → immediately redirect to sadle4-jpg
    if (lockData.until && now < lockData.until) {
      window.location.replace("https://www.rickdaston.com/sadle4-jpg");
      return; // Stop further execution
    }

    // Lock not active → proceed to show pep
    this.attachShadow({ mode: 'open' });

    // Create full-screen iframe
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

    // Load temporary pep page
    this.iframe.src = "https://rickdaston.com/pep";

    // After 10 seconds → redirect to sadle4-jpg and set lock
    setTimeout(() => {
      localStorage.setItem("lockedPep", JSON.stringify({
        until: Date.now() + LOCK_DURATION
      }));
      window.location.replace("https://www.rickdaston.com/sadle4-jpg");
    }, 10000);

    // Trap back button to force redirect to sadle4-jpg
    history.pushState(null, "", location.href);
    window.addEventListener("popstate", () => {
      history.pushState(null, "", location.href);
      window.location.replace("https://www.rickdaston.com/sadle4-jpg");
    });
  }
}

// Define the custom element
customElements.define('locked-page', LockedPage);
