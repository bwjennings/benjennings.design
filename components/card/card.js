customElements.define(
  "simple-card",
  class extends HTMLElement {
    constructor() {
      super();

      const title = this.getAttribute("title") || "";
      const badge = this.getAttribute("badge");
      const badgeIcon = this.getAttribute("badge-icon");

      const shadowRoot = this.attachShadow({ mode: "open" });

      const style = document.createElement('link');
      style.rel = 'stylesheet';
      style.href = 'components/card/card.css';
      shadowRoot.appendChild(style);

      this.render();

      this.closeBtn1 = shadowRoot.getElementById("closeBtn1");
      this.closeBtn2 = shadowRoot.getElementById("closeBtn2");
      this.dialog = shadowRoot.getElementById("dialog");
      this.title = title;
      this.hasConnected = false;

      // Define the audio files for open and close sounds
      this.openSound = new Audio('designs/resources/Expand.m4a');
      this.openSound.volume = 0.5; // Adjust volume here (0.5 is 50%)

      this.closeSound = new Audio('designs/resources/Collapse.m4a');
      this.closeSound.volume = 0.5; // Adjust volume here (0.5 is 50%)
    }

    connectedCallback() {
      if (!this.hasConnected) {
        this.showDialog = () => {
          this.openSound.play(); // Play open sound
          this.dialog.showModal();
        };
        this.closeDialog = (event) => {
          event.stopPropagation();
          this.closeSound.play(); // Play close sound
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
        this.closeBtn1.addEventListener("click", this.closeDialog);
        this.closeBtn2.addEventListener("click", this.closeDialog);
        this.dialog.addEventListener("show", this.trackDialogOpen);

        this.hasConnected = true;
      }
    }

    disconnectedCallback() {
      this.removeEventListener("click", this.showDialog);
      this.closeBtn1.removeEventListener("click", this.closeDialog);
      this.closeBtn2.removeEventListener("click", this.closeDialog);
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
      const title = this.getAttribute("card-title");

      this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="components/card/card.css">
        <link rel="preload" as="audio" href="designs/resources/Expand.m4a">
        <link rel="preload" as="audio" href="designs/resources/Collapse.m4a">
        <div class="card-container">
          <slot name="thumbnail" class="thumbnail"></slot>
          <span class="${this.getAttribute("version") || 'icon'}"><span>${this.getAttribute("icon") || ''}</span></span>

          <h2 class="card-title heading sm">${title}</h2>
          <slot class="badge-group" name="badge"></slot>
          <slot name="content"></slot>
        </div>

        <dialog id="dialog">
        <div class="container">
          <header>
            <h2 class="heading md" id="dialog-title">${title}</h2>
            <button class="icon-button" id="closeBtn1">Close</button>
          </header>

          <slot class="body lg" name="post"></slot>

          <footer>
            <button autofocus id="closeBtn2">Close</button>
          </footer>
          </div>
        </dialog>
      `;

      // Reattach event listeners to the newly created elements
      this.closeBtn1 = this.shadowRoot.getElementById("closeBtn1");
      this.closeBtn2 = this.shadowRoot.getElementById("closeBtn2");
      this.dialog = this.shadowRoot.getElementById("dialog");
      if (this.hasConnected) {
        this.closeBtn1.addEventListener("click", this.closeDialog);
        this.closeBtn2.addEventListener("click", this.closeDialog);
        this.dialog.addEventListener("show", this.trackDialogOpen);
      }
    }
  }
);