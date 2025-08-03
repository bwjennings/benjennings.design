class SiteNavigation extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.rendered) {
      this.render();
      this.rendered = true;
    }
  }


  render() {
    // Calculate relative paths based on current location
    const path = window.location.pathname;
    const depth = (path.match(/\//g) || []).length - 1;
    const baseUrl = depth === 0 ? '' : '../'.repeat(depth);
    
    // Get active item from attribute or fall back to URL detection
    const activeClass = this.getAttribute('active-item') || this.getActiveItemClass();
    
    this.innerHTML = `
    <section class="sidebar">
      <h2 class="site-title"><a href="${baseUrl}index.html">Ben Jennings</a></h2>
      <div class="active-box"></div>
      <nav >
       
        <li><a class="nav-item item1${activeClass === 'item1' ? ' active' : ''}" href="${baseUrl}index.html">
            <span class="icon" role="img" aria-hidden="true">psychology</span>
            <span class="title">Home</span>
          </a></li>
        <li><a class="nav-item item2${activeClass === 'item2' ? ' active' : ''}" href="${baseUrl}fundamentals/">
            <span class="icon" role="img" aria-hidden="true">psychology</span>
            <span class="title">Fundamentals</span>
          </a></li>
        <li><a class="nav-item item3${activeClass === 'item3' ? ' active' : ''}" href="${baseUrl}designs/">
            <span class="icon" role="img" aria-hidden="true">web</span>
            <span class="title">Designs</span>
          </a></li>
        <li><a class="nav-item item4${activeClass === 'item4' ? ' active' : ''}" href="${baseUrl}experiments/">
            <span class="icon" role="img" aria-hidden="true">experiment</span>
            <span class="title">Experiments</span>
          </a></li>
        <li><a class="nav-item item5${activeClass === 'item5' ? ' active' : ''}" href="${baseUrl}resources/">
            <span class="icon" role="img" aria-hidden="true">folder_open</span>
            <span class="title">Resources</span>
          </a></li>
           <div class="nav-background"></div>
      </nav>
      <site-settings></site-settings>
    </section>`;
    this.setupMobileSettings();
   

  }

  setupMobileSettings() {
    // Create mobile settings elements and append to body
    if (!document.getElementById('mobile-settings-overlay')) {
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

      // Add event listeners
      button.addEventListener('click', () => {
        popover.classList.toggle('open');
        overlay.classList.toggle('open');
      });

      overlay.addEventListener('click', () => {
        popover.classList.remove('open');
        overlay.classList.remove('open');
      });

      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popover.classList.contains('open')) {
          popover.classList.remove('open');
          overlay.classList.remove('open');
        }
      });
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




}

customElements.define('site-navigation', SiteNavigation);
