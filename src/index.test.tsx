import enzymeAdapterPlusnew, { mount } from 'enzyme-adapter-plusnew';
import { configure } from 'enzyme';
import plusnew, { component, Props } from 'plusnew';
import Router, { providerType } from './index';
import { buildComponentPartial } from './test';

configure({ adapter: new enzymeAdapterPlusnew() });

describe('test router', () => {
  let testProvider: providerType;

  beforeEach(() => {
    testProvider = {
      url: '/',
      push: jasmine.createSpy('pushSpy', (url: string) => {
        testProvider.url = url;
      }).and.callThrough(),
      pop: jasmine.createSpy('popSpy', () => {
        testProvider.url = 'popped';
      }).and.callThrough(),
    };
  });

  it('link should be found and be clickable', () => {
    const router = new Router(testProvider);

    const Component = component(
      'Component',
      (_Props: Props<{param1: string, param2: number}>) => <div />,
    );

    const route = router.createRoute('namespace', {
      param1: 'string',
      param2: 'number',
    }, params => <Component {...params}/>);

    const wrapper = mount(
      <>
        <route.Link params={{ param2:'foovalue', param1: 2 }}>link<span /></route.Link>
        <route.Component />
        <router.NotFound><span>404</span><div /></router.NotFound>
      </>,
    );

    const ComponentPartial = buildComponentPartial(Component);
    expect(wrapper.contains(<span>404</span>)).toBe(true);

    expect(wrapper.containsMatchingElement(<a href="/namespace/foo/foovalue/bar/2">link<span /></a>)).toBe(true);
    expect(wrapper.containsMatchingElement(<ComponentPartial />)).toBe(false);

    wrapper.find('a').simulate('click')

    expect(wrapper.contains(<span>404</span>)).toBe(false);
    expect(wrapper.contains(<Component param1="foovalue" param2={2} />)).toBe(true);
  });
});
