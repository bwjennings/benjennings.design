import { html, TemplateResult } from 'lit';
import '../src/ben-cards.js';

export default {
  title: 'BenCards',
  component: 'ben-cards',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  header?: string;
  backgroundColor?: string;
}

const Template: Story<ArgTypes> = ({ header, backgroundColor = 'white' }: ArgTypes) => html`
  <ben-cards style="--ben-cards-background-color: ${backgroundColor}" .header=${header}></ben-cards>
`;

export const App = Template.bind({});
App.args = {
  header: 'My app',
};
