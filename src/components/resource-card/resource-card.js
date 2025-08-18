


    class ResourceCard extends HTMLElement {
      constructor() {
        super();
        // Attach shadow DOM
        const shadow = this.attachShadow({ mode: "open" });
    
        // Template
        const template = document.createElement("template");
    
        template.innerHTML = `
         <style>
        :host {
        }
        .resource-card {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          height: 100%;
          background: var(--color-surface-b);
          border: 1px solid var(--color-border-primary);
          border-radius:var(--radius-md);
          container-type: inline-size;
          transition: outline 300ms var(--transition-timing-style),
            font-variation-settings 300ms var(--transition-timing-style);
          font-variation-settings: "GRAD" 0;
          color: var(--color-text-primary);
          overflow: hidden;
          outline-offset: 0px;
          anchor-name: --card;
        }
        .iconbox {
          --animation-position: 0;
          font-variation-settings: 'GRAD' -200, 'FILL' var(--icon-fill);
          font-family: var(--icon-font-family);
          width:15cqw;
          text-align: center;
          font-variation-settings: 'FILL' var(--icon-fill), 'wght' var(--icon-weight-lg), 'GRAD' var(--icon-grade-emphasis);
          overflow: hidden;
          aspect-ratio: 1 / 1;
          display: flex;
          align-self: stretch;
          background: var(--color-surface-c);
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: var(--color-icon-base-c);
          user-select: none;
          -webkit-user-select: none;
          container-name:iconbox;
          container-type:inline-size;
                    max-height:150px;


          
}
          @container (max-width: 450px) {
          .iconbox{
 display:none
      }
        }
       .content-area {
          display: flex;
          flex: 1 0 0;
          padding: 24px;
          align-items: center;
          gap: 16px;
          min-width:200px
}
        .title-group {
          flex: 1 0 0; 
          display: flex;
          gap:2px;
          flex-direction: column;
}

        .iconbox span {
          line-height: 100%;
          rotate: -20deg;
          opacity: 0.5;
          animation: iconAnimate 5s var(--transition-timing-motion) infinite alternate;
          font-weight: var(--icon-weight-lg);
          font-size: 130cqw;

        }
      
 
      </style>
      <link rel="stylesheet" href="/src/assets/styles/components/button.css">
      <div class="resource-card">
            <div class="iconbox">
              <span>demography</span>
            </div>
            <div class="content-area">
              <div class="title-group">
                <div class="heading sm">Title</div>
                <div class="body secondary description">Description</div>
              </div>
              <button part="button" class="button">
                <div class="icon">link</div>
                <span class="button-text">Download</span>
              </button>
            </div>
          </div>
        `;
    
        // Attach template
        shadow.appendChild(template.content.cloneNode(true));
    
        // Cache refs
        this.boxIconElement = shadow.querySelector('.iconbox span');
        this.titleElement = shadow.querySelector('.heading.sm');
        this.descriptionElement = shadow.querySelector('.description');
        this.buttonElement = shadow.querySelector('.button');
        this.buttonTextElement = shadow.querySelector('.button-text');
        this.buttonIconElement = shadow.querySelector('.button .icon');
    
        // Button click
        if (this.buttonElement) {
          this.buttonElement.addEventListener('click', () => {
            const url = this.getAttribute('button-url');
            if (url) {
              window.location.href = url;
            }
          });
        }
      }
    
      static get observedAttributes() {
        return ['icon', 'title', 'description', 'button-text', 'button-url'];
      }
    
      attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
          case 'icon':
            if (this.boxIconElement) {
              this.boxIconElement.textContent = newValue;
            }
            break;
          case 'title':
            if (this.titleElement) {
              this.titleElement.textContent = newValue;
            }
            break;
          case 'description':
            if (this.descriptionElement) {
              this.descriptionElement.textContent = newValue;
            }
            break;
          case 'button-text':
            if (this.buttonTextElement) {
              this.buttonTextElement.textContent = newValue;
            }
            break;
          case 'button-url':
            // Handled in click
            break;
        }
      }
    
      connectedCallback() {
        // Init from attributes
        if (this.hasAttribute('icon') && this.boxIconElement) {
          this.boxIconElement.textContent = this.getAttribute('icon');
        }
        if (this.hasAttribute('title') && this.titleElement) {
          this.titleElement.textContent = this.getAttribute('title');
        }
        if (this.hasAttribute('description') && this.descriptionElement) {
          this.descriptionElement.textContent = this.getAttribute('description');
        }
        if (this.hasAttribute('button-text') && this.buttonTextElement) {
          this.buttonTextElement.textContent = this.getAttribute('button-text');
        }
      }
    }
    
    customElements.define("resource-card", ResourceCard);
