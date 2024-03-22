import { html } from 'lit';
import '../src/ben-cards.js';
export default {
    title: 'BenCards',
    component: 'ben-cards',
    argTypes: {
        backgroundColor: { control: 'color' },
    },
};
const Template = ({ header, backgroundColor = 'white' }) => html `
  <ben-cards style="--ben-cards-background-color: ${backgroundColor}" .header=${header}></ben-cards>
`;
export const App = Template.bind({});
App.args = {
    header: 'My app',
};
//# sourceMappingURL=ben-cards.stories.js.map