import Router from '../../';
import { store } from 'plusnew';

describe('routeStore', () => {
  it('invalid routeStore action', () => {
    const testProvider = {
      store: store('/', (_state, action: string) => action),
      push: (url: string) => testProvider.store.dispatch(url),
    };
    const router = new Router(testProvider);

    const route = router.createRoute('namespace', {}, () => null);

    expect(() => {
      route.store.dispatch({ type: 'foobar' } as any);
    }).toThrow(new Error('Invalid action for routestore'));
  });
});
