import figma, { html } from "@figma/code-connect/html"

figma.connect(
  "37542:28212", // Using the node ID from the mapping
  {
    props: {
      icon: figma.string("Icon"),
      title: figma.string("Title"),
      description: figma.string("Description"),
      buttonText: figma.string("Button Text"),
      buttonUrl: figma.string("Button URL"),
      style: figma.enum("Style", {
        "Style A": "a",
        "Style B": "b", 
        "Style C": "c",
        "Style D": "d",
      }),
      showDescription: figma.boolean("Show Description"),
    },
    example: (props: any) =>
      html`<resource-card
        icon="${props.icon}"
        title="${props.title}"
        description="${props.description}"
        button-text="${props.buttonText}"
        button-url="${props.buttonUrl}"
        style="${props.style}"
        show-description="${props.showDescription}"
      ></resource-card>`,
  },
)