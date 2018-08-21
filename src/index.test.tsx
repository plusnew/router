import enzymeAdapterPlusnew, { mount } from 'enzyme-adapter-plusnew';
import { configure } from 'enzyme';
import plusnew, { component, Props } from 'plusnew';
import buildRoute, { NoRoute } from './index';
import { componentPartial } from './test';

configure({ adapter: new enzymeAdapterPlusnew() });

describe('test router', () => {
  it('link should be found and be clickable', () => {
    const Component = component(
      'Component',
      (_Props: Props<{foo: string, bar: number}>) => <div />,
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
        <route.Link bar={2} foo="foovalue">link<span /></route.Link>
        <route.Component />
        <NoRoute><span>404</span><div /></NoRoute>
      </>
    );

    expect(wrapper.contains(<span>404</span>)).toBe(true);

    expect(wrapper.containsMatchingElement(<a href="/namespace/foo/foovalue/bar/2">link<span /></a>)).toBe(true);
    expect(wrapper.containsMatchingElement(<ComponentPartial />)).toBe(false);

    wrapper.find('a').simulate('click')

    expect(wrapper.contains(<span>404</span>)).toBe(false);
    expect(wrapper.contains(<Component foo="foovalue" bar={2} />)).toBe(true);
  });
});
