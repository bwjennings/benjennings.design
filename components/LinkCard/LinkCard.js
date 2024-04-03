class LinkCard extends HTMLElement {
    constructor() {
      super();
  
      // Attach a shadow root to the element.
      this.attachShadow({ mode: 'open' });
  
      // Define styles for the component
      const styles = `
        <style>
          .link-card {
            padding: 10px;
            border: 1px solid #ccc;
            display: block;
            margin-bottom: 10px;
           
          }
          .edit {
            font-style: italic;
            color: #999;
          }
          .title {
            font-size: 18px;
            color: #333;
          }
        </style>
      `;
  
      // Define the HTML structure of the component
      const html = `
        <div class="link-card">
          <div class="edit">${this.getAttribute('icon')}</div>
          <h1>${this.getAttribute('title')}</h1>
        </div>
      `;
  
      // Combine styles and HTML, then append them to the shadow root
      this.shadowRoot.innerHTML = `${styles}${html}`;
    }
  }
  
  // Define the 'link-card' custom element
  customElements.define('link-card', LinkCard);
  