class CardComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['title', 'icon'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.render();
  }

  render() {
    const title = this.getAttribute('title') || 'This is a card';
    const icon = this.getAttribute('icon') || 'home';
    this.shadowRoot.innerHTML = `
      <style>
        .card {
          border: 1px solid #ccc;
          border-radius: 5px;
          padding: 20px;
          margin: 10px 0;
          display: flex;
          align-items: center;
        }
        .card:hover{
          background-color: var(--container-background-neutral-hover)
        };
        .icon {
          margin-right: 15px;
        }
        .title {
          font-size: 20px;
        }
      </style>
      <div class="card">
        <div class="icon">${icon}</div>
        <div class="title">${title}</div>
      </div>
    `;
  }
}

window.customElements.define('card-component', CardComponent);