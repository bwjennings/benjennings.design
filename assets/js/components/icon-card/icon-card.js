class IconCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // Default values
        this._iconName = this.getAttribute('icon') || 'help';
        this._titleText = this.getAttribute('title') || 'Card Title';
        this._hrefLink = this.getAttribute('href') || '#';
        this._cardVariant = this.getAttribute('variant') || '';
        this._colSpan = parseInt(this.getAttribute('span')) || 1;

        // Badge support: expects a JSON array of badge configs
        // Example: '[{"icon":"star","text":"Featured","variant":"accent"}]'
        this._badges = [];
        const badgesAttr = this.getAttribute('badges');
        if (badgesAttr) {
            try {
                this._badges = JSON.parse(badgesAttr);
            } catch (e) {
                this._badges = [];
            }
        }

        // Link the external stylesheet to the shadow DOM
        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', 'css/components/card.css');
        this.shadowRoot.appendChild(linkElem);
    }

    static get observedAttributes() {
        return ['icon', 'title', 'href', 'variant', 'span', 'badges'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

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
                this._updateVariantClass(oldValue, newValue);
                this._cardVariant = newValue;
                break;
            case 'span':
                this._colSpan = parseInt(newValue) || 1;
                this._applyColSpan();
                break;
            case 'badges':
                try {
                    this._badges = JSON.parse(newValue);
                } catch (e) {
                    this._badges = [];
                }
                break;
        }
        this._renderHTML();
    }

    connectedCallback() {
        this._render();
        this._applyVariantClass();
        this._applyColSpan();
    }

    _applyVariantClass() {
        if (this._cardVariant) {
            this.classList.add(`variant-${this._cardVariant}`);
        }
    }

    _updateVariantClass(oldVariant, newVariant) {
        const container = this.shadowRoot.querySelector('.card-container');
        if (oldVariant && container) {
            container.classList.remove(oldVariant);
        }
        if (newVariant && container) {
            container.classList.add(newVariant);
        }
        if (oldVariant) {
            this.classList.remove(`variant-${oldVariant}`);
        }
        if (newVariant) {
            this.classList.add(`variant-${newVariant}`);
        }
    }

    _applyColSpan() {
        this.style.gridColumn = `span ${this._colSpan}`;
    }

    _render() {
        this._renderHTML();
    }

    _renderHTML() {
        let cardLinkContainer = this.shadowRoot.querySelector('.card-container');
        if (!cardLinkContainer) {
            cardLinkContainer = document.createElement('a');
            cardLinkContainer.classList.add('card-container');
            if (this._cardVariant) {
                cardLinkContainer.classList.add(this._cardVariant);
            }
            this.shadowRoot.appendChild(cardLinkContainer);
        }

        cardLinkContainer.setAttribute('href', this._hrefLink);

        // Render badges using <ben-badge>
        const badgesHTML = this._badges.map(badge =>
            `<ben-badge icon="${badge.icon || ''}" text="${badge.text || ''}" variant="${badge.variant || 'default'}"></ben-badge>`
        ).join('');

        cardLinkContainer.innerHTML = `
            <span class="icon">${this._iconName}</span>
            <span class="title">${this._titleText}</span>
            <div class="badges">${badgesHTML}</div>
        `;
    }
}

customElements.define('icon-card', IconCard);
