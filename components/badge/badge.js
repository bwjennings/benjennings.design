class BadgeComponent extends HTMLElement {
    constructor() {
        super(); // Always call super first in constructor
        this.attachShadow({ mode: 'open' }); // Attach a shadow root to the element.
        
        // Create a style element and add CSS rules
        const style = document.createElement('style');
        style.textContent = `
            span {
                padding: 4px 12px;
                background-color: var(--background-primary);
                border: 1px solid var(--border-primary);
                color: var(--foreground-primary);
                display: inline-flex;
                padding: var(--spacing-small, 8px);
                justify-content: center;
                align-items: center;
                gap: var(--spacing-x-small, 4px);
                
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
