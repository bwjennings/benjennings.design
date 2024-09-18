class MyPopover extends HTMLElement {
    constructor() {
      super();
      // Attach shadow DOM
      this.attachShadow({ mode: 'open' });

      // Create the button
      this.button = document.createElement('button');
      this.button.textContent = this.getAttribute('trigger-text') || 'Toggle the popover';

      // Create the popover content container
      this.popover = document.createElement('div');
      this.popover.classList.add('popover-content');
      this.popoverContent = document.createElement('slot');
      this.popover.appendChild(this.popoverContent);

      // Append elements to shadow DOM
      this.shadowRoot.append(this.button, this.popover);

      // Add styles
      const style = document.createElement('style');
      style.textContent = `
        .popover-content {
          display: none;
          position: absolute;
          border: 1px solid #ccc;
          background: white;
          padding: 10px;
          box-shadow: 0px 2px 6px rgba(0,0,0,0.2);
          z-index: 10;
        }
        :host {
          position: relative;
          display: inline-block;
        }
      `;
      this.shadowRoot.appendChild(style);

      // Bind event handlers
      this.togglePopover = this.togglePopover.bind(this);
    }

    connectedCallback() {
      this.button.addEventListener('click', this.togglePopover);
    }

    disconnectedCallback() {
      this.button.removeEventListener('click', this.togglePopover);
    }

    togglePopover() {
      const isHidden = this.popover.style.display === 'none' || !this.popover.style.display;
      this.popover.style.display = isHidden ? 'block' : 'none';
    }
  }

  customElements.define('custom-popover', MyPopover);