customElements.define(
  "simple-card",
  class extends HTMLElement {
    constructor() {
      super();

      // Attach shadow DOM
      const shadowRoot = this.attachShadow({ mode: "open" });

      // Create a template for the component's content without attribute-dependent values
      const template = document.createElement('template');
      template.innerHTML = `
        <link rel="stylesheet" href="components/card/card.css">
        <link rel="preload" as="audio" href="designs/resources/Expand.m4a">
        <link rel="preload" as="audio" href="designs/resources/Collapse.m4a">
        <div class="card-container">
          <slot name="thumbnail" class="thumbnail"></slot>
          <span class="">
            <span></span>
          </span>
          <h2 class="card-title heading sm"></h2>
          <slot class="badge-group" name="badge"></slot>
          <slot name="content"></slot>
        </div>
        <dialog id="dialog">
          <div class="container">
            <header>
              <h2 class="heading md" id="dialog-title"></h2>
              <button class="icon-button" id="closeBtn1">Close</button>
            </header>
            <slot class="content lg body" name="post"></slot>
            <footer>
              <button autofocus id="closeBtn2">Close</button>
            </footer>
          </div>
        </dialog>
      `;

      // Append the cloned template content to the shadow DOM
      shadowRoot.appendChild(template.content.cloneNode(true));

      // Reference to elements in the shadow DOM
      this.closeBtn1 = shadowRoot.getElementById("closeBtn1");
      this.closeBtn2 = shadowRoot.getElementById("closeBtn2");
      this.dialog = shadowRoot.getElementById("dialog");

      // Bind methods to ensure proper 'this' context
      this.showDialog = this.showDialog.bind(this);
      this.closeDialog = this.closeDialog.bind(this);
      this.trackDialogOpen = this.trackDialogOpen.bind(this);
    }

    connectedCallback() {
      // Update the component with current attributes
      this.updateComponent();

      if (!this.hasConnected) {
        // Event listeners
        this.addEventListener("click", this.showDialog);
        this.closeBtn1.addEventListener("click", this.closeDialog);
        this.closeBtn2.addEventListener("click", this.closeDialog);
        this.dialog.addEventListener("show", this.trackDialogOpen);

        this.hasConnected = true;
      }
    }

    disconnectedCallback() {
      // Remove event listeners to prevent memory leaks
      this.removeEventListener("click", this.showDialog);
      this.closeBtn1.removeEventListener("click", this.closeDialog);
      this.closeBtn2.removeEventListener("click", this.closeDialog);
      this.dialog.removeEventListener("show", this.trackDialogOpen);
    }

    static get observedAttributes() {
      return ["title", "badge", "badge-icon", "version", "icon"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        // Update the component to reflect the changed attribute
        this.updateComponent();
      }
    }

    updateComponent() {
      // Update the title
      const title = this.getAttribute('title') || '';
      const cardTitle = this.shadowRoot.querySelector('.card-title');
      if (cardTitle) {
        cardTitle.textContent = title;
      }
      const dialogTitle = this.shadowRoot.getElementById('dialog-title');
      if (dialogTitle) {
        dialogTitle.textContent = title;
      }

      // Update version and icon
      const version = this.getAttribute('version') || '';
      const icon = this.getAttribute('icon') || '';
      const spanElement = this.shadowRoot.querySelector('div.card-container > span');
      if (spanElement) {
        spanElement.className = version;
        const innerSpan = spanElement.querySelector('span');
        if (innerSpan) {
          innerSpan.textContent = icon;
        }
      }

      // Handle badge and badge-icon updates if necessary
      // Add any additional attribute updates here
    }

    // Methods to handle dialog actions
    showDialog() {
      if (!this.dialog.open) {
        this.dialog.showModal();
      }
    }

    closeDialog(event) {
      event.stopPropagation();
      this.dialog.close();
    }

    trackDialogOpen() {
      console.log("Dialog opened");
      // Ensure gtag is defined before calling it
      if (typeof gtag === 'function') {
        gtag('event', 'open_card', {
          'event_category': 'Dialog',
          'event_label': `Card - ${this.getAttribute('title')}`,
          'value': 1
        });
      }
    }
  }
);
