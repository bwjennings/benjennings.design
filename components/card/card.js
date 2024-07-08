customElements.define(
  "simple-card",
  class extends HTMLElement {
    /**
     * The class constructor object
     */
    constructor() {
      super();

      const title = this.getAttribute("title") || "Title";
      const badge = this.getAttribute("badge");

      const shadowRoot = this.attachShadow({ mode: "open" });

      const badgeTemplate = badge ? `<my-badge>${badge}</my-badge>` : "";

      shadowRoot.innerHTML = 
        `<style>
          @import 'components/card/card.css';
        </style>
        <div class="card-container">
          <h2 class="heading sm">${title}</h2>
          <button class="icon-button">open_in_full</button>
          ${badgeTemplate}
          <slot name="content"></slot>
          <dialog id="dialog">
            <div class="title-group">
              <h2 class="heading md">${title}</h2>
              <button class="icon-button" id="closeBtn">Close</button>
            </div>
            <slot></slot>
          </dialog>
        </div>`;

      this.closeBtn = shadowRoot.getElementById("closeBtn");
      this.dialog = shadowRoot.getElementById("dialog");
      this.title = title;
    }

    connectedCallback() {
      this.addEventListener("click", () => this.dialog.showModal());
      this.closeBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        this.dialog.close();
      });
      
      // Add event listener to track dialog open
      this.dialog.addEventListener("show", () => {
        console.log("Dialog opened");
        // Google Analytics event tracking with dynamic title
        gtag('event', 'open_card', {
          'event_category': 'Dialog',
          'event_label': `Card - ${this.title}`,
          'value': 1
        });
      });
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
