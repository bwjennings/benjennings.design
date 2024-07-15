customElements.define(
  "simple-card",
  class extends HTMLElement {
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

      this.closeBtn1 = shadowRoot.getElementById("closeBtn1");
      this.closeBtn2 = shadowRoot.getElementById("closeBtn2");
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
      const title = this.getAttribute("title") || "Title";
      const badge = this.getAttribute("badge");
      
      const badgeIcon = this.getAttribute("badge-icon");

      const badgeTemplate = badge
        ? `<my-badge variant="secondary" icon="${badgeIcon || ''}">${badge}</my-badge>`
        : "";

        

    
      this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="components/card/card.css">
        
        
        <div class="card-container">
       
        <slot name="thumbnail"></slot>
       
          <h2 class="heading sm ">${title}</h2>
          <button class="icon-button">open_in_full</button>
          ${badgeTemplate}
          
          <slot name="content"></slot>
          <dialog id="dialog" aria-labelledby="dialog-title">
            <div class="dialog-header">
              <h2 class="heading md" id="dialog-title">${title}</h2>
              <button class="icon-button" id="closeBtn1">Close</button>
            </div>
            <slot></slot>
            <slot name="image"></slot>
           
            <footer>
              <button autofocus id="closeBtn2">Close</button>
            </footer>
          </dialog>
        </div>`;

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