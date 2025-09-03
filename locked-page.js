class LockedPage extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });

    // Create wrapper to enforce full height
    const wrapper = document.createElement('div');
    Object.assign(wrapper.style, {
      width: "100%",
      height: "100vh", // full viewport height
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: "0",
      padding: "0",
      boxSizing: "border-box"
    });

    // Create iframe
    this.iframe = document.createElement('iframe');
    Object.assign(this.iframe.style, {
      width: "100%",
      height: "100%",
      border: "none"
    });

    wrapper.appendChild(this.iframe);
    this.shadowRoot.appendChild(wrapper);

    this.startTimer();
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
