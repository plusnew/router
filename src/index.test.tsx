import enzymeAdapterPlusnew, { mount } from 'enzyme-adapter-plusnew';
import { configure } from 'enzyme';
import plusnew, { component, Props, storeType } from 'plusnew';
import Router, { BasicDriver } from './index';
import { buildComponentPartial } from './test';

configure({ adapter: new enzymeAdapterPlusnew() });

describe('test router', () => {
  let basicDriver: {
    store: storeType<string, string>;
    push: (url: string) => void;
  };

  beforeEach(() => {
    basicDriver = new BasicDriver('/');
  });

  it('link should be found and be clickable', () => {
    const router = new Router(basicDriver);

    const Component = component(
      'Component',
      (_Props: Props<{param1: string, param2: number}>) => <div />,
    );

    const route = router.createRoute('namespace', {
      param1: 'string',
      param2: 'number',
    }, params => <Component {...params} />);

    const wrapper = mount(
      <>
        <route.Link parameter={{ param2: 2, param1: 'foo' }}>link</route.Link>
        <route.Component />
        <router.NotFound><span>404</span></router.NotFound>
        <router.Invalid><span>error happened</span></router.Invalid>
      </>,
    );

    const ComponentPartial = buildComponentPartial(Component);
    expect(wrapper.contains(<span>404</span>)).toBe(true);
    expect(wrapper.contains(<span>error happened</span>)).toBe(false);

    expect(wrapper.containsMatchingElement(<a href="/namespace/param1/foo/param2/2/">link</a>)).toBe(true);
    expect(wrapper.containsMatchingElement(<ComponentPartial />)).toBe(false);

    wrapper.find('a').simulate('click');

    expect(basicDriver.store.getState()).toBe('/namespace/param1/foo/param2/2/');

    expect(wrapper.contains(<span>404</span>)).toBe(false);
    expect(wrapper.contains(<Component param1="foo" param2={2} />)).toBe(true);

    basicDriver.store.dispatch('/namespace/invalid/parameter');

    expect(wrapper.contains(<span>404</span>)).toBe(false);
    expect(wrapper.contains(<span>error happened</span>)).toBe(true);
  });

  it('rootpath should work', () => {
    const router = new Router(basicDriver);

    const Component = component(
      'Component',
      (_Props: Props<{param1: string, param2: number}>) => <div />,
    );

    const route = router.createRoute('namespace', {
      param1: 'string',
      param2: 'number',
    }, params => <Component {...params} />);

    const wrapper = mount(
      <>
        <route.Component />
        <router.NotFound><span>404</span></router.NotFound>
        <router.Invalid><span>error happened</span></router.Invalid>
      </>,
    );

    const ComponentPartial = buildComponentPartial(Component);
    expect(wrapper.contains(<span>404</span>)).toBe(true);
    expect(wrapper.contains(<span>error happened</span>)).toBe(false);

    expect(wrapper.containsMatchingElement(<ComponentPartial />)).toBe(false);

    router.rootPathStore.dispatch(route.urlHandler.buildUrl({ param1: 'foo', param2: 2 }));

    expect(wrapper.contains(<span>404</span>)).toBe(false);
    expect(wrapper.contains(<Component param1="foo" param2={2} />)).toBe(true);
  });
});
