// icon-card.js

// Define the custom element
class IconCard extends HTMLElement {
    constructor() {
        super();
        // Create a shadow root
        this.attachShadow({ mode: 'open' });

        // Define the component's internal structure and style from attributes
        // Default values are provided if attributes are not set
        this._iconName = this.getAttribute('icon') || 'help';
        this._titleText = this.getAttribute('title') || 'Card Title';
        this._hrefLink = this.getAttribute('href') || '#';
        this._cardVariant = this.getAttribute('variant') || ''; // No default variant class
        this._colSpan = parseInt(this.getAttribute('span')) || 1;

        // Link the external stylesheet to the shadow DOM
        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', 'css/components/card.css'); // Path to your CSS file
        this.shadowRoot.appendChild(linkElem);
    }

    // Called when the element is inserted into the DOM
    connectedCallback() {
        this._render();
        this._applyVariantClass();
        this._applyColSpan();
    }

    // Observe attributes for changes
    static get observedAttributes() {
        return ['icon', 'title', 'href', 'variant', 'span'];
    }

    // Called when an observed attribute changes
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return; // Do nothing if value hasn't changed

        switch (name) {
            case 'icon':
                this._iconName = newValue;
                break;
            case 'title':
                this._titleText = newValue;
                break;
            case 'href':
                this._hrefLink = newValue;
                break;
            case 'variant':
                // Update the class on the host element when the variant changes
                this._updateVariantClass(oldValue, newValue);
                this._cardVariant = newValue; // Update internal state
                break;
            case 'span':
                this._colSpan = parseInt(newValue) || 1;
                this._applyColSpan();
                break;
        }
        // Re-render only the HTML part, styles are now external
        this._renderHTML();
    }

    // Helper method to add the initial variant class to the host element
    _applyVariantClass() {
        if (this._cardVariant) {
            this.classList.add(`variant-${this._cardVariant}`);
        }
    }

    // Helper method to update the variant class on the host element
    _updateVariantClass(oldVariant, newVariant) {
        const container = this.shadowRoot.querySelector('.card-container');
        if (oldVariant && container) {
            container.classList.remove(oldVariant);
        }
        if (newVariant && container) {
            container.classList.add(newVariant);
        }
        // Update host element classes as before
        if (oldVariant) {
            this.classList.remove(`variant-${oldVariant}`);
        }
        if (newVariant) {
            this.classList.add(`variant-${newVariant}`);
        }
    }

    _applyColSpan() {
        // Ensure the component spans up to the specified number of columns
        this.style.gridColumn = `span ${this._colSpan}`;
    }

    // Initial render method (called once or if fundamental structure needs rebuild)
    _render() {
        // The stylesheet is already linked in the constructor.
        // Now, just render the HTML structure.
        this._renderHTML();
    }

    // Method to render only the component's HTML structure within the shadow DOM
    // This is called on attribute changes to update content without re-adding styles
    _renderHTML() {
        // Check if the card link container already exists to avoid duplicating it
        // and to ensure we are just updating its content.
        let cardLinkContainer = this.shadowRoot.querySelector('.card-container');
        if (!cardLinkContainer) {
            cardLinkContainer = document.createElement('a');
            cardLinkContainer.classList.add('card-container');
            if (this._cardVariant) {
                cardLinkContainer.classList.add(this._cardVariant);
            }
            this.shadowRoot.appendChild(cardLinkContainer);
        }

        // Always update href on the container
        cardLinkContainer.setAttribute('href', this._hrefLink);

        // Set the inner HTML of the container, creating or updating the card's content.
        // This includes the icon and title.
        cardLinkContainer.innerHTML = `
            <span class="icon">${this._iconName}</span>
            <span class="title">${this._titleText}</span>
        `;
    }
}

// Define the new custom element for use in HTML
// This makes <icon-card> a valid HTML tag that the browser will recognize and process
// using the IconCard class.
customElements.define('icon-card', IconCard);
