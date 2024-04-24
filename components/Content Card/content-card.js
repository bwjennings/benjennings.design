// JavaScript
customElements.define(
    "content-card",
    class extends HTMLElement {
      /**
       * The class constructor object
       */
      constructor() {
        // Always call super first in constructor
        super();
  
        // Get the value of the 'greeting' attribute, or use a default value if it is not set
        const title = this.getAttribute("title") || "Title";
        const subtitle = this.getAttribute("subtitle") || "Subtitle";
       
  
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.innerHTML = `
     
  
        
  <style>
  :host{
    height:calc(60dvh - 84px);
    scroll-snap-align: center;
    scroll-padding: 24px;
    scroll-margin:24px;
    display: flex;
    max-width: 800px;
    width:100%;
flex-direction: column;
    
  }
  .card,
.card * {
    box-sizing: border-box;
}

.card {
    background: #ffffff;
    border-radius: var(--radius-large, 16px);
    border-style: solid;
    border-color: var(--container-border-neutral, #cccfd7);
    border-width: 1px;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-none, 0px);
    align-items: flex-start;
    justify-content: flex-start;
    height: 100%;
    
    position: relative;
    box-shadow: 0px 10px 100px 0px rgba(250, 253, 255, 1.00);
    overflow: hidden;
}

.header {
    border-style: solid;
    border-color: var(--container-border-neutral, #cccfd7);
    border-width: 0px 0px 1px 0px;
    padding: var(--spacing-small, 16px);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-none, 0px);
    align-items: flex-start;
    justify-content: flex-start;
    align-self: stretch;
    flex-shrink: 0;
    position: relative;
}

.title {
    color: #000000;
    text-align: left;
    font-family: var(--heading-medium-font-family, 'Inter-Bold', sans-serif);
    font-size: var(--heading-medium-font-size, 40px);
    line-height: var(--heading-medium-line-height, );
    font-weight: var(--heading-medium-font-weight, 700);
    position: relative;
    align-self: stretch;
}

.subtitle {
    color: var(--text-on-neutral, #17191f);
    text-align: left;
    font-family: var(--subhead-medium-font-family, 'Inter-Regular', sans-serif);
    font-size: var(--subhead-medium-font-size, 24px);
    line-height: var(--subhead-medium-line-height, );
    font-weight: var(--subhead-medium-font-weight, 400);
    position: relative;
    align-self: stretch;
}

.content {
    padding: var(--spacing-small, 16px);
    display: flex;
    flex-direction: column;
    gap: 24px;
    align-items: flex-start;
    justify-content: flex-start;
    align-self: stretch;
    flex: 1;
    position: relative;
}

.p {
    color: var(--text-on-neutral, #17191f);
    text-align: left;
    font-family: var(--body-medium-font-family, 'Inter-Regular', sans-serif);
    font-size: var(--body-medium-font-size, 18px);
    line-height: var(--body-medium-line-height, );
    font-weight: var(--body-medium-font-weight, 400);
    position: relative;
    align-self: stretch;
}

.footer {
    border-style: solid;
    border-color: var(--container-border-neutral, #cccfd7);
    border-width: 1px 0px 0px 0px;
    padding: var(--spacing-small, 16px);
    display: flex;
    flex-direction: row;
    gap: var(--spacing-small, 16px);
    align-items: center;
    justify-content: flex-end;
    align-self: stretch;
    flex-shrink: 0;
    position: relative;
}

.button {
    border-radius: var(--radius-small, 4px);
    border-style: solid;
    border-color: var(--container-border-neutral, #cccfd7);
    border-width: 1px;
    padding: var(--spacing-x-small, 8px);
    display: flex;
    flex-direction: row;
    gap: var(--spacing-x-small, 8px);
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
}

.edit {
    color: var(--text-on-neutral, #17191f);
    text-align: left;
    font-family: var(--icon-small-font-family, 'MaterialSymbolsSharp-Bold', sans-serif);
    font-size: var(--icon-small-font-size, 16px);
    line-height: var(--icon-small-line-height, 100%);
    font-weight: var(--icon-small-font-weight, 700);
    position: relative;
}

.button2 {
    color: var(--text-on-neutral, #17191f);
    text-align: left;
    font-family: 'RobotoFlex-Medium', sans-serif;
    font-size: 16px;
    font-weight: 500;
    position: relative;
}
dialog{
    height:80dvh;
    width:80dvh;
    border-radius: var(--radius-large, 16px);
border: 1px solid var(--container-border-neutral, #CACFD9);
border: 1px solid var(--container-border-neutral, color(display-p3 0.8 0.8118 0.8431));
}

dialog::backdrop {
    background-color: rgba(6, 6, 6, 0.30);
  }
  

  @media screen and (max-width: 900px) {
    :host{
      height:calc(80dvh - 84px);
      
    }
  }

  </style>
  <div class="card">
    <div class="header">
        <div class="title"> ${title} </div>
        <div class="subtitle"> ${subtitle} </div>
    </div>
    <div class="content">
        
        <slot></slot>
        <dialog id="dialog">
        <slot name="dialogContent"></slot> 
        <button id="closeBtn">Close</button>
      </dialog>
    </div>
    <div class="footer">
    <button id="openBtn">Open Dialog</button>
            <button> Edit </button>
            <button>Button </button>
        
    </div>
</div>
      `;
      
      this.openBtn = shadowRoot.getElementById('openBtn');
      this.closeBtn = shadowRoot.getElementById('closeBtn');
      this.dialog = shadowRoot.getElementById('dialog');
    }
  
    connectedCallback() {
      this.openBtn.addEventListener('click', () => this.dialog.showModal());
      this.closeBtn.addEventListener('click', () => this.dialog.close());
      this.updateButtonVisibility(); // Check visibility on initialization
    }
  
    // Function to update button visibility based on slot content
    updateButtonVisibility() {
      const dialogSlot = this.shadowRoot.querySelector('slot[name="dialogContent"]');
      const assignedNodes = dialogSlot.assignedNodes();
      const hasContent = assignedNodes.some(node => node.nodeType !== Node.TEXT_NODE || node.textContent.trim() !== '');
  
      this.openBtn.style.display = hasContent ? 'block' : 'none';
    }
      
  
      
      
  
      /**
       * Runs when the value of an attribute is changed on the component
       * @requires observedAttributes() method
       * @param  {String} name     The attribute name
       * @param  {String} oldValue The old attribute value
       * @param  {String} newValue The new attribute value
       */
      attributeChangedCallback(name, oldValue, newValue) {
        console.log("changed", name, oldValue, newValue, this);
      }
  
      /**
       * Create a list of attributes to observe
       * @return  {Array} The attributes to observe
       */
      static get observedAttributes() {
        return ["greeting"];
      }
    }
  );
  