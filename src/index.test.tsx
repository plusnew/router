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
    }, Params => <Params>{params => <Component {...params} />}</Params>);

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

  it('components should be updatable', () => {
    const router = new Router(basicDriver);

    const Component = component(
      'Component',
      (_Props: Props<{param1: string, param2: number}>) => <div />,
    );

    const route = router.createRoute('namespace', {
      param1: 'string',
      param2: 'number',
    }, Params => <Params>{params => <Component {...params} />}</Params>);

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

    expect(wrapper.contains(<span>error happened</span>)).toBe(false);
    expect(wrapper.contains(<span>404</span>)).toBe(false);
    expect(wrapper.contains(<Component param1="foo" param2={2} />)).toBe(true);

    basicDriver.store.dispatch('/namespace/param1/bar/param2/3');

    expect(wrapper.contains(<span>error happened</span>)).toBe(false);
    expect(wrapper.contains(<span>404</span>)).toBe(false);
    expect(wrapper.contains(<Component param1="bar" param2={3} />)).toBe(true);
  });

  it('redirects should work', () => {
    const router = new Router(basicDriver);

    const Component = component(
      'Component',
      (_Props: Props<{param1: string, param2: number}>) => <div />,
    );

    const route = router.createRoute('namespace', {
      param1: 'string',
      param2: 'number',
    }, Params => <Params>{params => <Component {...params} />}</Params>);

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

    router.redirectStore.dispatch({ from: '/', to: route.urlHandler.buildUrl({ param1: 'foo', param2: 2 }) });

    expect(wrapper.contains(<span>404</span>)).toBe(false);
    expect(wrapper.contains(<Component param1="foo" param2={2} />)).toBe(true);
  });

  it('redirects should work with weird slashes', () => {
    const router = new Router(basicDriver);

    const Component = component(
      'Component',
      (_Props: Props<{}>) => <div />,
    );

    const route = router.createRoute(
      'foobar',
      {},
      Params => <Params>{params => <Component {...params} />}</Params>,
    );

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

    router.redirectStore.dispatch({ from: '/foo', to: 'foobar' });
    router.redirectStore.dispatch({ from: 'mep', to: 'bar' });

    expect(wrapper.contains(<span>404</span>)).toBe(true);
    expect(wrapper.contains(<span>error happened</span>)).toBe(false);
    expect(wrapper.containsMatchingElement(<ComponentPartial />)).toBe(false);

    basicDriver.store.dispatch('/foo/');

    expect(wrapper.contains(<span>404</span>)).toBe(false);
    expect(wrapper.contains(<span>error happened</span>)).toBe(false);
    expect(wrapper.contains(<Component />)).toBe(true);
  });
});
