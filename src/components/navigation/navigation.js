class SiteNavigation extends HTMLElement {
  // Static template cached at class level
  static template = null;
  static mobileSettingsInitialized = false;
  static mobileElements = null;
  static pathMap = new Map([
    ['/fundamentals', 'item2'],
    ['/designs', 'item3'],
    ['/experiments', 'item4'],
    ['/resources', 'item5']
  ]);

  constructor() {
    super();
    this.rendered = false;
    
    // Pre-bind methods to avoid repeated binding
    this.handleIntersection = this.handleIntersection.bind(this);

    // Synchronously render nav so view-transition elements exist before snapshot
    this.render();
    this.rendered = true;
    this.updateActiveState();
  }

  render() {
    // Create and cache template once
    if (!SiteNavigation.template) {
      SiteNavigation.template = this.createTemplate();
    }

    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    fragment.appendChild(SiteNavigation.template.cloneNode(true));
    
    // Single DOM update
    this.replaceChildren(fragment);

    // Defer non-critical setup
    this.deferredSetup();
  }

  deferredSetup() {
    // Synchronously update active state
    this.updateActiveState();
    // Use requestAnimationFrame only for non-critical mobile setup
    requestAnimationFrame(() => {
      // Lazy-load mobile settings only when needed
      if (window.matchMedia('(max-width: 768px)').matches) {
        this.setupMobileSettingsLazy();
      } else {
        // Add listener for viewport changes
        this.mediaQueryList = window.matchMedia('(max-width: 768px)');
        this.mediaQueryList.addEventListener('change', (e) => {
          if (e.matches) {
            this.setupMobileSettingsLazy();
          }
        });
      }
    });
  }

  updateActiveState() {
    const path = window.location.pathname;
    
    // Use Map for O(1) lookup instead of multiple string operations
    let activeItem = 'item1'; // default
    
    for (const [pathSegment, itemId] of SiteNavigation.pathMap) {
      if (path.startsWith(pathSegment)) {
        activeItem = itemId;
        break;
      }
    }
    
    // Only update if changed
    if (this.getAttribute('active-item') !== activeItem) {
      this.setAttribute('active-item', activeItem);
    }
  }

  createTemplate() {
    // Use template element for better performance
    const template = document.createElement('template');
    
    // Pre-compile the HTML string
    template.innerHTML = `
      <section class="sidebar">
        <h2 class="site-title"><a href="/">Ben Jennings</a></h2>
        <div class="active-box"></div>
        <nav>
          <li><a class="nav-item item1" href="/" style="view-transition-name: home">
              <span class="icon" role="img" aria-hidden="true">psychology</span>
              <span class="title">Home</span>
            </a></li>
          <li><a class="nav-item item2" href="/fundamentals/" style="view-transition-name: fundamentals">
              <span class="icon" role="img" aria-hidden="true">psychology</span>
              <span class="title">Fundamentals</span>
            </a></li>
          <li><a class="nav-item item3" href="/designs/" style="view-transition-name: designs">
              <span class="icon" role="img" aria-hidden="true">web</span>
              <span class="title">Designs</span>
            </a></li>
          <li><a class="nav-item item4" href="/experiments/" style="view-transition-name: experiments">
              <span class="icon" role="img" aria-hidden="true">experiment</span>
              <span class="title">Experiments</span>
            </a></li>
          <li><a class="nav-item item5" href="/resources/" style="view-transition-name: resources">
              <span class="icon" role="img" aria-hidden="true">folder_open</span>
              <span class="title">Resources</span>
            </a></li>
          <div class="nav-background" style="view-transition-name: nav-background"></div>
        </nav>
        <site-settings></site-settings>
      </section>
    `;
    
    return template.content.firstElementChild;
  }

  setupMobileSettingsLazy() {
    if (SiteNavigation.mobileSettingsInitialized) return;
    
    // Use IntersectionObserver to load when component is visible
    this._observer = new IntersectionObserver(this.handleIntersection, {
      rootMargin: '50px'
    });
    
    this._observer.observe(this);
  }

  handleIntersection(entries) {
    const [entry] = entries;
    if (entry.isIntersecting) {
      this.initializeMobileSettings();
      if (this._observer) {
        this._observer.disconnect();
        this._observer = null;
      }
    }
  }

  initializeMobileSettings() {
    if (SiteNavigation.mobileSettingsInitialized) return;
    SiteNavigation.mobileSettingsInitialized = true;
    
    // Create elements in a fragment first
    const fragment = document.createDocumentFragment();
    
    const overlay = document.createElement('div');
    overlay.className = 'settings-overlay';
    overlay.id = 'mobile-settings-overlay';
    
    const button = document.createElement('button');
    button.className = 'settings-button';
    button.id = 'mobile-settings-btn';
    button.innerHTML = `
      <span class="icon">settings</span>
      <span>Settings</span>
    `;
    
    const popover = document.createElement('div');
    popover.className = 'settings-popover';
    popover.id = 'mobile-settings-popover';
    
    // Lazy-load site-settings component
    const settingsEl = document.createElement('site-settings');
    settingsEl.id = 'popover-settings';
    popover.appendChild(settingsEl);
    
    // Add all to fragment
    fragment.appendChild(overlay);
    fragment.appendChild(button);
    fragment.appendChild(popover);
    
    // Single DOM update
    document.body.appendChild(fragment);
    
    // Store references
    SiteNavigation.mobileElements = { overlay, button, popover };
    
    // Use event delegation and passive listeners where appropriate
    this.attachMobileListeners();
  }

  attachMobileListeners() {
    const { overlay, button, popover } = SiteNavigation.mobileElements;
    
    // Use a single delegated handler
    const handleClick = (e) => {
      if (e.target === button || button.contains(e.target)) {
        popover.classList.toggle('open');
        overlay.classList.toggle('open');
      } else if (e.target === overlay) {
        popover.classList.remove('open');
        overlay.classList.remove('open');
      }
    };
    
    // Passive listener for better scroll performance
    document.addEventListener('click', handleClick, { passive: true });
    
    // Keyboard handler with early exit
    const handleEscape = (e) => {
      if (e.key === 'Escape' && popover.classList.contains('open')) {
        popover.classList.remove('open');
        overlay.classList.remove('open');
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    // Store for cleanup
    SiteNavigation.mobileEventHandlers = { handleClick, handleEscape };
  }

  disconnectedCallback() {
    // Clean up media query listener
    if (this.mediaQueryList) {
      this.mediaQueryList.removeEventListener('change', this.handleMediaChange);
    }
    
    // Clean up mobile settings if initialized
    if (SiteNavigation.mobileEventHandlers) {
      const { handleClick, handleEscape } = SiteNavigation.mobileEventHandlers;
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleEscape);
    }
    
    // Remove mobile elements from DOM
    if (SiteNavigation.mobileElements) {
      Object.values(SiteNavigation.mobileElements).forEach(el => {
        el?.remove();
      });
      SiteNavigation.mobileElements = null;
      SiteNavigation.mobileSettingsInitialized = false;
    }
  }
}

// Optional: Preload component definition if critical
customElements.define('site-navigation', SiteNavigation);
