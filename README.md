class LockedImage extends HTMLElement {
  connectedCallback() {
    this.tempUrl = this.getAttribute("temp");
    this.finalUrl = this.getAttribute("final");
    this.lockTime = 10 * 60 * 1000; // 10 minutes
    this.tempDuration = 10 * 1000; // 10 seconds

    this.loadImage();
  }

  loadImage() {
    const now = Date.now();
    const lockUntil = localStorage.getItem("lockedImageUntil");

    // If locked → show final page immediately
    if (lockUntil && now < parseInt(lockUntil, 10)) {
      this.showFinal();
    } else {
      this.showTemp();
    }
  }

  showTemp() {
    this.innerHTML = `<img src="${this.tempUrl}" style="max-width:100%;height:auto;display:block;margin:0 auto;">`;

    setTimeout(() => {
      this.showFinal();

      // Lock for 10 minutes
      const lockUntil = Date.now() + this.lockTime;
      localStorage.setItem("lockedImageUntil", lockUntil.toString());
    }, this.tempDuration);
  }

  showFinal() {
    this.innerHTML = `<iframe src="${this.finalUrl}" style="width:100%;height:600px;border:none;display:block;margin:0 auto;"></iframe>`;
  }
}

customElements.define("locked-image", LockedImage
