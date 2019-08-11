import plusnew, { component, Props, store } from '@plusnew/core';
import enzymeAdapterPlusnew, { getComponentPartial, mount } from '@plusnew/enzyme-adapter';
import { configure } from 'enzyme';
import { createRoute, Invalid, NotFound, serializer, StaticProvider } from './index';

configure({ adapter: new enzymeAdapterPlusnew() });

describe('test router', () => {
  it('link should be found and be clickable', () => {
    const Component = component(
      'Component',
      (_Props: Props<{ parameter: { param1: string, param2: number }, props: {} }>) => <div />,
    );

    const route = createRoute(['namespace'], {
      param1: [serializer.string()],
      param2: [serializer.number()],
    }, Component);

    const urlStore = store('/');

    const wrapper = mount(
      <urlStore.Observer>{urlState =>
        <StaticProvider url={urlState} onchange={urlStore.dispatch}>
          <route.Link parameter={{ param2: 2, param1: 'foo' }}>link</route.Link>
          <route.Component />
          <Invalid><span>error happened</span></Invalid>
          <NotFound><span>404</span></NotFound>
        </StaticProvider>
      }</urlStore.Observer>,
    );

    const ComponentPartial = getComponentPartial(Component);
    expect(wrapper.contains(<span>404</span>)).toBe(true);
    expect(wrapper.contains(<span>error happened</span>)).toBe(false);

    expect(wrapper.containsMatchingElement(<a href="/namespace?param1=foo&param2=2">link</a>)).toBe(true);
    expect(wrapper.containsMatchingElement(<ComponentPartial />)).toBe(false);

    wrapper.find('a').simulate('click');

    expect(urlStore.getState()).toBe('/namespace?param1=foo&param2=2');

    expect(wrapper.contains(<span>404</span>)).toBe(false);
    expect(wrapper.contains(<Component parameter={{ param1: 'foo', param2: 2 }} props={{ children: [] }} />)).toBe(true);

    urlStore.dispatch('/namespace?invalid=parameter');

    expect(wrapper.contains(<span>404</span>)).toBe(false);
    expect(wrapper.contains(<span>error happened</span>)).toBe(true);
  });

  it('components should be updatable', () => {
    const Component = component(
      'Component',
      (_Props: Props<{ parameter: { param1: string, param2: number }, props: {} }>) => <div />,
    );

    const route = createRoute(['namespace'], {
      param1: [serializer.string()],
      param2: [serializer.number()],
    }, Component);

    const urlStore = store('/');

    const wrapper = mount(
      <urlStore.Observer>{urlState =>
        <StaticProvider url={urlState} onchange={urlStore.dispatch}>
          <route.Link parameter={{ param2: 2, param1: 'foo' }}>link</route.Link>
          <route.Component />
          <Invalid><span>error happened</span></Invalid>
          <NotFound><span>404</span></NotFound>
        </StaticProvider>
      }</urlStore.Observer>,
    );

    const ComponentPartial = getComponentPartial(Component);
    expect(wrapper.contains(<span>404</span>)).toBe(true);
    expect(wrapper.contains(<span>error happened</span>)).toBe(false);

    expect(wrapper.containsMatchingElement(<a href="/namespace?param1=foo&param2=2">link</a>)).toBe(true);
    expect(wrapper.containsMatchingElement(<ComponentPartial />)).toBe(false);

    wrapper.find('a').simulate('click');

    expect(urlStore.getState()).toBe('/namespace?param1=foo&param2=2');

    expect(wrapper.contains(<span>error happened</span>)).toBe(false);
    expect(wrapper.contains(<span>404</span>)).toBe(false);
    expect(wrapper.contains(<Component parameter={{ param1: 'foo', param2: 2 }} props={{ children: [] }} />)).toBe(true);

    urlStore.dispatch('/namespace?param1=bar&param2=3');

    expect(wrapper.contains(<span>error happened</span>)).toBe(false);
    expect(wrapper.contains(<span>404</span>)).toBe(false);
    expect(wrapper.contains(<Component parameter={{ param1: 'bar', param2: 3 }} props={{ children: [] }} />)).toBe(true);
  });

  it('mounting and unmounting component switches notfound', () => {
    const Component = component('Component', (_Props: Props<{props: {}, parameter: {}}>) => <div />);
    const ComponentPartial = getComponentPartial(Component);

    const route = createRoute(['namespace'], {}, Component);
    const local = store(false);

    const wrapper = mount(
      <StaticProvider url="namespace" onchange={() => null}>
        <local.Observer>{localState => localState && <route.Component />}</local.Observer>
        <NotFound><span>404</span></NotFound>
      </StaticProvider>,
    );

    expect(wrapper.contains(<span>404</span>)).toBe(true);
    expect(wrapper.containsMatchingElement(<ComponentPartial />)).toBe(false);

    local.dispatch(true);

    expect(wrapper.contains(<span>404</span>)).toBe(false);
    expect(wrapper.containsMatchingElement(<ComponentPartial />)).toBe(true);

    local.dispatch(false);

    expect(wrapper.contains(<span>404</span>)).toBe(true);
    expect(wrapper.containsMatchingElement(<ComponentPartial />)).toBe(false);
  });
});
