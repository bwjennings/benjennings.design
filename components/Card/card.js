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
:host{
  align-self: stretch;
  
}
a{
  text-decoration: none;
}

.nav-card {
  
  
  flex: 1;
  border-radius: var(--radius-small, );

  border: 1px solid var(--Gray-5, #E1EAF8);
  
  padding: var(--spacing-medium, 24px);
  display: flex;
  flex-direction: row;
  gap: 24px;
  align-items: center;
  justify-content: flex-start;

  &:hover{
    border-color: var(--border-neutral-hover);
  cursor: pointer;
  }

  &:active {
    /* Styles for the hover state */
    .material-symbols-rounded {
      
      color: var(--border-neutral-hover);
    }
  }
  
  
}

.current{
  border-color: var(--border-neutral, #CACFD9);
    background: var(--container-primary, #F8FDFF);
}
.nav-card {
  /* Existing styles */

  
}



.title-group {
  font-family: var(--text-font-family);
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  justify-content: flex-end;
  flex: 1;
  position: relative;
}

.title {
  color: var(--text-neutral, #06080e);
  text-align: left;

  font-size: 20px;
  line-height: 100%;
  font-weight: 600;
  position: relative;
}

.description {
  color: var(--text-secondary, #54575d);
  text-align: left;
 
  font-size: 14px;
  line-height: 100%;
  font-weight: 400;
  position: relative;
  align-self: stretch;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.icon {
  font-family:var(--icon-font-family);
  color: var(--text-secondary, #54575d);
  text-align: left;
  font-variation-settings:
    "FILL" 1,
    "wght" 400,
    "GRAD" 0;

  font-size: 40px;
  line-height: 100%;
  font-weight: 600;
  position: relative;
}


@media (max-width: 834px) {
  :host{
    display:flex;
    flex-grow:1;
  }
  

  .nav-card{
    width:100%;
    display: flex;
    padding: var(--spacing-x-small, 8px) var(--spacing-medium, 24px);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0px;
    flex: 1 0 0;
    border-color: transparent;
  }
  .current{
    border-color: var(--border-neutral, #CACFD9);
    background: var(--container-primary, #F8FDFF);
  }
  .nav-card {
    .title{
      font-size: 12px;
    }
    .description {
      display: none;
    }
    .icon{
      font-size: var(--Icon-Size-Medium, 24px);
    }
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
