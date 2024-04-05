class CardComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ["title", "icon"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.render();
  }

  render() {
    const title = this.getAttribute("title") || "This is a card";
    const icon = this.getAttribute("icon") || "design_services";
    this.shadowRoot.innerHTML = `
      <style>
        .card {
          border: 1px solid #ccc;
          border-radius: 5px;
          padding: 20px;
          
          display: flex;
          max-width: 500px;
          width:100%;
          scroll-snap-align: center;
          transition:100ms;
        }
        .card:active{
          transform: scale(90%);
        }
        .card:hover{
          background-color: var(--container-background-neutral-hover)
        }
        .icon {
          margin-right: 15px;
          font-family: var(--icon-font-family);
          font-size: var(--icon-size-large);
          line-height:100%;
          
        }

        .card:hover .icon {
          color: var(--text-brand) ;
        }

        .title {
          font-size: 20px;
          font-family: var(--text-font-family);
        }
      </style>
      <div class="card">
        <div class="icon">${icon}</div>
        <div class="title">${title}</div>
      </div>
    `;
  }
}

window.customElements.define("card-component", CardComponent);
