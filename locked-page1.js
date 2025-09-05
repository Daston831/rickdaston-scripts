class LockedPage1 extends HTMLElement {
  connectedCallback() {
    // ----- CONFIGURATION -----
    const LOCK_DURATION = 60000; // 1 minute for testing
    const FINAL_PAGE = "https://www.rickdaston.com/sadle4-jpg"; // final story page
    const PEP_DISPLAY_TIME = 10000; // 10 seconds
    // --------------------------

    const now = Date.now();
    const lockData = JSON.parse(localStorage.getItem("lockedPep") || "{}");

    // If lock active → go straight to final page
    if (lockData.until && now < lockData.until) {
      window.location.replace(FINAL_PAGE);
      return;
    }

    // No active lock → start 10-second timer
    setTimeout(() => {
      // Set lock
      localStorage.setItem("lockedPep", JSON.stringify({
        until: Date.now() + LOCK_DURATION
      }));
      // Redirect to final story page
      window.location.replace(FINAL_PAGE);
    }, PEP_DISPLAY_TIME);

    // Trap back button to always go to final page
    history.pushState(null, "", location.href);
    window.addEventListener("popstate", () => {
      history.pushState(null, "", location.href);
      window.location.replace(FINAL_PAGE);
    });
  }
}

// Register the custom element
customElements.define('locked-page1', LockedPage1);
