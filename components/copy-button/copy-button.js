class CopyButton extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="css/style.css" type="text/css">
        <button id="copyBtn">
          <span class="icon">content_copy</span>
          <slot class="text">Copy Text</slot>
        </button>
        <input type="text" id="textToCopy" style="display:none;">
      `;
    }

    connectedCallback() {
      this.copyBtn = this.shadowRoot.getElementById('copyBtn');
      this.icon = this.shadowRoot.querySelector('.icon');
      this.textSlot = this.shadowRoot.querySelector('slot');
      this.copyBtn.addEventListener('click', () => this.copyText());
      this.updateTextToCopy();
    }

    static get observedAttributes() {
      return ['copy-text'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'copy-text') {
        this.updateTextToCopy();
      }
    }

    updateTextToCopy() {
      const input = this.shadowRoot.getElementById('textToCopy');
      input.value = this.getAttribute('copy-text') || 'Default text to copy';
    }

    copyText() {
      const input = this.shadowRoot.getElementById('textToCopy');
      input.style.display = 'block';
      input.select();
      document.execCommand('copy');
      input.style.display = 'none';
      this.showCopiedMessage();
    }

    showCopiedMessage() {
      const originalText = this.textSlot.assignedNodes()[0]?.textContent || 'Copy Text';
      const originalIcon = this.icon.textContent;
      this.textSlot.assignedNodes()[0].textContent = 'Copied!';
      this.icon.textContent = 'check';
      setTimeout(() => {
        this.textSlot.assignedNodes()[0].textContent = originalText;
        this.icon.textContent = originalIcon;
      }, 3000);
    }
  }

  customElements.define('copy-button', CopyButton);