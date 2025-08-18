customElements.define(
  "simple-card",
  class extends HTMLElement {
    static get observedAttributes() {
      return ["title", "version", "dialog-id"];
    }

    // Template cache
    static getTemplate() {
      if (!this.template) {
        this.template = document.createElement("template");
        this.template.innerHTML = `
          <style>
            :host { display: block; }
            .card-container { cursor: pointer; position: relative; }
          </style>
          <link href="/src/assets/styles/components/card.css" rel="stylesheet" />
          <div class="card-container">
            <slot name="media"></slot>
            <h2 class="card-title heading sm"></h2>
            <slot class="badge-group" name="badge"></slot>
            <slot name="content"></slot>
          </div>
          <dialog part="dialog">
            <div class="wrapper">
              <header>
                <h2 class="heading md" id="dialog-title"></h2>
                <button class="icon-button" id="closeBtn1" aria-label="Close dialog">close</button>
              </header>
              <slot class="lg body post" tabindex="0" name="post"></slot>
              <footer>
                <button autofocus id="closeBtn2">Close</button>
              </footer>
            </div>
          </dialog>
        `;
      }
      return this.template;
    }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(
        this.constructor.getTemplate().content.cloneNode(true)
      );

      // Init from attributes
      this._title = this.getAttribute("title") || "";
      this._version = this.getAttribute("version") || "";
      this._dialogId = this.getAttribute("dialog-id") || "";

      // Bind handlers
      this.handleClick = this.handleClick.bind(this);
    }

    connectedCallback() {
      this.tabIndex = 0;
      this.setAttribute("role", "button");

      // Cache refs
      this._cardContainer = this.shadowRoot.querySelector(".card-container");
      this._dialog = this.shadowRoot.querySelector("dialog");
      this._cardTitle = this.shadowRoot.querySelector(".card-title");
      this._dialogTitle = this.shadowRoot.getElementById("dialog-title");

      // Verify required elements
      if (!this._cardContainer || !this._dialog) {
        console.error("Required card elements not found in shadow DOM");
        return;
      }

      // Delegated click listener
      this.shadowRoot.addEventListener("click", this.handleClick);

      this.updateComponent();
    }

    disconnectedCallback() {
      this.shadowRoot.removeEventListener("click", this.handleClick);
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        const propName = this._attributeToProperty(name);
        this[propName] = newValue;
        this.updateComponent();
      }
    }

    _attributeToProperty(attributeName) {
      return (
        "_" +
        attributeName.replace(/-([a-z])/g, (match, letter) =>
          letter.toUpperCase()
        )
      );
    }
  
    get title() {
      return this._title;
    }
    set title(value) {
      this._title = value;
      this.setAttribute("title", value);
      this.updateComponent();
    }

    get version() {
      return this._version;
    }
    set version(value) {
      this._version = value;
      this.setAttribute("version", value);
      this.updateComponent();
    }

    get dialogId() {
      return this._dialogId;
    }
    set dialogId(value) {
      this._dialogId = value;
      this.setAttribute("dialog-id", value);
      this.updateComponent();
    }

    updateComponent() {
      if (this._cardTitle) this._cardTitle.textContent = this._title;
      if (this._dialogTitle) this._dialogTitle.textContent = this._title;

      const mediaSlot = this.shadowRoot.querySelector('slot[name="media"]');
      if (mediaSlot) mediaSlot.className = this._version || "";

      // Generate dialog ID
      if (!this._dialogId) {
        this._dialogId = `dialog-${Math.random().toString(36).substr(2, 9)}`;
        this.setAttribute("dialog-id", this._dialogId);
      }
    }

    // Delegated click handler
    handleClick(event) {
      const path = event.composedPath();

      // Close dialog
      if (path.some((el) => el.id === "closeBtn1" || el.id === "closeBtn2")) {
        event.stopPropagation();
        this.closeDialog(event);
        return;
      }

      // Open dialog
      if (
        path.some(
          (el) =>
            el.classList && el.classList.contains("card-container")
        )
      ) {
        this.showDialog();
        return;
      }

      // Backdrop click closes
      if (event.target.nodeName === "DIALOG" && this._dialog) {
        const wrapper = this._dialog.querySelector(".wrapper");
        if (wrapper) {
          const rect = wrapper.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          ) {
            event.stopPropagation();
            this.closeDialog(event);
          }
        }
      }
    }

    showDialog() {
      if (this._dialog && !this._dialog.open) {
        this._dialog.showModal();
        this.trackDialogOpen();
      }
    }

    closeDialog(event) {
      if (event) event.stopPropagation();
      if (this._dialog && this._dialog.open) {
        this._dialog.close();
      }
    }

    trackDialogOpen() {
      console.log("Dialog opened");
      if (typeof gtag === "function") {
        gtag("event", "open_card", {
          event_category: "Dialog",
          event_label: `Card - ${this._title}`,
          value: 1,
        });
      }
    }
  }
);
