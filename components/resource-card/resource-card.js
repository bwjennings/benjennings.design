class ResourceCard extends HTMLElement {
  constructor() {
    super();
    // Attach a shadow DOM tree to this instance
    const shadow = this.attachShadow({ mode: "open" });

    // Create a template element
    const template = document.createElement("template");

    // Define the HTML structure in the template
    template.innerHTML = `
       
       <style>
        
          .resource-card {
            cursor: pointer;
            display: flex;
            flex-direction: row;
    
            height: 100%;
            background: var(--background-primary);
            border: 1px solid var(--border-primary);
        
            container-type: inline-size;
            transition: outline 300ms cubic-bezier(0.46, 1.33, 0.68, 1.58),
            font-variation-settings 300ms cubic-bezier(0.46, 1.33, 0.68, 1.58);
            font-variation-settings: "GRAD" 0;
            color: var(--foreground-primary);
            gap: var(--spacing-large);
            overflow: hidden;
            outline-offset: 0px;
            anchor-name: --card;
        
        
          }
        
         
        
          
          .box {
            --animation-position: 0;
        
            font-variation-settings: 'GRAD' -200, 'FILL' 1;
            font-family: var(--icon-font-family);
            font-size: 15cqw;
            text-align:center;
            font-variation-settings:
              'FILL' 1,
        
              'wght' 700,
        
              'GRAD' 200;
        
        
            overflow: hidden;
            display: flex;
            height: 100px;
            aspect-ratio: 1 / 1;
            width: auto;
            align-self: stretch;
            background: var(--background-brand-secondary);
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: var(--foreground-brand-secondary);
            margin-top: -16px;
            margin-inline: -16px;
            user-select: none;
            -webkit-user-select: none;
        
        
        
          }

           .content-area{
            display:flex;
            flex: 1 0 0;
            padding:24px;
            
            }

            .content{
                        flex: 1 0 0;

            display:flex;
            flex-direction:column;
            }
        
          .box span {
        
            rotate: -20deg;
            opacity: 0.5;
            animation: iconAnimate 5s ease-in-out infinite alternate;
            font-weight: 600;
        
        
          }
        </style>
        <div class=" resource-card">
          <div class="box">
            <span>home</span>
        
          </div>
          <div class="content-area">
            <div class="content">
              <div class="heading sm">Title</div>
              <div class="div">Description</div>
            </div>
            <button part="button" class="button">
              Download
            </button>
          </div>
        </div>
      `;

    // Clone the template content and attach it to the shadow DOM
    shadow.appendChild(template.content.cloneNode(true));
  }
}

// Define the new element
customElements.define("resource-card", ResourceCard);
