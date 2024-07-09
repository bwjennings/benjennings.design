customElements.define(
  "simple-card",
  class extends HTMLElement {
    /**
     * The class constructor object
     */
    constructor() {
      super();

      const title = this.getAttribute("title") || "Title";
      const badge = this.getAttribute("badge");
      const badgeIcon = this.getAttribute("badge-icon");

      const shadowRoot = this.attachShadow({ mode: "open" });

      const style = document.createElement('link');
      style.rel = 'stylesheet';
      style.href = 'components/card/card.css';
      shadowRoot.appendChild(style);

      this.render();

      this.closeBtn = shadowRoot.getElementById("closeBtn");
      this.dialog = shadowRoot.getElementById("dialog");
      this.title = title;
      this.hasConnected = false;
    }

    connectedCallback() {
      if (!this.hasConnected) {
        this.showDialog = () => this.dialog.showModal();
        this.closeDialog = (event) => {
          event.stopPropagation();
          this.dialog.close();
        };
        this.trackDialogOpen = () => {
          console.log("Dialog opened");
          gtag('event', 'open_card', {
            'event_category': 'Dialog',
            'event_label': `Card - ${this.title}`,
            'value': 1
          });
        };

        this.addEventListener("click", this.showDialog);
        this.closeBtn.addEventListener("click", this.closeDialog);
        this.dialog.addEventListener("show", this.trackDialogOpen);

        this.hasConnected = true;
      }
    }

    disconnectedCallback() {
      this.removeEventListener("click", this.showDialog);
      this.closeBtn.removeEventListener("click", this.closeDialog);
      this.dialog.removeEventListener("show", this.trackDialogOpen);
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        switch (name) {
          case 'title':
            this.title = newValue;
            break;
          case 'badge':
          case 'badge-icon':
            // Update badge logic here if needed
            break;
          // handle other attributes if necessary
        }
        this.render(); // Re-render the component to reflect changes
      }
    }

    static get observedAttributes() {
      return ["title", "badge", "badge-icon"];
    }

    render() {
      const title = this.getAttribute("title") || "Title";
      const badge = this.getAttribute("badge");
      const badgeIcon = this.getAttribute("badge-icon");

      const badgeTemplate = badge
        ? `<my-badge icon="${badgeIcon || ''}">${badge}</my-badge>`
        : "";

      this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="components/card/card.css">
        <slot name="image"></slot>
        <div class="card-container">
          <h2 class="heading sm secondary">${title}</h2>
          <button class="icon-button">open_in_full</button>
          ${badgeTemplate}
          <slot name="content"></slot>
          <dialog id="dialog" aria-labelledby="dialog-title">
            <div class="title-group">
              <h2 class="heading md" id="dialog-title">${title}</h2>
              <button class="icon-button" id="closeBtn">Close</button>
            </div>
            <slot></slot>
          </dialog>
        </div>`;
      
      // Reattach event listeners to the newly created elements
      this.closeBtn = this.shadowRoot.getElementById("closeBtn");
      this.dialog = this.shadowRoot.getElementById("dialog");
      if (this.hasConnected) {
        this.closeBtn.addEventListener("click", this.closeDialog);
        this.dialog.addEventListener("show", this.trackDialogOpen);
      }
    }
  }
);