customElements.define("custom-sidebar", 
class extends HTMLElement {
  static get observedAttributes() {
    return ["active-item"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Create the template
    const template = document.createElement("template");
    template.innerHTML = `
      <style>
     
      @import 'css/index.css';
    

:host {
  grid-area: sidebar;
  flex-grow: 1;
  width: auto;
  z-index: 20;
  background: inherit;
  height: 100dvh;
  overflow: hidden;
}


  .quick-theme {
    align-self: self-end;
    opacity: 0.9;
    filter: saturate(0.7);
    transition: filter 300ms, opacity 300ms;

    &:hover {
      opacity: 1;
      filter: saturate(1);
      opacity: 1;
      --theme-slider-size: 32px;
    }
  }

  .sidebar {
    overflow: hidden;
    scrollbar-width: thin;
    scrollbar-gutter: stable;
    position: sticky;
    top: 0px;
    height: 100%;
    box-sizing: border-box;
    width: 100%;
    display: grid;
    padding: var(--spacing-x-large);
    grid-template-columns: 1fr;
    grid-template-rows: 80px 1fr minmax(20px, 40px) auto;
    gap: var(--spacing-large);
    grid-template-areas:
      "title "
      "nav-group"
      "theme-slider"
      "settings"
    ;
    border-right: 1px solid var(--border-primary);
    background-color: var(--background-primary);
    box-sizing: border-box;

    menu {
      width: 100%;
      gap: var(--spacing-small);
      display: flex;
      flex-direction: column;
      align-self: stretch;
      grid-area: nav-group;
      list-style-type: none;
      justify-content: center;
      /* Remove bullet points */
      padding: 0;
      /* Remove padding */
      margin: 0;
      transform-style: preserve-3d;

      li {
        &:focus {
          transform: perspective(300px) translateZ(-50px);

        }
      }
    }

    h2 {
      margin: 0px;
      line-height: 40px;
    }
  }

  .divider {
    border-top: 1px solid var(--border-primary);
    grid-area: divider;
  }

  .nav-card {
    box-sizing: border-box;
    color: var(--foreground-secondary);
    height: clamp(50px, 10cqh, 80px);
    display: flex;
    padding: var(--spacing-x-large, 24px) var(--spacing-large, 16px);
    align-items: center;
    gap: var(--spacing-medium);
    background-color: transparent;
    flex-direction: row;
    justify-content: flex-start;
    -webkit-user-select: none;
    user-select: none;
    background: inherit;
    border: 1px solid transparent;
    cursor: pointer;

 
   transition: background-color 300ms var(--timing-ease);
   
  
  


    &:hover:not(.active) {
      background-color: var(--border-primary-hover);
        
   
      
    }



  }





  .active {
transition:none;
    font-variation-settings: 'GRAD' 100;
    color: var(--foreground-brand);
    anchor-name: --active;
    position: relative;
    background: var(--background-brand);




    .icon {
      font-variation-settings:
        "FILL" var(--icon-fill),
        "GRAD" var(--icon-grade-emphasis);
    }
  }







  .title-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
    align-items: flex-start;
    justify-content: flex-end;
    position: relative;
    font-family: var(--text-font-family);
    transition: all 100ms;
  }

  .title,
  .description {
    text-align: left;
    position: relative;
  }

  .title {
    font-weight: var(--text-body-weight);
    font-size: var(--text-body-lg-size);
    line-height: var(--text-body-lg-line-height);
  }

  .description {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
  }

  .icon {
    font-family: var(--icon-font-family, "Material Symbols Sharp");
    font-size: var(--icon-size-large);
    font-style: normal;
    font-weight: var(--icon-weight-large, 500);
    line-height: 100%;
    font-variation-settings:
      "FILL" var(--icon-fill),
      "wght" 400,
      "GRAD" var(--icon-grade);
  }

  .item2 {
    grid-area: item2;
  }

  .item1 {
    grid-area: item1;
  }

  .item3 {
    grid-area: item3;
  }

  .item4 {
    grid-area: item4;
  }

  .item5 {
    grid-area: item5;
  }

  theme-slider {
    grid-area: theme-slider;
  }

  .title {
    align-items: center;
    justify-content: center;
    justify-items: center;
    align-items: center;
    grid-area: title;
  }

  .site-title {
    font-size: var(--text-heading-sm-size);
    font-weight: var(--text-heading-weight);
    font-variation-settings:
      'GRAD' 150;

    &:hover {}
  }


@media screen and (max-width: 800px),
(max-height:500px) {
  :host(custom-sidebar) {
    height: fit-content;
    width: 100%;
    flex-shrink: 0;
    flex-grow: 1;
    padding: 0px;
    padding-bottom: env(safe-area-inset-bottom);
    overflow:visible;
  }

    site-settings {
      position: fixed;
      top: 24px;
      right: 24px;
      width: fit-content;
      
    }

    .nav-card {
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: center;
      height: 100%;
      background: transparent;
      color: var(--foreground-tertiary);
      flex-grow: 1;
      padding: 8px 2px 12px 2px;
      flex-direction: column;
      gap: var(--spacing-small);
      border-color: transparent;
      height: fit-content;
      -webkit-tap-highlight-color: transparent;

      /* for removing the highlight */
      &:hover:not(.active) {
        background-color: transparent;
         transition-property: background-color;
      }
    }

    .active {
      border-color: transparent;
      color: var(--foreground-brand);
    }

    :is(.description, theme-slider) {
      display: none;
    }



    .title {
      font-size: 12px;
      line-height: 120%;
    }

    .icon {
      font-size: var(--icon-size-medium);
    }

    .nav-item-group {
      gap: 24px;
      display: flex;
      flex-direction: column;
      align-self: center;
      justify-self: center;
      width: 100%;
    }

    .nav-item-group {
      flex-direction: row;
    }

    .sidebar {
      width: 100%;
      padding: 0px;
      height: auto;
      grid-template-columns: 1fr;
      grid-template-areas: "nav-group";
      grid-template-rows: 1fr;
      gap: 0px;

      border-radius: 0px;
      border: none;
      border-top: 1px solid var(--border-primary);

      .divider {
        display: none;
      }

      menu {
        animation: none;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        justify-self: stretch;
        gap: 0px;

        li {
          justify-self: stretch;
          height: fit-content;
        }
      }

      .site-title {
        display: none;
      }
    }
  
}
      </style>


      <nav class="sidebar">
        <h2 class="site-title"><a href="index.html"></a></h2>
        <site-settings></site-settings>
        <menu>
          <li><a tabindex="1" class="nav-card item1" href="index.html">
              <span class="icon">waving_hand</span>
              <span class="title">Home</span>
          </a></li>
          <li><a tabindex="2" class="nav-card item2" href="fundamentals.html">
              <span class="icon">psychology</span>
              <span class="title">Fundamentals</span>
          </a></li>
          <li><a tabindex="3" class="nav-card item3" href="designs.html">
              <span class="icon">web</span>
              <span class="title">Designs</span>
          </a></li>
          <li><a tabindex="4" class="nav-card item4" href="experiments.html">
              <span class="icon">experiment</span>
              <span class="title">Experiments</span>
          </a></li>
          <li><a tabindex="5" class="nav-card item5" href="resources.html">
              <span class="icon">folder_open</span>
              <span class="title">Resources</span>
          </a></li>
        </menu>
        <theme-slider class="quick-theme" data-hide-label></theme-slider>
      </nav>
    `;
    this.shadowRoot.append(template.content.cloneNode(true));

    // Bind methods to ensure correct 'this' context
    this.handleNavigation = this.handleNavigation.bind(this);
  }

  connectedCallback() {
    // Initialize component based on current attributes
    this.updateActiveItem(this.getAttribute("active-item"));

    // Add event listeners
    this.addEventListeners();

    // Add optimization to avoid layout shifts
   
  }

  disconnectedCallback() {
    // Remove event listeners to prevent memory leaks
    this.removeEventListeners();
  }

  addEventListeners() {
    // Attach event listener to the parent 'menu' element for event delegation
    const menu = this.shadowRoot.querySelector("menu");
    if (menu) {
      menu.addEventListener("click", this.handleNavigation);
    }
  }

  removeEventListeners() {
    // Detach event listener from the parent 'menu' element
    const menu = this.shadowRoot.querySelector("menu");
    if (menu) {
      menu.removeEventListener("click", this.handleNavigation);
    }
  }

  handleNavigation(event) {
    const target = event.target.closest(".nav-card");
    if (target) {
      event.preventDefault();
      const href = target.getAttribute("href");

      // Check if the browser supports the View Transitions API
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          // Start the transition and change the page
          window.location.href = href;
        });
      } else {
        // Fallback for browsers without View Transitions API support
        window.location.href = href;
      }
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "active-item" && oldValue !== newValue) {
      this.updateActiveItem(newValue);
    }
  }

  updateActiveItem(index) {
    const cards = this.shadowRoot.querySelectorAll(".nav-card");
    // Remove 'active' class from all cards
    cards.forEach((card) => card.classList.remove("active"));

    // Parse the index as an integer
    const idx = parseInt(index, 10) - 1; // Adjust for zero-based index

    // Check if idx is a valid number and within range
    if (!isNaN(idx) && idx >= 0 && idx < cards.length) {
      cards[idx].classList.add("active");
    }
  }
}
);