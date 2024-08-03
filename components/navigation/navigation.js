class CustomSidebar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const template = document.createElement('template');
    template.innerHTML = `
      <link rel="stylesheet" href="components/navigation/navigation.css" type="text/css">
      <link rel="stylesheet" href="style.css" type="text/css">
    <nav class="sidebar">
    <h2 class="site-title"><a href="index.html">Ben</a></h2>
    <site-settings></site-settings>
   <ul>
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
    </ul>
</nav>
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.addEventListeners();
  }

  addEventListeners() {
    this.shadowRoot.querySelectorAll('[href]').forEach(element => {
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

export {CustomSidebar};