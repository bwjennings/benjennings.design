class CustomButton extends HTMLButtonElement {
    constructor() {
      super();
  
      // Create a shadow DOM (optional, but recommended for styling isolation)
      const shadowRoot = this.attachShadow({ mode: 'open' });
  
      // Base styles
      const style = document.createElement('style');
      style.textContent = `
        :host { /* Style the button itself */
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        }
  
        /*  Default Variant */ 
        :host {
          background-color: #eee; 
          color: #333;
        } 
  
        /* 'brand' Variant */ 
        :host([variant="brand"]) {
          background-color: #007bff; 
          color: white;
        }
      `;
  
      shadowRoot.appendChild(style);
    }
  }
  
  customElements.define('custom-button', CustomButton, { extends: 'button' });
  