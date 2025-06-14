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
    this.innerHTML = `
    <nav class="sidebar">
      <h2 class="site-title"><a href="/">Ben Jennings</a></h2>
      <div class="active-box"></div>
      <menu>
        <li><a class="nav-item item1" href="/">
            <span class="icon" role="img" aria-hidden="true">waving_hand</span>
            <span class="title">Home</span>
          </a></li>
        <li><a class="nav-item item2" href="/fundamentals/">
            <span class="icon" role="img" aria-hidden="true">psychology</span>
            <span class="title">Fundamentals</span>
          </a></li>
        <li><a class="nav-item item3" href="/designs/">
            <span class="icon" role="img" aria-hidden="true">web</span>
            <span class="title">Designs</span>
          </a></li>
        <li><a class="nav-item item4" href="/experiments/">
            <span class="icon" role="img" aria-hidden="true">experiment</span>
            <span class="title">Experiments</span>
          </a></li>
        <li><a class="nav-item item5" href="/resources/">
            <span class="icon" role="img" aria-hidden="true">folder_open</span>
            <span class="title">Resources</span>
          </a></li>
      </menu>
      <theme-control></theme-control>
      <site-settings></site-settings>
    </nav>`;

    this.setActiveItem();
  }

  setActiveItem() {
    const path = window.location.pathname;
    let selector = null;
    if (path === '/' || path === '/index.html') {
      selector = '.item1';
    } else if (path.startsWith('/fundamentals')) {
      selector = '.item2';
    } else if (path === '/designs/' || path.startsWith('/designs/')) {
      selector = '.item3';
    } else if (path === '/experiments/') {
      selector = '.item4';
    } else if (path === '/resources/') {
      selector = '.item5';
    }

    if (selector) {
      const link = this.querySelector(selector);
      if (link) link.classList.add('active');
    }
  }
}

customElements.define('site-navigation', SiteNavigation);
