// Define the template outside the class for better performance
const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
    }
    .card-container {
      /* Add your styles here */
    }
    /* Add more styles as needed */
  </style>
    <link  href="css/style.css" rel="stylesheet"/>
        <link  href="components/card/card.css" rel="stylesheet"/>

  <div class="card-container">
    <slot name="media"></slot>
    <h2 class="card-title heading sm"></h2>
    <slot class="badge-group" name="badge"></slot>
    <slot name="content"></slot>
  </div>
  <dialog part="dialog">
    <div class="wrapper">
      <header>
        <h2 class="heading md" id="dialog-title"></h2>
        <button class="icon-button" id="closeBtn1" aria-label="Close dialog">Close</button>
      </header>
      <slot class="lg body" name="post"></slot>
      <footer>
        <button autofocus id="closeBtn2">Close</button>
      </footer>
    </div>
  </dialog>
`;

class SimpleCard extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'version'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this._title = '';
    this._version = '';

    // Bind methods
    this.showDialog = this.showDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.handleEvents = this.handleEvents.bind(this);
  }

  connectedCallback() {
    this.shadowRoot.addEventListener('click', this.handleEvents);
    this.updateComponent();
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener('click', this.handleEvents);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[name] = newValue;
      this.updateComponent();
    }
  }

  get title() {
    return this._title;
  }

  set title(value) {
    this._title = value;
    this.setAttribute('title', value);
  }

  get version() {
    return this._version;
  }

  set version(value) {
    this._version = value;
    this.setAttribute('version', value);
  }

  updateComponent() {
    const cardTitle = this.shadowRoot.querySelector('.card-title');
    const dialogTitle = this.shadowRoot.getElementById('dialog-title');
    const mediaSlot = this.shadowRoot.querySelector('slot[name="media"]');

    if (cardTitle) cardTitle.textContent = this._title;
    if (dialogTitle) dialogTitle.textContent = this._title;
    if (mediaSlot) mediaSlot.className = this._version || '';
  }

  handleEvents(event) {
    const target = event.target;

    if (target.closest('.card-container')) {
      this.showDialog();
    } else if (target.id === 'closeBtn1' || target.id === 'closeBtn2') {
      this.closeDialog(event);
    } else if (target.nodeName === 'DIALOG') {
      const rect = target.getBoundingClientRect();
      const clickedInDialog = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );
      if (!clickedInDialog) this.closeDialog(event);
    }
  }

  showDialog() {
    const dialog = this.shadowRoot.querySelector('dialog');
    if (dialog && !dialog.open) {
      dialog.showModal();
      this.trackDialogOpen();
    }
  }

  closeDialog(event) {
    event.stopPropagation();
    const dialog = this.shadowRoot.querySelector('dialog');
    if (dialog) dialog.close();
  }

  trackDialogOpen() {
    console.log("Dialog opened");
    if (typeof gtag === 'function') {
      gtag('event', 'open_card', {
        'event_category': 'Dialog',
        'event_label': `Card - ${this.title}`,
        'value': 1
      });
    }
  }
}

customElements.define('simple-card', SimpleCard);