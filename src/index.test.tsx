import enzymeAdapterPlusnew, { mount } from 'enzyme-adapter-plusnew';
import { configure } from 'enzyme';
import plusnew, { component, Props, storeType, store } from 'plusnew';
import Router from './index';
import { buildComponentPartial } from './test';

configure({ adapter: new enzymeAdapterPlusnew() });

describe('test router', () => {
  let testProvider: {
    store: storeType<string, string>;
    push: (url: string) => void;
  };

  beforeEach(() => {
    testProvider = {
      store: store('/', (_state, action: string) => action),
      push: (url: string) => testProvider.store.dispatch(url),
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
    }, params => <Component {...params} />);

    const wrapper = mount(
      <>
        <route.Link parameter={{ param2: 2, param1: 'foo' }}>link</route.Link>
        <route.Component />
        <router.NotFound><span>404</span></router.NotFound>
      </>,
    );

    const ComponentPartial = buildComponentPartial(Component);
    // expect(wrapper.contains(<span>404</span>)).toBe(true);

    expect(wrapper.containsMatchingElement(<a href="/namespace/param1/foo/param2/2/">link</a>)).toBe(true);
    expect(wrapper.containsMatchingElement(<ComponentPartial />)).toBe(false);

    wrapper.find('a').simulate('click');

    expect(testProvider.store.getCurrentState()).toBe('/namespace/param1/foo/param2/2/');

    expect(wrapper.contains(<span>404</span>)).toBe(false);
    expect(wrapper.contains(<Component param1="foo" param2={2} />)).toBe(true);
  });
});
