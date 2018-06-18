import enzymeAdapterPlusnew, { mount } from 'enzyme-adapter-plusnew';
import { configure } from 'enzyme';
import plusnew, { component } from 'plusnew';
import buildRoute from './index';
import { componentPartial } from './test';

configure({ adapter: new enzymeAdapterPlusnew() });

describe('test router', () => {
  it('link should be found and be clickable', () => {
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
        <route.Link bar={2} foo={"3"} />
        <route.Component />
      </>,
    );

    expect(wrapper.contains(<a href="/namespace/foo/foovalue/bar/2" />)).toBe(true);
    expect(wrapper.containsMatchingElement(<ComponentPartial />)).toBe(false);

    wrapper.search(<a href="/namespace/foo/foovalue/bar/2" />).simulate('click')

    expect(wrapper.contains(<Component foo="foovalue" bar={2}/>)).toBe(true);
  });
});
