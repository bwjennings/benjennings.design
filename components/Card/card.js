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
  
  border-radius: var(--radius-large, 16px);
  border: 1px solid var(--container-border-neutral, #CACFD9);
  flex-direction: row;
  justify-content: flex-start;
  -webkit-user-select: none;
  user-select: none;
}




.current {
 
  border-color: var(--container-border-brand) ;
  background: var(--container-background-primary, #F8FDFF);

  .icon{
    color: var(--text-brand, #1800FF);
color: var(--text-brand, color(display-p3 0.0706 0 1));



  }
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
  font-family: var(--icon-font-family, "Material Symbols Sharp");
  font-size: var(--icon-size-large, 32px);
  font-style: normal;
  font-weight: 500;
  line-height: 100%; /* 32px */

  color: var(--text-secondary, #52575F);
  font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0;
}

@media screen and (max-width: 900px) {
  :host{
    height:56px;
  }
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
    height:100%;
    padding: var(--spacing-x-small, 8px) var(--spacing-medium, 24px);
    flex-direction: column;
    gap: 4px;
    border-color: transparent;
  }

  .current{
    border-color: var(--border-brand) ;
  
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
