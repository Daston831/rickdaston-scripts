class LockedImage extends HTMLElement {
  connectedCallback() {
    const temp = this.getAttribute("temp");
    const final = this.getAttribute("final");
    const locktime = parseInt(this.getAttribute("locktime") || "60000", 10);

    const container = document.createElement("div");
    container.style.width = "100%";
    container.style.height = "100vh";
    container.style.overflow = "hidden";

    const iframe = document.createElement("iframe");
    iframe.src = temp;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";

    container.appendChild(iframe);
    this.appendChild(container);

    // After 10s, switch to final page
    setTimeout(() => {
      iframe.src = final;
      localStorage.setItem("locked-final", Date.now().toString());
    }, 10000);

    // Prevent swipe-to-refresh & back nav
    window.addEventListener("beforeunload", (e) => {
      if (Date.now() - parseInt(localStorage.getItem("locked-final") || "0", 10) < locktime) {
        e.preventDefault();
        e.returnValue = "";
      }
    });

    window.addEventListener("popstate", () => {
      if (Date.now() - parseInt(localStorage.getItem("locked-final") || "0", 10) < locktime) {
        history.pushState(null, "", document.URL);
      }
    });

    document.addEventListener("touchmove", (e) => {
      if (e.touches[0].clientY > 50) e.preventDefault();
    }, { passive: false });
  }
}
customElements.define("locked-image", LockedImage);
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
