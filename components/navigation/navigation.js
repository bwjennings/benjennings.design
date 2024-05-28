class CustomSidebar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const template = document.createElement('template');
    template.innerHTML = `
      <link rel="stylesheet" href="components/navigation/navigation.css" type="text/css">
      <nav class="sidebar">
        <h2 class="site-title" data-link="index.html">ben.cards</h2>
        <div class="nav-card item1" data-link="designs.html">
          <div class="icon">design_services</div>
          <div class="title-group">
            <div class="title">Designs</div>
            
          </div>
        </div>
        <div class="nav-card item2" data-link="experiments.html">
          <div class="icon">experiment</div>
          <div class="title-group">
            <div class="title">Experiments</div>
            
          </div>
        </div>
        <div class="nav-card item3" data-link="resources.html">
          <div class="icon">category</div>
          <div class="title-group">
            <div class="title">Resources</div>
            
          </div>
        </div>
        <site-settings></site-settings>
      </nav>
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.addEventListeners();
  }

  addEventListeners() {
    this.shadowRoot.querySelectorAll('[data-link]').forEach(element => {
      element.addEventListener('click', this.handleNavigation.bind(this));
    });
  }

  handleNavigation(event) {
    const link = event.currentTarget.dataset.link;
    if (link) {
      window.location.href = link;
    }
  }

  static get observedAttributes() {
    return ['active-item'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'active-item') {
      this.updateActiveItem(newValue);
    }
  }

  updateActiveItem(index) {
    const cards = this.shadowRoot.querySelectorAll('.nav-card');
    cards.forEach(card => card.classList.remove('active'));
    if (cards[index]) {
      cards[index].classList.add('active');
    }
  }
}

customElements.define('custom-sidebar', CustomSidebar);
