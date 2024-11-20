// Define the template outside the class for better performance
const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
    }
    .card-container {
      cursor: pointer;
      position: relative;
    }
    /* Add more styles as needed */
  </style>
   
    <link href="css/components/card.css" rel="stylesheet"/>

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
      <slot class="lg body post" name="post"></slot>
      <footer>
        <button autofocus id="closeBtn2">Close</button>
      </footer>
    </div>
  </dialog>
`;

class SimpleCard extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'version', 'dialog-id'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    if (!SimpleCard.templateContent) {
      SimpleCard.templateContent = template.content.cloneNode(true);
    }
    this.shadowRoot.appendChild(SimpleCard.templateContent.cloneNode(true));

    // Initialize properties from attributes
    this._title = this.getAttribute('title') || '';
    this._version = this.getAttribute('version') || '';
    this._dialogId = this.getAttribute('dialog-id') || '';

    // Bind methods
    this.showDialog = this.showDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.handleEvents = this.handleEvents.bind(this);
    this.handleNavigate = this.handleNavigate.bind(this);
    this.handleSlotClick = this.handleSlotClick.bind(this);

    // Store the original navigation entry key
    this.originalEntryKey = null;
  }

  connectedCallback() {
    // Add click handlers for both the container and slots
    const cardContainer = this.shadowRoot.querySelector('.card-container');
    cardContainer.addEventListener('click', this.handleEvents);

    // Add click listeners to all slots
    const slots = this.shadowRoot.querySelectorAll('slot');
    slots.forEach(slot => {
      slot.addEventListener('click', this.handleSlotClick);
      slot.addEventListener('slotchange', (e) => {
        // Add click listeners to newly slotted elements
        const assignedElements = e.target.assignedElements();
        assignedElements.forEach(element => {
          element.addEventListener('click', this.handleSlotClick);
        });
      });
    });

    // Add dialog-related event listeners
    this.shadowRoot.querySelector('dialog').addEventListener('click', this.handleEvents);
    this.shadowRoot.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', this.handleEvents);
    });

    if ('navigation' in window) {
      navigation.addEventListener('navigate', this.handleNavigate);
    } else {
      window.addEventListener('popstate', this.handlePopState);
    }

    this.updateComponent();

    // Check URL hash after initialization
    requestAnimationFrame(() => {
      this.checkUrlForDialog();
    });
  }

  disconnectedCallback() {
    // Remove all event listeners
    const cardContainer = this.shadowRoot.querySelector('.card-container');
    cardContainer.removeEventListener('click', this.handleEvents);

    const slots = this.shadowRoot.querySelectorAll('slot');
    slots.forEach(slot => {
      slot.removeEventListener('click', this.handleSlotClick);
      const assignedElements = slot.assignedElements();
      assignedElements.forEach(element => {
        element.removeEventListener('click', this.handleSlotClick);
      });
    });

    if ('navigation' in window) {
      navigation.removeEventListener('navigate', this.handleNavigate);
    } else {
      window.removeEventListener('popstate', this.handlePopState);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      // Map attribute names to property names
      const propName = this._attributeToProperty(name);
      this[propName] = newValue;
      this.updateComponent();
    }
  }

  // Helper method to map attribute names to property names
  _attributeToProperty(attributeName) {
    return '_' + attributeName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
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

  get dialogId() {
    return this._dialogId;
  }

  set dialogId(value) {
    this._dialogId = value;
    this.setAttribute('dialog-id', value);
  }

  updateComponent() {
    const cardTitle = this.shadowRoot.querySelector('.card-title');
    const dialogTitle = this.shadowRoot.getElementById('dialog-title');
    const mediaSlot = this.shadowRoot.querySelector('slot[name="media"]');

    if (cardTitle) cardTitle.textContent = this._title;
    if (dialogTitle) dialogTitle.textContent = this._title;
    if (mediaSlot) mediaSlot.className = this._version || '';

    // Generate a unique dialog ID if not provided
    if (!this._dialogId) {
      this._dialogId = `dialog-${Math.random().toString(36).substr(2, 9)}`;
      this.setAttribute('dialog-id', this._dialogId);
    }
  }

  handleSlotClick(event) {
    // Prevent the event from bubbling up to avoid double triggers
    event.stopPropagation();
    this.showDialog();
  }

  handleEvents(event) {
    const target = event.target;

    if (target.closest('.card-container')) {
      this.showDialog();
    } else if (target.id === 'closeBtn1' || target.id === 'closeBtn2') {
      this.closeDialog(event);
    } else if (target.nodeName === 'DIALOG') {
      const rect = target.getBoundingClientRect();
      const clickedInDialog =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (!clickedInDialog) this.closeDialog(event);
    }
  }

  showDialog() {
    const dialog = this.shadowRoot.querySelector('dialog');
    if (dialog && !dialog.open) {
      dialog.showModal();
      this.trackDialogOpen();

      // Push a new navigation entry using the Navigation API
      if ('navigation' in window) {
        // Store the key of the original entry
        this.originalEntryKey = navigation.currentEntry.key;

        // Push a new navigation entry with the dialog ID in the hash
        const url = new URL(window.location);
        url.hash = this._dialogId;
        navigation.navigate(url.toString(), { history: 'push' });
      } else {
        // Fallback for browsers without Navigation API
        const url = new URL(window.location);
        url.hash = this._dialogId;
        window.history.pushState({ dialogOpen: true }, '', url.toString());
      }
    }
  }

  closeDialog(event) {
    if (event) event.stopPropagation();
    const dialog = this.shadowRoot.querySelector('dialog');
    if (dialog) dialog.close();

    if ('navigation' in window) {
      if (this.originalEntryKey) {
        // Navigate back to the original entry
        navigation.traverseTo(this.originalEntryKey);
        // Clear the stored key
        this.originalEntryKey = null;
      } else {
        // If no original key, replace the current entry
        navigation.navigate(document.location.pathname, { history: 'replace' });
      }
    } else {
      // Fallback for browsers without Navigation API
      window.history.back();
    }
  }

  handleNavigate(event) {
    // Only handle backward or forward navigation
    const dialog = this.shadowRoot.querySelector('dialog');
    const url = new URL(event.destination.url);
    const hash = url.hash.slice(1); // Remove the '#' character

    if (hash === this._dialogId && !dialog.open) {
      // Open the dialog if navigating to its URL
      this.showDialog();

      // Intercept the navigation to prevent reloading
      event.intercept({ handler: () => {
        console.log('Navigation intercepted to prevent reloading');
        return Promise.resolve();
      }});
    } else if (hash !== this._dialogId && dialog.open) {
      // Close the dialog if navigating away from its URL
      dialog.close();

      // Intercept the navigation to prevent leaving the page
      event.intercept({ handler: () => {
        console.log('Navigation intercepted to prevent reloading');
        return Promise.resolve();
      }});
    }
  }

  // Fallback for browsers without Navigation API
  handlePopState(event) {
    const currentHash = window.location.hash.slice(1);
    const dialog = this.shadowRoot.querySelector('dialog');

    if (currentHash === this._dialogId && !dialog.open) {
      this.showDialog();
    } else if (currentHash !== this._dialogId && dialog.open) {
      dialog.close();
    }
  }

  checkUrlForDialog() {
    const currentHash = window.location.hash.slice(1); // Remove the '#' character
    if (currentHash === this._dialogId) {
      this.showDialog();
    }
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