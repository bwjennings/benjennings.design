


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
          align-items: center;
          justify-content: flex-start;
          gap: 16px;
          padding: 16px;
          border-radius: 32px;
          box-sizing: border-box;
          height: 100%;
          overflow: hidden;
          position: relative;
        }
        
        /* Card style variants */
        .resource-card[data-style="a"] {
          background: var(--color-surface-a, #b8eaff);
        }
        .resource-card[data-style="b"] {
          background: var(--color-surface-b, #c6e5ff);
        }
        .resource-card[data-style="c"] {
          background: var(--color-surface-c, #d6dfff);
        }
        .resource-card[data-style="d"] {
          background: var(--color-surface-d, #e6daff);
        }

        .icon {
          font-family: 'Material Symbols Sharp', sans-serif;
          font-size: 40.26px;
          line-height: 0;
          font-style: normal;
          font-weight: 400;
          flex-shrink: 0;
          position: relative;
          text-wrap: nowrap;
        }
        
        /* Icon colors per style */
        .resource-card[data-style="a"] .icon {
          color: var(--color-icon-base, #64a1ff);
        }
        .resource-card[data-style="b"] .icon {
          color: var(--color-icon-base-b, #8b75ee);
        }
        .resource-card[data-style="c"] .icon {
          color: var(--color-icon-base-c, #ab69dc);
        }
        .resource-card[data-style="d"] .icon {
          color: var(--color-icon-base-d, #c35fc0);
        }

        .content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          flex: 1 0 0;
          min-width: 150px;
          min-height: 1px;
          font-family: 'Roboto Flex', sans-serif;
          line-height: 0;
          font-style: normal;
          position: relative;
        }

        .title {
          font-size: 30.21px;
          line-height: 1.1;
          font-weight: 500;
          width: 100%;
          position: relative;
          flex-shrink: 0;
        }
        
        .description {
          font-size: 10.24px;
          line-height: 12.8px;
          font-weight: 450;
          width: 100%;
          position: relative;
          flex-shrink: 0;
        }

        /* Text colors per style */
        .resource-card[data-style="a"] .title {
          color: var(--color-text-base, #212f40);
        }
        .resource-card[data-style="a"] .description {
          color: var(--color-text-base-secondary, #282d40);
        }
        .resource-card[data-style="b"] .title,
        .resource-card[data-style="b"] .description {
          color: var(--color-text-base-b, #282d40);
        }
        .resource-card[data-style="c"] .title,
        .resource-card[data-style="c"] .description {
          color: var(--color-text-base-c, #2f2a3e);
        }
        .resource-card[data-style="d"] .title,
        .resource-card[data-style="d"] .description {
          color: var(--color-text-base-d, #34283b);
        }


        .hidden {
          display: none;
        }
      
      </style>
      <link rel="stylesheet" href="/src/assets/styles/components/button.css">
      <div class="resource-card" data-style="a">
        <div class="icon" aria-hidden="true">demography</div>
        <div class="content">
          <div class="title">Title</div>
          <div class="description">Description</div>
        </div>
        <a class="button secondary resource-action">
          <span class="icon" aria-hidden="true">download</span>
          <span class="label">Download</span>
        </a>
      </div>
        `;
    
        // Attach template
        shadow.appendChild(template.content.cloneNode(true));
    
        // Cache refs
        this.cardElement = shadow.querySelector('.resource-card');
        this.iconElement = shadow.querySelector('.icon');
        this.titleElement = shadow.querySelector('.title');
        this.descriptionElement = shadow.querySelector('.description');
        this.linkElement = shadow.querySelector('.resource-action');
        this.buttonTextElement = shadow.querySelector('.resource-action .label');
        this.buttonIconElement = shadow.querySelector('.resource-action .icon');
      }

      static get observedAttributes() {
        return ['icon', 'title', 'description', 'button-text', 'button-url', 'style', 'show-description'];
      }
    
      attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
          case 'icon':
            if (this.iconElement) {
              this.iconElement.textContent = newValue;
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
            if (this.linkElement) {
              if (newValue) {
                this.linkElement.setAttribute('href', newValue);
                this.linkElement.removeAttribute('aria-disabled');
                this.linkElement.tabIndex = 0;
              } else {
                this.linkElement.removeAttribute('href');
                this.linkElement.setAttribute('aria-disabled', 'true');
                this.linkElement.tabIndex = -1;
              }
            }
            break;
          case 'style':
            if (this.cardElement && newValue && ['a', 'b', 'c', 'd'].includes(newValue)) {
              this.cardElement.setAttribute('data-style', newValue);
            }
            break;
          case 'show-description':
            if (this.descriptionElement) {
              if (newValue === 'false') {
                this.descriptionElement.classList.add('hidden');
              } else {
                this.descriptionElement.classList.remove('hidden');
              }
            }
            break;
        }
      }
    
      connectedCallback() {
        // Init from attributes
        if (this.hasAttribute('icon') && this.iconElement) {
          this.iconElement.textContent = this.getAttribute('icon');
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
        if (this.linkElement) {
          const url = this.getAttribute('button-url');
          if (url) {
            this.linkElement.setAttribute('href', url);
            this.linkElement.removeAttribute('aria-disabled');
            this.linkElement.tabIndex = 0;
          } else {
            this.linkElement.removeAttribute('href');
            this.linkElement.setAttribute('aria-disabled', 'true');
            this.linkElement.tabIndex = -1;
          }
        }
        if (this.hasAttribute('style') && this.cardElement) {
          const style = this.getAttribute('style');
          if (['a', 'b', 'c', 'd'].includes(style)) {
            this.cardElement.setAttribute('data-style', style);
          }
        }
        if (this.hasAttribute('show-description') && this.descriptionElement) {
          if (this.getAttribute('show-description') === 'false') {
            this.descriptionElement.classList.add('hidden');
          }
        }
      }
    }
    
    customElements.define("resource-card", ResourceCard);
