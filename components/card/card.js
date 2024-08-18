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
      const title = this.getAttribute("card-title");
     
      

     

        

    
      this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="components/card/card.css">
        
        
        <div class="card-container">
          <slot name="thumbnail" class="thumbnail"></slot>
         
          <p class="${this.getAttribute("version") || 'icon'}">${this.getAttribute("icon")|| ''}</p>

          <h2 class="card-title heading sm">${title}</h2>
          <slot class="badge-group" name="badge"></slot>
          



          <slot name="content"></slot>
        </div>

        <dialog id="dialog" >
        <div class="container">
          <header>
          
            <h2 class="heading md" id="dialog-title">${title}</h2>
            <button class="icon-button" id="closeBtn1">Close</button>
          </header>
          

            <slot class="body lg" name="post"></slot>
           

        

          <footer>
            <button variant="brand" autofocus id="closeBtn2">Close</button>
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

