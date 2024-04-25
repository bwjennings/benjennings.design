class SidebarNav extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .nav-card {
                    cursor: pointer;
                    padding: 10px;
                    margin: 5px;
                    border-radius: 5px;
                }
                .nav-card.active {
                    background-color: #f0f0f0;
                }
                .icon {
                    font-size: 20px;
                }
                .title-group {
                    display: flex;
                    flex-direction: column;
                }
                .title {
                    font-weight: bold;
                }
                .description {
                    font-size: 12px;
                }
            </style>
            <nav class="sidebar">
                <div class="nav-card" id="designs" onclick="location.href='designs.html'">
                    <div class="icon">design_services</div>
                    <div class="title-group">
                        <div class="title">Designs</div>
                        <div class="description">Some of my work</div>
                    </div>
                </div>
                <div class="nav-card" id="experiments" onclick="location.href='experiments.html'">
                    <div class="icon">experiment</div>
                    <div class="title-group">
                        <div class="title">Experiments</div>
                        <div class="description">Extra Things</div>
                    </div>
                </div>
                <div class="nav-card" id="resources" onclick="location.href='resources.html'">
                    <div class="icon">category</div>
                    <div class="title-group">
                        <div class="title">Resources</div>
                        <div class="description">Files and more</div>
                    </div>
                </div>
            </nav>
        `;
    }

    connectedCallback() {
        this.updateActiveCard();
    }

    static get observedAttributes() {
        return ['active'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'active') {
            this.updateActiveCard();
        }
    }

    updateActiveCard() {
        const activeId = this.getAttribute('active');
        const cards = this.shadowRoot.querySelectorAll('.nav-card');
        cards.forEach(card => {
            card.classList.remove('active');
            if (card.id === activeId) {
                card.classList.add('active');
            }
        });
    }
}

// Define the new element
customElements.define('sidebar-nav', SidebarNav);
