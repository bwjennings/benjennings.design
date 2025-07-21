import figma, { html } from "@figma/code-connect/html"



figma.connect(
  "https://www.figma.com/design/YY1gZoLcBXAtiDy1LeDWW0/cards?node-id=839-684&t=WLgGrNctWWkJGZC5-4",
  {
    props: {
      icon: figma.string("Icon"),
      text: figma.string("Text"),
        variant: figma.enum("variant", {
        Default: "default",
        accent: "accent",
        "accent 2": "accent-2",
        "accent 3": "accent-3",
      }),
    },
    example: (props) =>
      html`<ben-badge
        icon="${props.icon}"
        text="${props.text}"
        variant="${props.variant}"
      ></ben-badge>`,
  },
)
