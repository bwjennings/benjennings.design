// Define the web component
        class HueChangerButton extends HTMLElement { // Class name can remain, or be changed for clarity.
                                                    // The important part is the customElements.define name.
            constructor() {
                super(); // Always call super first in constructor

                // Create the button element
                this.button = document.createElement('button');
                this.button.textContent = 'Change Hue';

                // Bind the event handler once so it can be removed later
                this.boundChangeHue = this.changeHue.bind(this);
            }

            // Called when the element is added to the document's DOM
            connectedCallback() {
                // Append the button to the custom element
                this.appendChild(this.button);

                // Add event listener using the bound handler
                this.button.addEventListener('click', this.boundChangeHue);
            }

            // Called when the element is removed from the document's DOM
            disconnectedCallback() {
                // Remove event listener to prevent memory leaks
                this.button.removeEventListener('click', this.boundChangeHue);
                this.boundChangeHue = null;
            }

            // Method to change the hue
            changeHue() {
                // Constants for magic numbers
                const MAX_HUE = 360;
                const MAX_RADIUS = 8;
                const MIN_CHROMA = 0.010;
                const CHROMA_RANGE = 0.01;
                const MIN_CONTRAST = 0.5;
                const CONTRAST_RANGE = 1.0;

                // Generate random values
                const randomHue = Math.floor(Math.random() * (MAX_HUE + 1));
                const randomRadius = Math.floor(Math.random() * (MAX_RADIUS + 1));
                const randomChromaBase = (Math.random() * CHROMA_RANGE + MIN_CHROMA).toFixed(3);
                const randomContrast = (Math.random() * CONTRAST_RANGE + MIN_CONTRAST).toFixed(2);

                // Apply CSS variables
                document.documentElement.style.setProperty('--hue-root', randomHue + 'deg');
                document.documentElement.style.setProperty('--base-radius', randomRadius + 'px');
                document.documentElement.style.setProperty('--chroma-base', randomChromaBase);
                document.documentElement.style.setProperty('--contrast', randomContrast);

                // Persist all values to localStorage for consistency
                localStorage.setItem('brandHue', randomHue);
                localStorage.setItem('baseRadius', randomRadius);
                localStorage.setItem('chromaBase', randomChromaBase);
                localStorage.setItem('contrast', randomContrast);

                // Optional: Update a display to show the current hue
                const hueDisplay = document.getElementById('hueValue');
                if (hueDisplay) {
                    hueDisplay.textContent = `${randomHue}°`;
                }
            }
        }

        // Define the new custom element with the name 'color-changer'
        // Custom element names must contain a hyphen
        customElements.define('color-changer', HueChangerButton);
