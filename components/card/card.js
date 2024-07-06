// JavaScript
customElements.define(
  "simple-card",
  class extends HTMLElement {
    /**
     * The class constructor object
     */
    constructor() {
      super();

      const title = this.getAttribute("title") || "Title";
      const subtitle = this.getAttribute("subtitle") || "Subtitle";
      const badge = this.getAttribute("badge");

      const shadowRoot = this.attachShadow({ mode: "open" });

      const badgeTemplate = badge ? `<my-badge>${badge}</my-badge>` : "";

      shadowRoot.innerHTML = `
          <style>
            @import 'components/card/card.css';
          </style>
          
           
              
                <slot class="heading sm"></slot>
              
              <button class="icon-button">open_in_full</button>
               ${badgeTemplate}
              
            
            <slot name="content">
            
            </slot>
            <dialog id="dialog">
              <slot style="flex-grow:1" name="dialogContent"></slot>
              <button class="icon-button" id="closeBtn">Close</button>
            </dialog>
         
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
