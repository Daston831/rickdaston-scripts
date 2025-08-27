class LockedImage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        iframe, img {
          display: block;
          width: 100%;
          height: 100%;
          border: none;
        }
      </style>
      <div id="container"></div>
    `;
  }

  connectedCallback() {
    const tempUrl = this.getAttribute("temp");
    const finalUrl = this.getAttribute("final");
    const mode = this.getAttribute("mode") || "contain";
    const delay = parseInt(this.getAttribute("delay")) || 10000; // default 10s
    const lockTime = parseInt(this.getAttribute("lock")) || 60000; // default 60s

    const container = this.shadowRoot.getElementById("container");

    const applyMode = (el) => {
      if (el.tagName === "IMG") {
        el.style.objectFit = mode;
      }
      return el;
    };

    const tempFrame = document.createElement(
      tempUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? "img" : "iframe"
    );
    tempFrame.src = tempUrl;
    container.appendChild(applyMode(tempFrame));

    setTimeout(() => {
      container.innerHTML = "";
      const finalFrame = document.createElement(
        finalUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? "img" : "iframe"
      );
      finalFrame.src = finalUrl;
      container.appendChild(applyMode(finalFrame));

      // Disable back/refresh while locked
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
  if (e.touches.length > 1 || (e.scale && e.scale !== 1)) {
    e.preventDefault();
  }
}, { passive: false });
// Force full width + height scaling
const style = document.createElement("style");
style.textContent = `
  locked-image, 
  locked-image iframe, 
  locked-image img {
    width: 100% !important;
    height: 100% !important;
    display: block;
    object-fit: cover;
  }
`;
document.head.appendChild(style);
