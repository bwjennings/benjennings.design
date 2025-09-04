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

    // Ensure settings button and popover are attached to <body>
    // so their fixed positioning is relative to the viewport,
    // not the bottom-fixed navigation container.
    try {
      const btn = this.querySelector('#mobile-settings-btn');
      const pop = this.querySelector('#mobile-settings-popover');

      if (btn && btn.ownerDocument?.body && btn.parentElement !== btn.ownerDocument.body) {
        btn.ownerDocument.body.appendChild(btn);
      }
      if (pop && pop.ownerDocument?.body && pop.parentElement !== pop.ownerDocument.body) {
        pop.ownerDocument.body.appendChild(pop);
      }
    } catch {}
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
    
    // Apply attribute for CSS hooks
    if (this.getAttribute('active-item') !== activeItem) {
      this.setAttribute('active-item', activeItem);
    }

    // Ensure only one .active link
    try {
      const items = this.querySelectorAll('.nav-item');
      items.forEach((el) => el.classList.remove('active'));
      const current = this.querySelector(`.nav-item.${activeItem}`);
      if (current) current.classList.add('active');
    } catch {}
  }

  createTemplate() {
    // Template element
    const template = document.createElement('template');
    template.innerHTML = `
      <section class="sidebar">
        <h2 class="site-title heading sm"><a href="/">Ben Jennings</a></h2>
        <nav>
          <li><a class="nav-item item1" href="/">
              <span class="icon" role="img" aria-hidden="true">waving_hand</span>
              <span class="title body">Home</span>
            </a></li>
          <li><a class="nav-item item2" href="/fundamentals/">
              <span class="icon" role="img" aria-hidden="true">psychology</span>
              <span class="title body">Fundamentals</span>
            </a></li>
          <li><a class="nav-item item3" href="/designs/">
              <span class="icon" role="img" aria-hidden="true">web</span>
              <span class="title body">Designs</span>
            </a></li>
          <li><a class="nav-item item4" href="/experiments/">
              <span class="icon" role="img" aria-hidden="true">experiment</span>
              <span class="title body">Experiments</span>
            </a></li>
          <li><a class="nav-item item5" href="/resources/">
              <span class="icon" role="img" aria-hidden="true">folder_open</span>
              <span class="title body">Resources</span>
            </a></li>
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
