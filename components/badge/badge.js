class BadgeComponent extends HTMLElement {
    constructor() {
        super(); // Always call super first in constructor
        this.attachShadow({ mode: 'open' }); // Attach a shadow root to the element.
        
        // Create a style element and add CSS rules
        const style = document.createElement('style');
        style.textContent = `
            span {
                padding: 4px 12px;
                background-color: var(--accent-5);
                border: 1px solid var(--accent-10);
                color: var(--accent-70);
                border-radius: 99px;
                font-size: 14px;
            }
        `;

        // Create a span element and attach the slot for dynamic content
        const span = document.createElement('span');
        const slot = document.createElement('slot');
        span.appendChild(slot);

        // Append style and span to the shadow root
        this.shadowRoot.append(style, span);
    }
}

// Define the custom element
customElements.define('my-badge', BadgeComponent);
