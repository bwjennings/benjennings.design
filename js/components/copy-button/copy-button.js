class CopyButton extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="/assets/css/components/button.css" type="text/css">
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
      
      if (!this.copyBtn) {
        console.error("Copy button not found in shadow DOM");
        return;
      }
      
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
      if (input) {
        input.value = this.getAttribute('copy-text') || 'Default text to copy';
      }
    }

    async copyText() {
      const textToCopy = this.getAttribute('copy-text') || 'Default text to copy';
      
      try {
        // Use modern Clipboard API if available
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(textToCopy);
          this.showCopiedMessage();
        } else {
          // Fallback to execCommand for older browsers
          const input = this.shadowRoot.getElementById('textToCopy');
          if (input) {
            input.style.display = 'block';
            input.select();
            document.execCommand('copy');
            input.style.display = 'none';
            this.showCopiedMessage();
          }
        }
      } catch (error) {
        console.error('Failed to copy text:', error);
        // Try fallback method
        try {
          const input = this.shadowRoot.getElementById('textToCopy');
          if (input) {
            input.style.display = 'block';
            input.select();
            document.execCommand('copy');
            input.style.display = 'none';
            this.showCopiedMessage();
          }
        } catch (fallbackError) {
          console.error('All copy methods failed:', fallbackError);
        }
      }
    }

    showCopiedMessage() {
      if (!this.textSlot || !this.icon) {
        console.warn("Text slot or icon element not found");
        return;
      }
      
      const assignedNodes = this.textSlot.assignedNodes();
      const textNode = assignedNodes[0];
      const originalText = textNode?.textContent || 'Copy Text';
      const originalIcon = this.icon.textContent;
      
      if (textNode) {
        textNode.textContent = 'Copied!';
      }
      this.icon.textContent = 'check';
      
      setTimeout(() => {
        if (textNode) {
          textNode.textContent = originalText;
        }
        if (this.icon) {
          this.icon.textContent = originalIcon;
        }
      }, 3000);
    }
  }

  customElements.define('copy-button', CopyButton);