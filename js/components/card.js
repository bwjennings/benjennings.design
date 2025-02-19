customElements.define(
  "simple-card",
  class extends HTMLElement {
    static get observedAttributes() {
      return ["title", "version", "dialog-id"];
    }

    // Cache and reuse the template
    static getTemplate() {
      if (!this.template) {
        this.template = document.createElement("template");
        this.template.innerHTML = `
          <style>
            :host { display: block; }
            .card-container { cursor: pointer; position: relative; }
            /* Additional styles as needed */
          </style>
          <link href="css/components/card.css" rel="stylesheet" />
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
              <slot class="lg body post" name="post"></slot>
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

      // Initialize properties from attributes
      this._title = this.getAttribute("title") || "";
      this._version = this.getAttribute("version") || "";
      this._dialogId = this.getAttribute("dialog-id") || "";
      this.originalEntryKey = null;

      // Bind methods
      this.handleClick = this.handleClick.bind(this);
      this.handleNavigate = this.handleNavigate.bind(this);
      this.handlePopState = this.handlePopState.bind(this);
    }

    connectedCallback() {
      // Cache DOM references
      this._cardContainer = this.shadowRoot.querySelector(".card-container");
      this._dialog = this.shadowRoot.querySelector("dialog");
      this._cardTitle = this.shadowRoot.querySelector(".card-title");
      this._dialogTitle = this.shadowRoot.getElementById("dialog-title");

      // Consolidated event listener on shadowRoot for clicks
      this.shadowRoot.addEventListener("click", this.handleClick);

      // Navigation API or popstate fallback
      if ("navigation" in window) {
        navigation.addEventListener("navigate", this.handleNavigate);
      } else {
        window.addEventListener("popstate", this.handlePopState);
      }

      this.updateComponent();

      // Check URL hash after initialization
      requestAnimationFrame(() => {
        this.checkUrlForDialog();
      });
    }

    disconnectedCallback() {
      this.shadowRoot.removeEventListener("click", this.handleClick);
      if ("navigation" in window) {
        navigation.removeEventListener("navigate", this.handleNavigate);
      } else {
        window.removeEventListener("popstate", this.handlePopState);
      }
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

    // Getters and setters
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

      // Generate a unique dialog ID if not provided
      if (!this._dialogId) {
        this._dialogId = `dialog-${Math.random().toString(36).substr(2, 9)}`;
        this.setAttribute("dialog-id", this._dialogId);
      }
    }

    // Single click handler for event delegation
    handleClick(event) {
      const path = event.composedPath();

      // If a close button was clicked, close the dialog
      if (path.some((el) => el.id === "closeBtn1" || el.id === "closeBtn2")) {
        event.stopPropagation();
        this.closeDialog(event);
        return;
      }

      // If the click originates from the card container (or its slotted children), open the dialog
      if (
        path.some(
          (el) =>
            el.classList && el.classList.contains("card-container")
        )
      ) {
        this.showDialog();
        return;
      }

      // If clicking on the dialog background (outside the .wrapper), close the dialog
      if (event.target.nodeName === "DIALOG") {
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

        // Push a new navigation entry with the dialog ID in the hash
        if ("navigation" in window) {
          this.originalEntryKey = navigation.currentEntry.key;
          const url = new URL(window.location);
          url.hash = this._dialogId;
          navigation.navigate(url.toString(), { history: "push" });
        } else {
          const url = new URL(window.location);
          url.hash = this._dialogId;
          window.history.pushState({ dialogOpen: true }, "", url.toString());
        }
      }
    }

    closeDialog(event) {
      if (event) event.stopPropagation();
      if (this._dialog && this._dialog.open) {
        this._dialog.close();
      }

      if ("navigation" in window) {
        if (this.originalEntryKey) {
          navigation.traverseTo(this.originalEntryKey);
          this.originalEntryKey = null;
        } else {
          navigation.navigate(document.location.pathname, {
            history: "replace",
          });
        }
      } else {
        window.history.back();
      }
    }

    handleNavigate(event) {
      const dialog = this._dialog;
      const url = new URL(event.destination.url);
      const hash = url.hash.slice(1); // Remove the '#' character

      if (hash === this._dialogId && dialog && !dialog.open) {
        this.showDialog();
        event.intercept({
          handler: () => {
            console.log("Navigation intercepted to prevent reloading");
            return Promise.resolve();
          },
        });
      } else if (hash !== this._dialogId && dialog && dialog.open) {
        dialog.close();
        event.intercept({
          handler: () => {
            console.log("Navigation intercepted to prevent reloading");
            return Promise.resolve();
          },
        });
      }
    }

    // Fallback for browsers without the Navigation API
    handlePopState(event) {
      const currentHash = window.location.hash.slice(1);
      if (currentHash === this._dialogId && this._dialog && !this._dialog.open) {
        this.showDialog();
      } else if (currentHash !== this._dialogId && this._dialog && this._dialog.open) {
        this._dialog.close();
      }
    }

    checkUrlForDialog() {
      const currentHash = window.location.hash.slice(1);
      if (currentHash === this._dialogId) {
        this.showDialog();
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