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
          object-fit: contain; /* Keeps full content visible */
          border: none;
        }
      </style>
      <div id="container"></div>
    `;
  }

  connectedCallback() {
    const tempUrl = this.getAttribute("temp");
    const finalUrl = this.getAttribute("final");
    const container = this.shadowRoot.getElementById("container");

    const tempFrame = document.createElement(
      tempUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? "img" : "iframe"
    );
    tempFrame.src = tempUrl;
    container.appendChild(tempFrame);

    setTimeout(() => {
      container.innerHTML = "";
      const finalFrame = document.createElement(
        finalUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? "img" : "iframe"
      );
      finalFrame.src = finalUrl;
      container.appendChild(finalFrame);
    }, 10000); // switch after 10s
  }
}
customElements.define("locked-image", LockedImage);

// Prevent swipe refresh
document.addEventListener("touchmove", (e) => {
  if (e.touches.length > 1 || e.scale && e.scale !== 1) e.preventDefault();
}, { passive: false });
