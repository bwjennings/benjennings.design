class Card extends HTMLElement {
    constructor() {
        super();
        
        // Attach a shadow root to the element.
        this.attachShadow({ mode: 'open' });
        // Define styles for the component
      const styles = `
      <style>
      .card {
        background: var(--background-neutral, #f1f1f1);
        border-radius: 40px;
        border-style: solid;
        border-color: var(--border-neutral, #bfbfbf);
        border-width: 1px;
        padding: 40px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: top;
        justify-content: left;
        align-self: stretch;
        flex-shrink: 0;
        height:60dvh;
        position: relative;
        overflow: hidden;
        scroll-snap-align: center;
        scroll-padding: 20px;
      }
      .card-title{
        font-family: var(--title-font-family, "Inter-Medium", sans-serif);
  font-size: var(--title-font-size, 24px);
  line-height: var(--title-line-height);
  font-weight: var(--title-font-weight, 500);
  position: relative;
  align-self: stretch;
      }
      </style>
    `;
        
        // Define the HTML structure of the component
        const html = `
          <div class="card">
            <div class="card-title">${this.getAttribute('title')}</div>
            <p>${this.getAttribute('body')}</p>
          </div>
        `;
        
        // Add the HTML to the shadow root
        this.shadowRoot.innerHTML = `${styles}${html}`;
    }
}

// Define the 'my-card' custom element
customElements.define('my-card', Card);
