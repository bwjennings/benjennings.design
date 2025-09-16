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
    this._fallbackPopoverHandlers = null;
    
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

      if (btn && pop) {
        const supportsPopover = (() => {
          try {
            return 'popover' in document.createElement('div');
          } catch {
            return false;
          }
        })();

        const doc = btn.ownerDocument || document;

        const ensureHandlers = () => {
          if (this._fallbackPopoverHandlers) return;

          const setOpen = (open) => {
            try {
              pop.hidden = !open;
              if (open) {
                pop.setAttribute('data-fallback-open', 'true');
              } else {
                pop.removeAttribute('data-fallback-open');
              }
              btn.setAttribute('aria-expanded', open ? 'true' : 'false');
            } catch {}
          };

          const onToggle = (event) => {
            try {
              event.preventDefault();
              event.stopPropagation();
              const isOpen = pop.hasAttribute('data-fallback-open');
              setOpen(!isOpen);
            } catch {}
          };

          const onDocumentClick = (event) => {
            if (!pop.hasAttribute('data-fallback-open')) return;
            const target = event?.target;
            if (target === btn || pop.contains(target)) return;
            setOpen(false);
          };

          const onKeydown = (event) => {
            if (!pop.hasAttribute('data-fallback-open')) return;
            if (event?.key === 'Escape') {
              setOpen(false);
              btn.focus({ preventScroll: true });
            }
          };

          btn.addEventListener('click', onToggle);
          doc.addEventListener('click', onDocumentClick);
          doc.addEventListener('keydown', onKeydown);

          this._fallbackPopoverHandlers = { setOpen, onToggle, onDocumentClick, onKeydown };
          setOpen(false);
        };

        if (!supportsPopover) {
          ensureHandlers();
        } else {
          btn.setAttribute('aria-expanded', 'false');
        }
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
    // No wrapper: place direct children under <site-navigation>
    template.innerHTML = `
      <h2 class="site-title heading sm"><a href="/">Ben Jennings</a></h2>
      <nav aria-label="Primary">
        <ul>
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
        </ul>
      </nav>
      <site-settings></site-settings>

      <!-- Mobile settings button and popover (declarative, no JS creation) -->
      <button class="button settings-button" id="mobile-settings-btn" type="button"
        popovertarget="mobile-settings-popover" popovertargetaction="toggle"
        aria-haspopup="dialog" aria-controls="mobile-settings-popover">
        <span class="icon">settings</span>
        <span>Settings</span>
      </button>
      <div class="settings-popover" id="mobile-settings-popover" popover="auto" role="dialog" aria-modal="true">
        <site-settings id="popover-settings"></site-settings>
      </div>
    `;

    // Return a DocumentFragment so multiple root children are cloned
    return template.content;
  }

  disconnectedCallback() {}
}
customElements.define('site-navigation', SiteNavigation);
