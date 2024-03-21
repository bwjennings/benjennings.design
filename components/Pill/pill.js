
class Pill extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({
            mode: "open",
        }).appendChild(
            document
                .getElementById("template-pill")
                .content.cloneNode(true)
        );
    }

    public static get observedAttributes(): string[] {
        return [];
    }
}

customElements.define("pill", Pill);
