import { configure } from 'enzyme';
import enzymeAdapterPlusnew, { mount } from 'enzyme-adapter-plusnew';
import plusnew from 'plusnew';
import BrowserProvider from './index';
import url from 'contexts/url';

configure({ adapter: new enzymeAdapterPlusnew() });

describe('test dom driver', () => {
  let getPathSpy: jasmine.Spy;
  beforeEach(() => {
    getPathSpy = spyOn(BrowserProvider.prototype, 'getPath' as any).and.returnValue('foo');
  });

  it('dom driver should have the current path in the store', () => {
    const wrapper = mount(
      <BrowserProvider>
        <url.Consumer>{url => <span>{url}</span>}</url.Consumer>
      </BrowserProvider>,
    );

    expect(wrapper.contains(<span>foo</span>)).toBe(true);
  });

  it('when url context gets a new state, it should be displayed and history pushstate should be called', () => {
    const pushStateSpy = spyOn(history, 'pushState');

    const wrapper = mount(
      <BrowserProvider>
        <url.Consumer>{(url, dispatch) => <span onclick={() => dispatch('bar')}>{url}</span>}</url.Consumer>
      </BrowserProvider>,
    );

    expect(pushStateSpy.calls.count()).toBe(0);

    wrapper.find('span').simulate('click');

    expect(wrapper.containsMatchingElement(<span>bar</span>)).toBe(true);
    expect(pushStateSpy).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), 'bar');
  });

  it('when window.popstate got triggered, the store should get triggered with the new url', () => {
    const pushStateSpy = spyOn(history, 'pushState');

    const wrapper = mount(
      <BrowserProvider>
        <url.Consumer>{url => <span>{url}</span>}</url.Consumer>
      </BrowserProvider>,
    );

    expect(pushStateSpy.calls.count()).toBe(0);

    getPathSpy.and.returnValue('bar');
    window.dispatchEvent(new Event('popstate'));

    expect(wrapper.containsMatchingElement(<span>bar</span>)).toBe(true);

    // a pushstate is not allowed to happen, when a pop happed
    // else it will create unnecessary history entries
    expect(pushStateSpy).not.toHaveBeenCalled();
  });

  it('getPath should return pathname correctly', () => {
    getPathSpy.and.callThrough();

    expect((BrowserProvider.prototype as any).getPath()).toBe(location.pathname);
  });
});
