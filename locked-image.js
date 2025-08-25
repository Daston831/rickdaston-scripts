class LockedImage extends HTMLElement {
  connectedCallback() {
    const tempUrl = this.getAttribute("temp");
    const finalUrl = this.getAttribute("final");
    const iframeHeight = this.getAttribute("iframe-height") || "500px"; // default height

    const lockKey = "lockedImageTimestamp";
    const lockDuration = 10 * 60 * 1000; // 10 minutes

    const container = document.createElement("div");
    container.style.width = "100%";
    container.style.maxWidth = "600px"; // adjust as needed
    container.style.margin = "0 auto";
    this.appendChild(container);

    const now = Date.now();
    const savedTime = localStorage.getItem(lockKey);

    if (savedTime && now - savedTime < lockDuration) {
      this.loadContent(container, finalUrl, iframeHeight); // locked → show final
    } else {
      localStorage.setItem(lockKey, now);
      this.loadContent(container, tempUrl, iframeHeight); // show temp
      setTimeout(() => this.loadContent(container, finalUrl, iframeHeight), 10000); // switch after 10s
    }
  }

  async loadContent(container, url, iframeHeight) {
    try {
      const response = await fetch(url, { method: "HEAD" });
      const contentType = response.headers.get("content-type") || "";

      container.innerHTML = "";

      if (contentType.includes("image")) {
        // Show as <img>
        const img = document.createElement("img");
        img.src = url;
        img.style.maxWidth = "100%";
        img.style.height = "auto";
        img.style.display = "block";
        img.style.margin = "0 auto";
        container.appendChild(img);
      } else {
        // Show as <iframe>
        const iframe = document.createElement("iframe");
        iframe.src = url;
        iframe.style.width = "100%";
        iframe.style.height = iframeHeight; // controlled by attribute
        iframe.style.border = "none";
        iframe.style.borderRadius = "12px";
        container.appendChild(iframe);
      }
    } catch (err) {
      container.innerHTML = `<p style="color:red;">Error loading content: ${url}</p>`;
    }
  }
}

customElements.define("locked-image", LockedImag);
