import figma, { html } from "@figma/code-connect/html"

/**
 * Badge component Code Connect configuration for Figma
 * Maps Figma badge designs to the ben-badge web component
 */

figma.connect(
  "https://www.figma.com/design/YY1gZoLcBXAtiDy1LeDWW0/cards?node-id=36832-887&t=RLhEgGTCEwbdnHNI-4",
  {
    props: {
      text: figma.string("Text"),
      icon: figma.string("Icon"),
      variant: figma.enum("variant", {
        default: "default",
        primary: "primary",
        secondary: "secondary",
        "accent-1": "accent-1",
        "accent-2": "accent-2",
        "accent-3": "accent-3",
      }),
    },
    example: (props) => html`<ben-badge
        icon="${props.icon}"
        text="${props.text}"
        variant="${props.variant}"
      ></ben-badge>`,
  },
)