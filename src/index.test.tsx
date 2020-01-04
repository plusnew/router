import plusnew, { component, store } from '@plusnew/core';
import enzymeAdapterPlusnew, { mount } from '@plusnew/enzyme-adapter';
import { configure } from 'enzyme';
import { createRoute, serializer, StaticProvider } from './index';

configure({ adapter: new enzymeAdapterPlusnew() });

describe('api', () => {
  it('does createroute work as expected', () => {
    const urlStore = store('/rootPath;parentParam=foo');

    const rootRoute = createRoute('rootPath', {
      parentParam: [serializer.string()],
    } as const, component(
      'RootComponent',
      Props => <Props>{props => <div>{props.parameter.rootPath.parentParam}</div>}</Props>,
    ));

    const wrapper = mount(
      <urlStore.Observer>{urlState =>
        <StaticProvider url={urlState} onchange={urlStore.dispatch}>
          <rootRoute.Component />
        </StaticProvider>
      }</urlStore.Observer>,
    );

    expect(wrapper.contains(<div>foo</div>)).toBe(true);

    wrapper.unmount();
  });

  it('does createChildRoute work as expected', () => {
    const urlStore = store('/rootPath;parentParam=foo/childPath;childParam=bar');

    const rootRoute = createRoute('rootPath', {
      parentParam: [serializer.string()],
    } as const, component(
      'RootComponent',
      Props => <Props>{props => <div>{props.parameter.rootPath.parentParam}</div>}</Props>,
    ));

    const childRoute = rootRoute.createChildRoute('childPath', {
      childParam: [serializer.string()],
    } as const, component(
      'RootComponent',
      Props =>
        <Props>{props =>
          <div>
            <span>{props.parameter.rootPath.parentParam}</span>
            <span>{props.parameter.childPath.childParam}</span>
          </div>
        }</Props>,
    ));

    const wrapper = mount(
      <urlStore.Observer>{urlState =>
        <StaticProvider url={urlState} onchange={urlStore.dispatch}>
          <rootRoute.Component />
          <childRoute.Component />
        </StaticProvider>
      }</urlStore.Observer>,
    );

    expect(wrapper.contains(<div>foo</div>)).toBe(false);
    expect(wrapper.contains(
      <div>
        <span>foo</span>
        <span>bar</span>
      </div>,
    )).toBe(true);

    wrapper.unmount();
  });

  it('does Consumer work as expected when active', () => {
    const urlStore = store('/rootPath;parentParam=foo');

    const rootRoute = createRoute('rootPath', {
      parentParam: [serializer.string()],
    } as const, component(
      'RootComponent',
      Props => <Props>{props => <div>{props.parameter.rootPath.parentParam}</div>}</Props>,
    ));

    const wrapper = mount(
      <urlStore.Observer>{urlState =>
        <StaticProvider url={urlState} onchange={urlStore.dispatch}>
          <rootRoute.Consumer>{rootRouteState =>
            <div>
              {rootRouteState.isActive && (
                <span>{rootRouteState.parameter.rootPath.parentParam}</span>
              )}
            </div>
          }</rootRoute.Consumer>
        </StaticProvider>
      }</urlStore.Observer>,
    );

    expect(wrapper.contains(
      <div>
        <span>foo</span>
      </div>,
    )).toBe(true);

    wrapper.unmount();
  });

  it('does Consumer work as expected when ill-formed', () => {
    const urlStore = store('/somepath');

    const rootRoute = createRoute('rootPath', {
      parentParam: [serializer.string()],
    } as const, component(
      'RootComponent',
      Props => <Props>{props => <div>{props.parameter.rootPath.parentParam}</div>}</Props>,
    ));

    const wrapper = mount(
      <urlStore.Observer>{urlState =>
        <StaticProvider url={urlState} onchange={urlStore.dispatch}>
          <rootRoute.Consumer>{rootRouteState =>
            <div>
              {rootRouteState.isActive ? (
                <span>{rootRouteState.parameter.rootPath.parentParam}</span>
              ) : 'inactive'}
            </div>
          }</rootRoute.Consumer>
        </StaticProvider>
      }</urlStore.Observer>,
    );

    expect(wrapper.contains(
      <div>inactive</div>,
    )).toBe(true);

    wrapper.unmount();
  });

  it('does Consumer work as expected when inactive', () => {
    const urlStore = store('/rootPath;parentParam=foo');

    const rootRoute = createRoute('rootPath', {
      parentParam: [serializer.number()],
    } as const, component(
      'RootComponent',
      Props => <Props>{props => <div>{props.parameter.rootPath.parentParam}</div>}</Props>,
    ));

    const wrapper = mount(
      <urlStore.Observer>{urlState =>
        <StaticProvider url={urlState} onchange={urlStore.dispatch}>
          <rootRoute.Consumer>{rootRouteState =>
            <div>
              {rootRouteState.isActive ? (
                <span>{rootRouteState.parameter.rootPath.parentParam}</span>
              ) : 'inactive'}
            </div>
          }</rootRoute.Consumer>
        </StaticProvider>
      }</urlStore.Observer>,
    );

    expect(wrapper.contains(
      <div>inactive</div>,
    )).toBe(true);

    wrapper.unmount();
  });

  it('does Consumer work as expected when parent', () => {
    const urlStore = store('/rootPath;parentParam=foo/childPath;childParam=bar');

    const rootRoute = createRoute('rootPath', {
      parentParam: [serializer.string()],
    } as const, component(
      'RootComponent',
      Props => <Props>{props => <div>{props.parameter.rootPath.parentParam}</div>}</Props>,
    ));

    const wrapper = mount(
      <urlStore.Observer>{urlState =>
        <StaticProvider url={urlState} onchange={urlStore.dispatch}>
          <rootRoute.Consumer>{rootRouteState =>
            <div>
              {rootRouteState.isActiveAsParent && (
                <span>{rootRouteState.parameter.rootPath.parentParam}</span>
              )}
            </div>
          }</rootRoute.Consumer>
        </StaticProvider>
      }</urlStore.Observer>,
    );

    expect(wrapper.contains(
      <div>
        <span>foo</span>
      </div>,
    )).toBe(true);

    wrapper.unmount();
  });
});
