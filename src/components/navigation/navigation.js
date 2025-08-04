class SiteNavigation extends HTMLElement {
  constructor() {
    super();
    this.rendered = false;
    this.lastPath = null;
    this.lastActiveClass = null;
  }

  connectedCallback() {
    if (!this.rendered) {
      this.render();
      this.rendered = true;
    } else {
      // Only update active state if path changed
      this.updateActiveState();
    }
  }

  updateActiveState() {
    const currentActiveClass = this.getAttribute('active-item') || this.getActiveItemClass();
    
    // Only update if active class changed
    if (currentActiveClass !== this.lastActiveClass) {
      const navItems = this.querySelectorAll('.nav-item');
      navItems.forEach((item, index) => {
        const itemClass = `item${index + 1}`;
        if (currentActiveClass === itemClass) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
      this.lastActiveClass = currentActiveClass;
    }
  }

  render() {
    // Calculate relative paths based on current location
    const path = window.location.pathname;
    const depth = (path.match(/\//g) || []).length - 1;
    const baseUrl = depth === 0 ? '' : '../'.repeat(depth);
    
    // Get active item from attribute or fall back to URL detection
    const activeClass = this.getAttribute('active-item') || this.getActiveItemClass();
    this.lastActiveClass = activeClass;
    this.lastPath = path;
    
    // Create navigation template (cached for performance)
    if (!SiteNavigation.template) {
      SiteNavigation.template = this.createTemplate();
    }
    
    // Clone template and update dynamic parts
    const clone = SiteNavigation.template.cloneNode(true);
    
    // Update base URLs for all navigation links
    const links = clone.querySelectorAll('a[href]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      
      // Apply baseUrl to all relative links
      if (!href.startsWith('http') && !href.startsWith('#')) {
        const newHref = baseUrl + href;
        link.setAttribute('href', newHref);
        // Debug: log the link updates
        if (window.location.pathname !== '/') {
          console.log(`Navigation link updated: ${href} -> ${newHref} (baseUrl: '${baseUrl}')`);
        }
      }
    });
    
    // Update active state
    const navItems = clone.querySelectorAll('.nav-item');
    navItems.forEach((item, index) => {
      const itemClass = `item${index + 1}`;
      if (activeClass === itemClass) {
        item.classList.add('active');
      }
    });
    
    // Replace content
    this.innerHTML = '';
    this.appendChild(clone);
    
    this.setupMobileSettings();
  }

  createTemplate() {
    const template = document.createElement('section');
    template.className = 'sidebar';
    template.innerHTML = `
      <h2 class="site-title"><a href="index.html">Ben Jennings</a></h2>
      <div class="active-box"></div>
      <nav>
        <li><a class="nav-item item1" href="index.html">
            <span class="icon" role="img" aria-hidden="true">psychology</span>
            <span class="title">Home</span>
          </a></li>
        <li><a class="nav-item item2" href="fundamentals/">
            <span class="icon" role="img" aria-hidden="true">psychology</span>
            <span class="title">Fundamentals</span>
          </a></li>
        <li><a class="nav-item item3" href="designs/">
            <span class="icon" role="img" aria-hidden="true">web</span>
            <span class="title">Designs</span>
          </a></li>
        <li><a class="nav-item item4" href="experiments/">
            <span class="icon" role="img" aria-hidden="true">experiment</span>
            <span class="title">Experiments</span>
          </a></li>
        <li><a class="nav-item item5" href="resources/">
            <span class="icon" role="img" aria-hidden="true">folder_open</span>
            <span class="title">Resources</span>
          </a></li>
        <div class="nav-background"></div>
      </nav>
      <site-settings></site-settings>
    `;
    return template;
  }

  setupMobileSettings() {
    // Only create mobile settings elements once globally
    if (!SiteNavigation.mobileSettingsInitialized) {
      SiteNavigation.mobileSettingsInitialized = true;
      
      const overlay = document.createElement('div');
      overlay.className = 'settings-overlay';
      overlay.id = 'mobile-settings-overlay';
      document.body.appendChild(overlay);

      const button = document.createElement('button');
      button.className = 'settings-button';
      button.id = 'mobile-settings-btn';
      button.innerHTML = `
        <span class="icon">settings</span>
        <span>Settings</span>
      `;
      document.body.appendChild(button);

      const popover = document.createElement('div');
      popover.className = 'settings-popover';
      popover.id = 'mobile-settings-popover';
      popover.innerHTML = '<site-settings id="popover-settings"></site-settings>';
      document.body.appendChild(popover);

      // Store references to avoid repeated queries
      SiteNavigation.mobileElements = { overlay, button, popover };

      // Add event listeners with proper cleanup tracking
      const toggleOpen = () => {
        popover.classList.toggle('open');
        overlay.classList.toggle('open');
      };

      const closeSettings = () => {
        popover.classList.remove('open');
        overlay.classList.remove('open');
      };

      const handleEscape = (e) => {
        if (e.key === 'Escape' && popover.classList.contains('open')) {
          closeSettings();
        }
      };

      button.addEventListener('click', toggleOpen);
      overlay.addEventListener('click', closeSettings);
      document.addEventListener('keydown', handleEscape);

      // Store event handlers for cleanup
      SiteNavigation.mobileEventHandlers = { toggleOpen, closeSettings, handleEscape };
    }
  }

  getActiveItemClass() {
    const path = window.location.pathname;
    
    // Handle different path structures
    if (path === '/' || path.endsWith('/index.html') || path.endsWith('/ben.cards/')) {
      return 'item1';
    } else if (path.includes('/fundamentals')) {
      return 'item2';
    } else if (path.includes('/designs')) {
      return 'item3';
    } else if (path.includes('/experiments')) {
      return 'item4';
    } else if (path.includes('/resources')) {
      return 'item5';
    }

    return null;
  }

  disconnectedCallback() {
    // Clean up mobile settings event listeners
    const button = document.getElementById('mobile-settings-btn');
    const overlay = document.getElementById('mobile-settings-overlay');
    
    if (button) {
      // Remove all event listeners by replacing the element
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
    }
    
    if (overlay) {
      const newOverlay = overlay.cloneNode(true);
      overlay.parentNode.replaceChild(newOverlay, overlay);
    }
    
    // Remove keyboard event listener from document
    // Note: This is a global listener, so we need to be careful about removing it
    // In a real app, you'd want to track these listeners more carefully
  }
}

customElements.define('site-navigation', SiteNavigation);
