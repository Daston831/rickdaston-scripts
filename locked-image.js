class LockedImage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          display: block;
          overflow: hidden;
          z-index: 999;
        }
        iframe, img {
          width: 100%;
          display: block;
          border: none;
        }
      </style>
      <div id="container"></div>
    `;
  }

  connectedCallback() {
    const tempUrl = this.getAttribute("temp");
    const finalUrl = this.getAttribute("final");
    const mode = this.getAttribute("mode") || "cover";
    const delay = parseInt(this.getAttribute("delay")) || 10000;
    const lockTime = parseInt(this.getAttribute("lock")) || 60000;

    const container = this.shadowRoot.getElementById("container");

    // Detect Wix header height dynamically
    const header = document.querySelector("header, [data-testid='site-header']");
    const headerHeight = header ? header.offsetHeight : 0;
    this.style.top = headerHeight + "px";
    this.style.height = `calc(100vh - ${headerHeight}px)`;

    const createFrame = (url) => {
      const el = url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? document.createElement("img") : document.createElement("iframe");
      el.src = url;
      el.style.height = "100%";
      if (el.tagName === "IMG") el.style.objectFit = mode;
      return el;
    };

    // Show temp first
    container.appendChild(createFrame(tempUrl));

    // Switch to final after delay
    setTimeout(() => {
      container.innerHTML = "";
      container.appendChild(createFrame(finalUrl));

      // Lock navigation for lockTime
      let locked = true;
      const blockNav = (e) => {
        if (locked) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      };
      window.addEventListener("popstate", blockNav, true);
      document.addEventListener("keydown", blockNav, true);

      setTimeout(() => {
        locked = false;
        window.removeEventListener("popstate", blockNav, true);
        document.removeEventListener("keydown", blockNav, true);
      }, lockTime);

    }, delay);
  }
}

customElements.define("locked-image", LockedImage);

// Prevent swipe refresh on mobile
document.addEventListener("touchmove", (e) => {
  if (e.touches.length > 1 || (e.scale && e.scale !== 1)) e.preventDefault();
}, { passive: false });
