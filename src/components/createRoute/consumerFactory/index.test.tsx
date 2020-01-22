import plusnew, { component, store } from '@plusnew/core';
import enzymeAdapterPlusnew, { mount } from '@plusnew/enzyme-adapter';
import { configure } from 'enzyme';
import { createRoute, serializer, StaticProvider } from '../../../index';

configure({ adapter: new enzymeAdapterPlusnew() });

describe('consumer', () => {
  it('programmatic redirect', () => {
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
          <rootRoute.Consumer>{(_rootRouteState, redirect) =>
            <span
              onclick={() =>
                redirect({
                  parameter: {
                    rootPath: {
                      parentParam: 'bar',
                    },
                  },
                })
              }
            />
          }</rootRoute.Consumer>
        </StaticProvider>
      }</urlStore.Observer>,
    );

    wrapper.find('span').simulate('click');

    expect(urlStore.getState()).toBe('/rootPath;parentParam=bar');
  });
});
