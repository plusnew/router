import Router, { BasicDriver } from '../../..';

describe('routeStore', () => {
  it('invalid routeStore action', () => {
    const testDriver = new BasicDriver('/');
    const router = new Router(testDriver);

    const route = router.createRoute('namespace', {}, () => null);

    expect(() => {
      route.store.dispatch({ type: 'foobar' } as any);
    }).toThrow(new Error('Invalid action for routestore'));
  });
});
