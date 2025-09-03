class LockedPage extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });

    // Create wrapper
    const wrapper = document.createElement('div');
    Object.assign(wrapper.style, {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100vh", // full viewport height
      boxSizing: "border-box",
      background: "#f9f9f9" // optional page background
    });

    // Create responsive iframe
    this.iframe = document.createElement('iframe');
    Object.assign(this.iframe.style, {
      width: "80vw", // 80% of viewport width
      height: "80vh", // 80% of viewport height
      maxWidth: "1200px", // don’t stretch too wide
      maxHeight: "800px", // don’t stretch too tall
      border: "2px solid #333",
      borderRadius: "12px",
      boxShadow: "0px 4px 20px rgba(0,0,0,0.2)"
    });

    wrapper.appendChild(this.iframe);
    this.shadowRoot.appendChild(wrapper);

    this.startTimer();
  }

  startTimer() {
    const now = Date.now();
    const lockData = JSON.parse(localStorage.getItem("lockedPep") || "{}");

    if (lockData.until && now < lockData.until) {
      // Still locked → force pep2
      this.showPep2();
    } else {
      // Show pep first
      this.iframe.src = "https://rickdaston.com/pep";

      // After 10s switch to pep2 and lock for 60s
      setTimeout(() => {
        this.showPep2();
        localStorage.setItem("lockedPep", JSON.stringify({
          until: Date.now() + 60000 // lock 60s
        }));
      }, 10000);
    }
  }

  showPep2() {
    this.iframe.src = "https://rickdaston.com/pep2";
  }
}

customElements.define('locked-page', LockedPage);
