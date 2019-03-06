import enzymeAdapterPlusnew, { mount } from 'enzyme-adapter-plusnew';
import { configure } from 'enzyme';
import plusnew, { component, Props, store } from 'plusnew';
import { createRoute, StaticProvider, NotFound, Invalid, Redirect } from './index';
import { buildComponentPartial } from './test';

configure({ adapter: new enzymeAdapterPlusnew() });

describe('test router', () => {
  it('link should be found and be clickable', () => {
    const Component = component(
      'Component',
      (_Props: Props<{ parameter: { param1: string, param2: number } }>) => <div />,
    );

    const route = createRoute('namespace', {
      param1: 'string',
      param2: 'number',
    }, Component);

    const urlStore = store('/');

    const wrapper = mount(
      <>
        <urlStore.Observer>{urlState =>
          <StaticProvider url={urlState} onchange={urlStore.dispatch}>
            <route.Link parameter={{ param2: 2, param1: 'foo' }}>link</route.Link>
            <route.Component />
            <NotFound><span>404</span></NotFound>
            <Invalid><span>error happened</span></Invalid>
          </StaticProvider>
        }</urlStore.Observer>
      </>,
    );

    const ComponentPartial = buildComponentPartial(Component);
    expect(wrapper.contains(<span>404</span>)).toBe(true);
    expect(wrapper.contains(<span>error happened</span>)).toBe(false);

    expect(wrapper.containsMatchingElement(<a href="/namespace/param1/foo/param2/2/">link</a>)).toBe(true);
    expect(wrapper.containsMatchingElement(<ComponentPartial />)).toBe(false);

    wrapper.find('a').simulate('click');

    expect(urlStore.getState()).toBe('/namespace/param1/foo/param2/2/');

    expect(wrapper.contains(<span>404</span>)).toBe(false);
    expect(wrapper.contains(<Component parameter={{param1: 'foo', param2: 2 }} />)).toBe(true);

    urlStore.dispatch('/namespace/invalid/parameter');

    expect(wrapper.contains(<span>404</span>)).toBe(false);
    expect(wrapper.contains(<span>error happened</span>)).toBe(true);
  });

  it('components should be updatable', () => {
    const Component = component(
      'Component',
      (_Props: Props<{ parameter: { param1: string, param2: number } }>) => <div />,
    );

    const route = createRoute('namespace', {
      param1: 'string',
      param2: 'number',
    }, Component);

    const urlStore = store('/');

    const wrapper = mount(
      <>
        <urlStore.Observer>{urlState =>
          <StaticProvider url={urlState} onchange={urlStore.dispatch}>
            <route.Link parameter={{ param2: 2, param1: 'foo' }}>link</route.Link>
            <route.Component />
            <NotFound><span>404</span></NotFound>
            <Invalid><span>error happened</span></Invalid>
          </StaticProvider>
        }</urlStore.Observer>
      </>,
    );

    const ComponentPartial = buildComponentPartial(Component);
    expect(wrapper.contains(<span>404</span>)).toBe(true);
    expect(wrapper.contains(<span>error happened</span>)).toBe(false);

    expect(wrapper.containsMatchingElement(<a href="/namespace/param1/foo/param2/2/">link</a>)).toBe(true);
    expect(wrapper.containsMatchingElement(<ComponentPartial />)).toBe(false);

    wrapper.find('a').simulate('click');

    expect(urlStore.getState()).toBe('/namespace/param1/foo/param2/2/');

    expect(wrapper.contains(<span>error happened</span>)).toBe(false);
    expect(wrapper.contains(<span>404</span>)).toBe(false);
    expect(wrapper.contains(<Component parameter={{ param1: 'foo', param2: 2 }} />)).toBe(true);

    urlStore.dispatch('/namespace/param1/bar/param2/3');

    expect(wrapper.contains(<span>error happened</span>)).toBe(false);
    expect(wrapper.contains(<span>404</span>)).toBe(false);
    expect(wrapper.contains(<Component parameter={{ param1: 'bar', param2: 3 }} />)).toBe(true);
  });

  it('redirects should work', () => {
    const Component = component(
      'Component',
      (_Props: Props<{ parameter: { param1: string, param2: number } }>) => <div />,
    );

    const route = createRoute('namespace', {
      param1: 'string',
      param2: 'number',
    }, Component);

    const urlStore = store('/');

    const wrapper = mount(
      <>
        <urlStore.Observer>{urlState =>
          <StaticProvider url={urlState} onchange={urlStore.dispatch}>
            <route.Component />
            <NotFound><span>404</span></NotFound>
            <Invalid><span>error happened</span></Invalid>
          </StaticProvider>
        }</urlStore.Observer>
      </>,
    );

    const ComponentPartial = buildComponentPartial(Component);
    expect(wrapper.contains(<span>404</span>)).toBe(true);
    expect(wrapper.contains(<span>error happened</span>)).toBe(false);

    expect(wrapper.containsMatchingElement(<ComponentPartial />)).toBe(false);

    router.redirectStore.dispatch({ from: '/', to: route.urlHandler.buildUrl({ param1: 'foo', param2: 2 }) });

    expect(wrapper.contains(<span>404</span>)).toBe(false);
    expect(wrapper.contains(<Component parameter={{ param1: 'foo', param2: 2 }} />)).toBe(true);
  });

  it('redirects should work with weird slashes', () => {
    const Component = component(
      'Component',
      (_Props: Props<{}>) => <div />,
    );

    const route = createRoute(
      'foobar',
      {},
      Component,
    );
    const urlStore = store('/');

    const wrapper = mount(
      <>
        <urlStore.Observer>{urlState =>
          <StaticProvider url={urlState} onchange={urlStore.dispatch}>
            <route.Component />
            <NotFound><span>404</span></NotFound>
            <Invalid><span>error happened</span></Invalid>
          </StaticProvider>
        }</urlStore.Observer>
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

    urlStore.dispatch('/foo/');

    expect(wrapper.contains(<span>404</span>)).toBe(false);
    expect(wrapper.contains(<span>error happened</span>)).toBe(false);
    expect(wrapper.contains(<Component />)).toBe(true);
  });
});
