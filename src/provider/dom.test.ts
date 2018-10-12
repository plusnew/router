import Dom from './Dom';

describe('test dom provider', () => {
  let getPathSpy: jasmine.Spy;
  beforeEach(() => {
    getPathSpy = spyOn(Dom.prototype, 'getPath' as any).and.returnValue('foo');
  });

  it('domprovider should have the current path in the store', () => {
    const provider = new Dom();
    expect(provider.store.getCurrentState()).toBe('foo');
  });

  it('when calling push, replacestate should be called and the correct url should be in the store', () => {
    const pushStateSpy = spyOn(history, 'pushState');

    const provider = new Dom();
    provider.push('bar');

    expect(provider.store.getCurrentState()).toBe('bar');
    expect(pushStateSpy).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), 'bar');
  });

  it('when window.popstate got triggered, the store should get triggered with the new url', () => {
    const pushStateSpy = spyOn(history, 'pushState');
    const provider = new Dom();
    getPathSpy.and.returnValue('bar');
    window.dispatchEvent(new Event('popstate'));

    expect(provider.store.getCurrentState()).toBe('bar');
    // a pushstate is not allowed to happen, when a pop happed
    // else it will create unnecessary history entries
    expect(pushStateSpy).not.toHaveBeenCalled();
  });

  it('getPath should return pathname correctly', () => {
    getPathSpy.and.callThrough();

    const provider = new Dom();
    expect((provider as any).getPath()).toBe(location.pathname);
  });
});
