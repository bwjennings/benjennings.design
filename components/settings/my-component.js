

// Define the custom element my-component
customElements.define("my-component", class extends HTMLElement {
    constructor() {
      super();
    
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.innerHTML = `
        <style>
        @import "style.css";
        
        </style>
        <button id="openBtn">Settings</button>
        <dialog id="dialog">
         
       
 
    
    
        <form id="themeSelect">
        
        
        <input type="radio" id="dark" name="theme" value="dark">
        <label for="dark">Dark</label><br>
        
        <input type="radio" id="light" name="theme" value="light">
        <label for="light">Light</label><br>
        
        
      </form>
          <button id="closeBtn">Close</button>
        </dialog>
      `;
      
      this.openBtn = shadowRoot.getElementById('openBtn');
      this.closeBtn = shadowRoot.getElementById('closeBtn');
      this.dialog = shadowRoot.getElementById('dialog');
      
      // Theme change handling within shadow DOM
      const themeSelectForm = shadowRoot.getElementById('themeSelect');
      themeSelectForm.addEventListener('change', (event) => {
        const selectedTheme = event.target.value;
        document.documentElement.setAttribute('data-theme', selectedTheme);
        localStorage.setItem('myCustomTheme', selectedTheme);
      });
  
      this.openBtn.addEventListener('click', () => this.dialog.showModal());
      this.closeBtn.addEventListener('click', () => this.dialog.close());
    }
  
    connectedCallback() {
      const storedTheme = localStorage.getItem('myCustomTheme');
      if (storedTheme) {
        document.documentElement.setAttribute('data-theme', storedTheme);
        this.shadowRoot.querySelector(`input[name="theme"][value="${storedTheme}"]`).checked = true;
      }
    }
  });
  