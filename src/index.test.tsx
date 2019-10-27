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
  });

  it('does createChildRoute work as expected', () => {
    const urlStore = store('/rootPath;parentParam=foo/childpath;childParam=bar');

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
          <>
            <span>{props.parameter.rootPath.parentParam}</span>
            <span>{props.parameter.childPath.parentParam}</span>
          </>
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
      <>
        <span>foo</span>
        <span>bar</span>
      </>,
    )).toBe(true);
  });
});
