class LockedPage extends HTMLElement {
  connectedCallback() {
    // ----- CONFIGURATION -----
    const LOCK_DURATION = 60000; // 1 minute for testing, 600000 = 10 minutes for production
    const PEP_URL = "https://rickdaston.com/pep"; 
    const LOCKED_URL = "https://www.rickdaston.com/sadle4-jpg"; 
    const PEP_DISPLAY_TIME = 10000; // 10 seconds
    // --------------------------

    const now = Date.now();
    const lockData = JSON.parse(localStorage.getItem("lockedPep") || "{}");

    // If lock is active → redirect immediately to locked page
    if (lockData.until && now < lockData.until) {
      window.location.replace(LOCKED_URL);
      return; // stop execution
    }

    // No active lock → show pep for 10 seconds, then lock and redirect
    // Use top-level page for pep
    const pepWindow = window.open(PEP_URL, "_self"); 

    setTimeout(() => {
      // Set lock
      localStorage.setItem("lockedPep", JSON.stringify({
        until: Date.now() + LOCK_DURATION
      }));
      // Redirect to locked page
      window.location.replace(LOCKED_URL);
    }, PEP_DISPLAY_TIME);

    // Trap back button while on pep3
    history.pushState(null, "", location.href);
    window.addEventListener("popstate", () => {
      history.pushState(null, "", location.href);
      window.location.replace(LOCKED_URL);
    });
  }
}

customElements.define('locked-page', LockedPage);
