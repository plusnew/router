import Dom from './Browser';

describe('test dom driver', () => {
  let getPathSpy: jasmine.Spy;
  beforeEach(() => {
    getPathSpy = spyOn(Dom.prototype, 'getPath' as any).and.returnValue('foo');
  });

  it('dom driver should have the current path in the store', () => {
    const driver = new Dom();
    expect(driver.store.getState()).toBe('foo');
  });

  it('when calling push, replacestate should be called and the correct url should be in the store', () => {
    const pushStateSpy = spyOn(history, 'pushState');

    const driver = new Dom();
    driver.push('bar');

    expect(driver.store.getState()).toBe('bar');
    expect(pushStateSpy).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), 'bar');
  });

  it('when window.popstate got triggered, the store should get triggered with the new url', () => {
    const pushStateSpy = spyOn(history, 'pushState');
    const driver = new Dom();
    getPathSpy.and.returnValue('bar');
    window.dispatchEvent(new Event('popstate'));

    expect(driver.store.getState()).toBe('bar');
    // a pushstate is not allowed to happen, when a pop happed
    // else it will create unnecessary history entries
    expect(pushStateSpy).not.toHaveBeenCalled();
  });

  it('getPath should return pathname correctly', () => {
    getPathSpy.and.callThrough();

    const driver = new Dom();
    expect((driver as any).getPath()).toBe(location.pathname);
  });
});
