class SiteNavigation extends HTMLElement {
  // Static template cache
  static template = null;
  static pathMap = new Map([
    ['/fundamentals', 'item2'],
    ['/designs', 'item3'],
    ['/experiments', 'item4'],
    ['/resources', 'item5']
  ]);

  constructor() {
    super();
    this.rendered = false;
    
    // Render before snapshot
    this.render();
    this.rendered = true;
    this.updateActiveState();
  }

  render() {
    // Cache template
    if (!SiteNavigation.template) {
      SiteNavigation.template = this.createTemplate();
    }

    // Use DocumentFragment
    const fragment = document.createDocumentFragment();
    fragment.appendChild(SiteNavigation.template.cloneNode(true));
    
    this.replaceChildren(fragment);

    // Defer non-critical setup
    this.deferredSetup();
  }

  deferredSetup() {
    // Update active state
    this.updateActiveState();
  }

  updateActiveState() {
    const path = window.location.pathname;
    
    // Path map lookup
    let activeItem = 'item1'; // default
    
    for (const [pathSegment, itemId] of SiteNavigation.pathMap) {
      if (path.startsWith(pathSegment)) {
        activeItem = itemId;
        break;
      }
    }
    
    // Skip if unchanged
    if (this.getAttribute('active-item') !== activeItem) {
      this.setAttribute('active-item', activeItem);
    }
  }

  createTemplate() {
    // Template element
    const template = document.createElement('template');
    template.innerHTML = `
      <section class="sidebar">
        <h2 class="site-title heading sm"><a href="/">Ben Jennings</a></h2>
        <div class="active-box"></div>
        <nav>
          <li><a class="nav-item item1" href="/" style="view-transition-name: home; view-transition-class: nav-item">
              <span class="icon" role="img" aria-hidden="true">waving_hand</span>
              <span class="title body">Home</span>
            </a></li>
          <li><a class="nav-item item2" href="/fundamentals/" style="view-transition-name: fundamentals; view-transition-class: nav-item">
              <span class="icon" role="img" aria-hidden="true">psychology</span>
              <span class="title body">Fundamentals</span>
            </a></li>
          <li><a class="nav-item item3" href="/designs/" style="view-transition-name: designs; view-transition-class: nav-item">
              <span class="icon" role="img" aria-hidden="true">web</span>
              <span class="title body">Designs</span>
            </a></li>
          <li><a class="nav-item item4" href="/experiments/" style="view-transition-name: experiments; view-transition-class: nav-item">
              <span class="icon" role="img" aria-hidden="true">experiment</span>
              <span class="title body">Experiments</span>
            </a></li>
          <li><a class="nav-item item5" href="/resources/" style="view-transition-name: resources; view-transition-class: nav-item">
              <span class="icon" role="img" aria-hidden="true">folder_open</span>
              <span class="title body">Resources</span>
            </a></li>
          <div class="nav-background" style="view-transition-name: nav-background; view-transition-class: nav-background"></div>
        </nav>
        <site-settings></site-settings>

        <!-- Mobile settings button and popover (declarative, no JS creation) -->
        <button class="button settings-button" id="mobile-settings-btn"
          popovertarget="mobile-settings-popover" popovertargetaction="toggle"
          aria-haspopup="dialog" aria-controls="mobile-settings-popover">
          <span class="icon">settings</span>
          <span>Settings</span>
        </button>
        <div class="settings-popover" id="mobile-settings-popover" popover="auto">
          <site-settings id="popover-settings"></site-settings>
        </div>
      </section>
    `;
    
    return template.content.firstElementChild;
  }

  disconnectedCallback() {}
}
customElements.define('site-navigation', SiteNavigation);
