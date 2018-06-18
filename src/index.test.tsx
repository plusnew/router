import enzymeAdapterPlusnew, { mount } from 'enzyme-adapter-plusnew';
import { configure } from 'enzyme';
import plusnew, { component } from 'plusnew';
import buildRoute from './index';
import { componentPartial } from './test';

configure({ adapter: new enzymeAdapterPlusnew() });

describe('test App.tsx', () => {
  it('button should be found', () => {
    const Component = component(
      'Component',
      () => ({}),
      (props: {foo: string, bar: number}) => <div />,
    );

    const ComponentPartial = componentPartial(Component);

    const route = buildRoute('namespace', {
      foo: 'string',
      bar: 'number',
    }, ({foo, bar}) => {
      return <Component foo={foo} bar={bar} />;
    });

    const wrapper = mount(
      <>
        <route.Link bar={2} foo="foovalue" />
        <route.Component />
      </>,
    );

    expect(wrapper.contains(<a href="/namespace/foo/foovalue/bar/2" />)).toBe(true);
    expect(wrapper.containsMatchingElement(<ComponentPartial />)).toBe(false);
  });
});
