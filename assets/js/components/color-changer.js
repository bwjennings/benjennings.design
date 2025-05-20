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
            }

            // Method to change the hue
            changeHue() {
                // Generate a random number between 0 and 360
                const randomHue = Math.floor(Math.random() * 361); // 0 to 360 inclusive

                // Set the CSS variable on the :root element (document.documentElement)
                // Ensure the value is formatted as a degree string (e.g., "120deg")
                document.documentElement.style.setProperty('--brand-hue', randomHue + 'deg');

                // Generate a random number between 0 and 8 inclusive
                const randomRadius = Math.floor(Math.random() * 9); // 0 to 8 inclusive
                document.documentElement.style.setProperty('--base-radius', randomRadius + 'px');

              // Generate a random chroma strength (0.010–0.020)
              const randomChromaBase = (Math.random() * 0.01 + 0.010).toFixed(3);
              document.documentElement.style.setProperty('--chroma-base', randomChromaBase);

                console.log(`--brand-hue set to: ${randomHue}deg`);

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
