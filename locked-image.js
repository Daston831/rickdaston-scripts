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

    // If still locked → always show final
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
    this.innerHTML = `<img src="${this.finalUrl}" style="max-width:100%;height:auto;display:block;margin:0 auto;">`;
  }
}

customElements.define("locked-image", LockedImage);cked-image", LockedImage);
