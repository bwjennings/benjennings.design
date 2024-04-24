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
  height: 100px;
  -webkit-user-select: none;
  user-select: none;

  :hover{
    border-color: var(--container-border-neutral-hover)
  }
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
  font-size: var(--text-text-body-large);
  line-height: 100%;
  font-weight: 500;
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
  font-weight: var(--icon-weight-large, 500);
  line-height: 100%; 

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

<div  class="nav-card ${state}" id="${this.getAttribute('target')}">
<div class="icon">${icon}</div>
<div class="title-group">
    <div class="title">${title}</div>
    <div class="description">${description}</div>
</div>
</div>

    `;
    
    }

    /**
     * Runs each time the element is appended to or moved in the DOM
     */
    connectedCallback() {
      this.shadowRoot.querySelector('.nav-card').addEventListener('click', () => this.toggleTab());

      
    }
    toggleTab() {
      const targetId = this.getAttribute('target');
      const allTabs = document.querySelectorAll('nav-tab');
      const contentAreas = document.querySelectorAll('.tab-content');

      // Remove active state from all tabs and hide all content areas
      allTabs.forEach(tab => {
          tab.shadowRoot.querySelector('.nav-card').classList.remove('current');
      });
      contentAreas.forEach(content => {
          content.style.display = 'none';
      });

      // Add active state to clicked tab and show associated content
      this.shadowRoot.querySelector('.nav-card').classList.add('current');
      document.getElementById(targetId).style.display = 'block';
  }

    
    

    
  }
);
