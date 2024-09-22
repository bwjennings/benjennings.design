class CustomSidebar extends HTMLElement {
  static get observedAttributes() {
    return ['active-item'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Create the template without relying on attributes
    const template = document.createElement('template');
    template.innerHTML = `
    <link rel="stylesheet" href="css/style.css" type="text/css">
      <link rel="stylesheet" href="components/navigation/navigation.css" type="text/css">
      
      <nav class="sidebar">
        <h2 class="site-title"><a href="index.html">Ben</a></h2>
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
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Bind methods to ensure correct 'this' context
    this.handleNavigation = this.handleNavigation.bind(this);
  }

  connectedCallback() {
    // Initialize component based on current attributes
    this.updateActiveItem(this.getAttribute('active-item'));

    // Add event listeners
    this.addEventListeners();
  }

  disconnectedCallback() {
    // Remove event listeners to prevent memory leaks
    this.removeEventListeners();
  }

  addEventListeners() {
    // Attach event listeners to navigation links
    this.shadowRoot.querySelectorAll('.nav-card').forEach(element => {
      element.addEventListener('click', this.handleNavigation);
    });
  }

  removeEventListeners() {
    // Detach event listeners
    this.shadowRoot.querySelectorAll('.nav-card').forEach(element => {
      element.removeEventListener('click', this.handleNavigation);
    });
  }

  handleNavigation(event) {
    // Prevent default link behavior if custom navigation is desired
    event.preventDefault();

    // Get the href attribute from the clicked link
    const href = event.currentTarget.getAttribute('href');
    if (href) {
      // Navigate to the new URL
      window.location.href = href;
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'active-item' && oldValue !== newValue) {
      this.updateActiveItem(newValue);
    }
  }

  updateActiveItem(index) {
    const cards = this.shadowRoot.querySelectorAll('.nav-card');
    // Remove 'active' class from all cards
    cards.forEach(card => card.classList.remove('active'));

    // Parse the index as an integer
    const idx = parseInt(index, 10) - 1; // Adjust for zero-based index

    // Check if idx is a valid number and within range
    if (!isNaN(idx) && idx >= 0 && idx < cards.length) {
      cards[idx].classList.add('active');
    }
  }
}

customElements.define('custom-sidebar', CustomSidebar);

export { CustomSidebar };
