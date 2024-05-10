
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
      const badge = this.getAttribute("badge") || "Badge";

      const shadowRoot = this.attachShadow({ mode: "open" });

      shadowRoot.innerHTML = `
     
  
        
  <style>
  @import 'components/Content Card/content-card.css';
  </style>
  <div class="card">
    <div class="header">
    <my-badge>${badge}</my-badge> 
      <div class="title">${title}</div>
      <div class="subtitle">${subtitle}</div>
      <p>
        <slot name="body"></slot>
      </p>
      <div class="footer">
  <button size="small" id="openBtn">See Designs</button>
  <button size="small" variant="brand" >Button Text</button>
</div>
    </div>
    <div class="content">
      <slot></slot>
      
    </div>

    <dialog id="dialog">
      <slot style="flex-grow:1" name="dialogContent"></slot>
      <button id="closeBtn">Close</button>
    </dialog>
</div>


      `;

      this.openBtn = shadowRoot.getElementById("openBtn");
      this.closeBtn = shadowRoot.getElementById("closeBtn");
      this.dialog = shadowRoot.getElementById("dialog");
    }

    connectedCallback() {
      this.openBtn.addEventListener("click", () => this.dialog.showModal());
      this.closeBtn.addEventListener("click", () => this.dialog.close());
      this.updateButtonVisibility(); // Check visibility on initialization
    }

    // Function to update button visibility based on slot content
    updateButtonVisibility() {
      const dialogSlot = this.shadowRoot.querySelector(
        'slot[name="dialogContent"]'
      );
      const assignedNodes = dialogSlot.assignedNodes();
      const hasContent = assignedNodes.some(
        (node) =>
          node.nodeType !== Node.TEXT_NODE || node.textContent.trim() !== ""
      );

      this.openBtn.style.display = hasContent ? "block" : "none";
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
