class NavTab extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
            <style>
                ${this.getStyle()}
            </style>
            <div class="nav-card" id="${this.getAttribute('target')}">
                <div class="icon material-icons">${this.getAttribute('icon')}</div>
                <div class="title-group">
                    <div class="title">${this.getAttribute('title')}</div>
                    <div class="description">${this.getAttribute('description')}</div>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        this.shadowRoot.querySelector('.nav-card').addEventListener('click', () => this.toggleTab());
    }

    toggleTab() {
        const targetId = this.getAttribute('target');
        const contentAreas = document.querySelectorAll('.tab-content');
        contentAreas.forEach(content => {
            content.style.display = 'none'; // Hide all tabs
        });

        const activeTab = document.getElementById(targetId);
        activeTab.style.display = 'block'; // Show the clicked tab
    }

    getStyle() {
        return `:host { /* styles from your .nav-card and other classes */ }`;
    }
}

customElements.define('nav-tab', NavTab);
