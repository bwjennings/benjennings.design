// JavaScript
customElements.define(
  "nav-card",
  class extends HTMLElement {
    /**
     * The class constructor object
     */
    constructor() {
      // Always call super first in constructor
      super();

      // Get the value of the 'greeting' attribute, or use a default value if it is not set
      const icon = this.getAttribute("icon") || "home";
      const title = this.getAttribute("title") || "Home";
      const description = this.getAttribute("description") || "";
      const state = this.getAttribute("state") || "";
      const page = this.getAttribute("page") || "/";

      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.innerHTML = `
   

      
<style>
:host {
  display: flex;
  align-items: flex-start;
  align-self: stretch;
}

a {
  text-decoration: none;
  width: 100%;
}

.nav-card {
  display: flex;
  padding: var(--spacing-medium, 24px);
  align-items: center;
  gap: 24px;
  flex: 1 0 0;
  border-radius: var(--radius-small);
  
  border: 1px solid var(--Gray-5, #e1eaf8);
  flex-direction: row;
  justify-content: flex-start;
}

.nav-card:hover {
  border-color: var(--border-neutral-hover);
  cursor: pointer;
}

.nav-card:active .icon {
  color: var(--border-neutral-hover);
}

.current {
 
  border-color: var(--border-brand) ;
  background: var(--container-background-neutral);
}

.title-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  justify-content: flex-end;
  flex: 1;
  position: relative;
  font-family: var(--text-font-family);
}

.title, .description {
  text-align: left;
  position: relative;
}

.title {
  color: var(--text-neutral, #06080e);
  font-size: 20px;
  line-height: 100%;
  font-weight: 600;
}

.description {
  color: var(--text-secondary, #54575d);
  font-size: 14px;
  line-height: 100%;
  font-weight: 400;
  align-self: stretch;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.icon {
  font-family: var(--icon-font-family);
  color: var(--text-secondary, #54575d);
  font-size: 40px;
  line-height: 100%;
  font-weight: 600;
  font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0;
}

@media screen and (max-width: 900px) {
  :host, a, .nav-card {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: center;
  }

  :host, .nav-card {
    flex-grow: 1;
  }

  .nav-card {
    padding: var(--spacing-x-small, 8px) var(--spacing-medium, 24px);
    flex-direction: column;
    gap: 4px;
    border-color: transparent;
  }

  .current{
    border-color: var(--border-brand) ;
  background: var(--container-background-neutral);
  }
  .title {
    font-size: 12px;
    font-weight:500;
  }

  .description {
    display: none;
  }

  .icon {
    font-size: var(--Icon-Size-Medium, 24px);
  }
}

</style>
<a href="${page}">
<div  class="nav-card ${state}">
<div class="icon">${icon}</div>
<div class="title-group">
    <div class="title">${title}</div>
    <div class="description">${description}</div>
</div>
</div>
</a>
    `;
    
    }

    /**
     * Runs each time the element is appended to or moved in the DOM
     */
    connectedCallback() {
      console.log("connected!", this);

      
    }

    /**
     * Runs when the element is removed from the DOM
     */
    disconnectedCallback() {
      console.log("disconnected", this);
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
