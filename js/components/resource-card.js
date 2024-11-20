


    class ResourceCard extends HTMLElement {
      constructor() {
        super();
        // Attach a shadow DOM tree to this instance
        const shadow = this.attachShadow({ mode: "open" });
    
        // Create a template element
        const template = document.createElement("template");
    
        // Define the HTML structure in the template
        template.innerHTML = `
         <style>
            @import 'css/index.css' ;
        :host {
        }
        .resource-card {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          height: 100%;
          background: var(--background-primary);
          border: 1px solid var(--border-primary);
          container-type: inline-size;
          transition: outline 300ms cubic-bezier(0.46, 1.33, 0.68, 1.58),
            font-variation-settings 300ms cubic-bezier(0.46, 1.33, 0.68, 1.58);
          font-variation-settings: "GRAD" 0;
          color: var(--foreground-primary);
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
          font-variation-settings: 'FILL' var(--icon-fill), 'wght' 700, 'GRAD' 200;
          overflow: hidden;
          aspect-ratio: 1 / 1;
          display: flex;
          align-self: stretch;
          background: var(--background-brand-secondary);
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: var(--foreground-brand-secondary);
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
          gap: 16px; /* Optional spacing between items */
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
          animation: iconAnimate 5s ease-in-out infinite alternate;
          font-weight: 600;
          font-size: 130cqw;

        }
      
 
      </style>
          <div class="resource-card">
            <div class="iconbox">
              <span>demography</span>
            </div>
            <div class="content-area">
              <div class="title-group">
                <div class="heading sm title">Title</div>
                <div class="body secondary description">Description</div>
              </div>
              <button part="button" class="button">
                <div class="icon">link</div>
                <span class="button-text">Download</span>
              </button>
            </div>
          </div>
        `;
    
        // Clone the template content and attach it to the shadow DOM
        shadow.appendChild(template.content.cloneNode(true));
    
        // Store references to the elements
        this.boxIconElement = shadow.querySelector('.iconbox span'); // Icon in the box
        this.titleElement = shadow.querySelector('.title');
        this.descriptionElement = shadow.querySelector('.description');
        this.buttonElement = shadow.querySelector('.button');
        this.buttonTextElement = shadow.querySelector('.button-text');
        this.buttonIconElement = shadow.querySelector('.button .icon'); // Icon in the button
    
        // Add click event listener to the button
        this.buttonElement.addEventListener('click', () => {
          const url = this.getAttribute('button-url');
          if (url) {
            window.location.href = url;
          }
        });
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
            // No action needed; the click handler reads the attribute directly
            break;
        }
      }
    
      connectedCallback() {
        // Initialize the component with current attribute values
        if (this.hasAttribute('icon')) {
          this.boxIconElement.textContent = this.getAttribute('icon');
        }
        if (this.hasAttribute('title')) {
          this.titleElement.textContent = this.getAttribute('title');
        }
        if (this.hasAttribute('description')) {
          this.descriptionElement.textContent = this.getAttribute('description');
        }
        if (this.hasAttribute('button-text')) {
          this.buttonTextElement.textContent = this.getAttribute('button-text');
        }
      }
    }
    
    // Define the new element
    customElements.define("resource-card", ResourceCard);