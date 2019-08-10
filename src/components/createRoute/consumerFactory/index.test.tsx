import { configure } from 'enzyme';
import enzymeAdapterPlusnew, { mount } from '@plusnew/enzyme-adapter';
import plusnew, { component, Props } from '@plusnew/core';
import { createRoute, StaticProvider, parameters } from '../../../index';

configure({ adapter: new enzymeAdapterPlusnew() });

describe('test consumer', () => {
  it('valid', () => {
    const Component = component(
      'Component',
      (_Props: Props<{ parameter: { foo: string }, props: {} }>) => <div />,
    );

    const route = createRoute(['namespace'], {
      foo: [parameters.string],
    }, Component);

    const wrapper = mount(
      <StaticProvider url="/namespace?foo=fooValue" onchange={() => null}>
        <route.Consumer>{routeState =>
          <span>{routeState.active ? routeState.parameter.foo : 'inactive'}</span>
        }</route.Consumer>
      </StaticProvider>,
    );

    expect(wrapper.contains(<span>fooValue</span>)).toBe(true);
    expect(wrapper.contains(<span>inactive</span>)).toBe(false);
  });

  it('invalid', () => {
    const Component = component(
      'Component',
      (_Props: Props<{ parameter: { foo: string }, props: {} }>) => <div />,
    );

    const route = createRoute(['namespace'], {
      foo: [parameters.string],
    }, Component);

    const wrapper = mount(
      <StaticProvider url="/namespace?bar=barValue" onchange={() => null}>
        <route.Consumer>{routeState =>
          <span>{routeState.active ? 'active' : 'inactive'}</span>
        }</route.Consumer>
      </StaticProvider>,
    );

    expect(wrapper.contains(<span>active</span>)).toBe(false);
    expect(wrapper.contains(<span>inactive</span>)).toBe(true);
  });

  it('anotherNamespace', () => {
    const Component = component(
      'Component',
      (_Props: Props<{ parameter: { foo: string }, props: {} }>) => <div />,
    );

    const route = createRoute(['namespace'], {
      foo: [parameters.string],
    }, Component);

    const wrapper = mount(
      <StaticProvider url="/anotherNamespace?foo=fooValue" onchange={() => null}>
        <route.Consumer>{routeState =>
          <span>{routeState.active ? 'active' : 'inactive'}</span>
        }</route.Consumer>
      </StaticProvider>,
    );

    expect(wrapper.contains(<span>active</span>)).toBe(false);
    expect(wrapper.contains(<span>inactive</span>)).toBe(true);
  });
});
